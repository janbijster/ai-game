<template>
  <div class="stage-box" ref="box">
    <div id="stage" :style="stageStyle">
      <div v-for="(resource, index) in resourceObjects" :key="index" :ref="`resource-${index}`" class="resource bg-color-green" :style="resourceStyle(resource)"></div>
      <div v-for="(agent, index) in redAgentObjects" :key="`A-${index}`" :ref="`red-agent-${index}`" class="red-agent bg-color-red" :style="agentStyle(agent)"></div>
      <div v-for="(agent, index) in blueAgentObjects" :key="`B-${index}`" :ref="`blue-agent-${index}`" class="blue-agent bg-color-blue" :style="agentStyle(agent)"></div>
    </div>
  </div>
</template>

<script>
import Globals from '@/classes/Globals.js'
import Sounds from '@/classes/Sounds.js'

export default {
  name: 'SimulationSpace',
  data () {
    return {
      bounds: {},
      stageStyle: {},
      minimumDimension: 0,
      smallObjectSize: 0,
      mediumObjectSize: 0,
      bigObjectSize: 0,
      objectSize: 0,
      mediumObjectSquareCollisionDistance: 0,
      redAgentObjects: [],
      blueAgentObjects: [],
      allAgentObjects: [],
      resourceObjects: [],
      numResources: 5,
      previousTimestamp: null,
      resourceVanishingTime: 5
    }
  },
  mounted () {
    if (!this.$store.state.simulationOn) {
      return
    }

    if (this.$refs['box'] != null) {
      this.bounds = this.$refs['box'].getBoundingClientRect()
      this.minimumDimension = Math.min(this.bounds.width, this.bounds.height)
      this.smallObjectSize = 0.05 * this.minimumDimension
      this.mediumObjectSize = 0.07 * this.minimumDimension
      this.bigObjectSize = 0.1 * this.minimumDimension
      this.mediumObjectSquareCollisionDistance = Math.pow(this.mediumObjectSize / this.minimumDimension, 2)
    }
    this.updateStageStyle()

    // start robots, create agentObjects
    this.$store.state.redAgents.forEach(agent => {
      let agentObject = this.randomPosition()
      agentObject.id = agent.robot.id
      this.redAgentObjects.push(agentObject)
      // cross refs:
      agentObject.agent = agent
      agent.agentObject = agentObject
    })
    this.$store.state.blueAgents.forEach(agent => {
      let agentObject = this.randomPosition()
      agentObject.id = agent.robot.id
      this.blueAgentObjects.push(agentObject)
      // cross refs:
      agentObject.agent = agent
      agent.agentObject = agentObject
    })
    this.allAgentObjects = this.redAgentObjects.concat(this.blueAgentObjects)

    // create resources
    for (let i = 0; i < this.numResources; i++) {
      let resourceObject = this.randomPosition()
      resourceObject.life = Math.random()
      this.resourceObjects.push(resourceObject)
    }

    // this.$store.commit('resetScore')

    // turn on:
    // turn on robot sensors and brains
    this.allAgentObjects.forEach(agentObject => {
      agentObject.agent.robot.turnBrainOn()
      agentObject.agent.robot.turnSensorsOn()
    })
    window.requestAnimationFrame(this.update.bind(this))
  },
  methods: {
    update (timestamp) {
      if (!this.$store.state.simulationOn) {
        return
      }
      // compute deltaTime:
      let deltaTime = 0
      if (this.previousTimestamp != null) {
        deltaTime = 0.001 * (timestamp - this.previousTimestamp)
      }
      this.previousTimestamp = timestamp

      // decrease resource size:
      this.resourceObjects.forEach(resource => {
        // change: decrease resource on hit only
        resource.life -= (0.25 * deltaTime / this.resourceVanishingTime)
        // and relocate when the time is there:
        if (resource.life < 0) {
          this.renewResource(resource)
        }
      })

      // collect environment state
      let environmentState = {
        redRobots: this.redAgentObjects,
        blueRobots: this.blueAgentObjects,
        resources: this.resourceObjects
      }
      // pass to agents
      this.allAgentObjects.forEach(agentObject => {
        agentObject.agent.robot.setEnvironmentState(environmentState)
      })

      // retrieve robot actuator state and move
      this.redAgentObjects.forEach(agentObject => {
        let actuators = agentObject.agent.robot.getActuatorState()
        this.moveAgent(agentObject, actuators['MOVE_X'], actuators['MOVE_Y'], deltaTime, 'red')
      })
      this.blueAgentObjects.forEach(agentObject => {
        let actuators = agentObject.agent.robot.getActuatorState()
        this.moveAgent(agentObject, actuators['MOVE_X'], actuators['MOVE_Y'], deltaTime, 'blue')
      })

      window.requestAnimationFrame(this.update.bind(this))
    },
    updateStageStyle () {
      if (this.bounds.width > this.bounds.height) {
        this.stageStyle = {
          left: 0.5 * (this.bounds.width - this.minimumDimension) + 'px',
          top: 0,
          width: this.minimumDimension + 'px',
          height: this.minimumDimension + 'px'
        }
      } else {
        this.stageStyle = {
          left: 0,
          top: 0,
          width: this.minimumDimension + 'px',
          height: this.minimumDimension + 'px'
        }
      }
    },
    makeUnitLength (x, y) {
      if (Math.abs(x) > 0 || Math.abs(y) > 0) {
        let length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
        x = x / length
        y = y / length
      }
      return { x: x, y: y }
    },
    moveAgent (agentObject, x, y, deltaTime, color) {
      // move object
      // calculate unit vector in move direction
      // let unitVector = this.makeUnitLength(x, y)
      // x = unitVector.x
      // y = unitVector.y
      // insert some inertia:
      if (agentObject.lastX !== undefined) {
        x = (1 - this.inertia) * x + this.inertia * agentObject.lastX
        y = (1 - this.inertia) * y + this.inertia * agentObject.lastY
      }
      agentObject.lastX = x
      agentObject.lastY = y

      agentObject.x += x * Globals.agentSpeed * deltaTime
      agentObject.y += y * Globals.agentSpeed * deltaTime
      // detect collisions

      // resources:
      this.resourceObjects.forEach(resourceObject => {
        if (
          this.squareDistance(resourceObject, agentObject) <
          Math.pow(0.5 * (this.mediumObjectSize + resourceObject.life * this.smallObjectSize) / this.minimumDimension, 2)
        ) {
          // resource hit!
          let rounderdResourceLifeBefore = Math.floor(resourceObject.life * this.resourceVanishingTime)
          resourceObject.life -= (deltaTime / this.resourceVanishingTime)
          let roundedResourceLifeAfter = Math.floor(resourceObject.life * this.resourceVanishingTime)
          if (roundedResourceLifeAfter < rounderdResourceLifeBefore) {
            Sounds.PlaySound('jump')
            let mutationName = color === 'red' ? 'incrementScoreRed' : 'incrementScoreBlue'
            this.$store.commit(mutationName)
          }
          // this.renewResource(resourceObject)
        }
      })

      // agents:
      this.allAgentObjects.forEach(otherAgentObject => {
        if (otherAgentObject !== agentObject) {
          let dist = this.squareDistance(agentObject, otherAgentObject)
          if (dist < this.mediumObjectSquareCollisionDistance) {
            // collide with other agent
            Sounds.PlaySound('explosion')
            // push other agent out of the way:
            let xNudge = otherAgentObject.x - agentObject.x
            let yNudge = otherAgentObject.y - agentObject.y
            let unitVector = this.makeUnitLength(xNudge, yNudge)
            xNudge = unitVector.x
            yNudge = unitVector.y
            // with a nudgesize > 0.5 we make sure that if they both nudge each other, they stop overlapping
            let nudgeSize = 3 * Math.sqrt(this.mediumObjectSquareCollisionDistance - dist)
            otherAgentObject.x += xNudge * nudgeSize
            otherAgentObject.y += yNudge * nudgeSize
          }
        }
      })

      // walls:
      agentObject.x = this.clamp(agentObject.x, -0.5, 0.5)
      agentObject.y = this.clamp(agentObject.y, -0.5, 0.5)
    },
    clamp (val, min, max) {
      return Math.min(Math.max(val, min), max)
    },
    squareDistance (object1, object2) {
      return Math.pow(object1.x - object2.x, 2) + Math.pow(object1.y - object2.y, 2)
    },
    renewResource (resourceObject) {
      if (resourceObject == null) {
        resourceObject = {}
      }
      resourceObject.x = Math.random() - 0.5
      resourceObject.y = Math.random() - 0.5
      resourceObject.life = 1
      return resourceObject
    },
    randomPosition () {
      return {
        x: Math.random() - 0.5,
        y: Math.random() - 0.5
      }
    },
    resourceStyle (resourceObject) {
      let dim = this.smallObjectSize * resourceObject.life
      return this.objectStyle(dim, resourceObject.x, resourceObject.y)
    },
    agentStyle (agentObject) {
      let dim = this.mediumObjectSize
      return this.objectStyle(dim, agentObject.x, agentObject.y)
    },
    objectStyle (dim, x, y) {
      return {
        width: dim + 'px',
        height: dim + 'px',
        left: ((x + 0.5) * this.minimumDimension - 0.5 * dim) + 'px',
        top: ((-y + 0.5) * this.minimumDimension - 0.5 * dim) + 'px'
      }
    }
  },
  computed: {
    inertia () {
      return Globals.agentInertia
    }
  }
}
</script>

<style scoped>
  .stage-box {
    width: 100%;
    height: 100%
  }
  #stage {
    position: absolute;
    /* overflow: hidden; */
    border: 2px solid #ABB2BF;
    background-color: #21252B;
  }

  .resource, .red-agent, .blue-agent {
    position: absolute;
    border-radius: 100%;
  }
  .red-agent, .blue-agent {
    box-shadow: -15px 15px 3px rgba(0, 0, 0, 0.3);
  }
  .resource {
    box-shadow: -3px 3px 3px rgba(0, 0, 0, 0.3);
  }
</style>
