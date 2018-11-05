<template>
  <div class="stage-box" ref="box">
    <div id="stage" :style="stageStyle">
      <div v-for="(resource, index) in resourceObjects" :key="index" class="resource bg-color-green" :style="resourceStyle(resource)"></div>
      <div v-for="(agent, index) in redAgentObjects" :key="`A-${index}`" class="red-agent bg-color-red" :style="agentStyle(agent)"></div>
      <div v-for="(agent, index) in blueAgentObjects" :key="`B-${index}`" class="blue-agent bg-color-blue" :style="agentStyle(agent)"></div>
    </div>
  </div>
</template>

<script>
import Globals from '@/classes/Globals.js'

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
      redAgentObjects: [],
      blueAgentObjects: [],
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
      this.smallObjectSize = 0.03 * this.minimumDimension
      this.mediumObjectSize = 0.04 * this.minimumDimension
      this.bigObjectSize = 0.1 * this.minimumDimension
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

    // create resources todo: create and destroy dynamically
    for (let i = 0; i < this.numResources; i++) {
      let resourceObject = this.randomPosition()
      resourceObject.life = Math.random()
      this.resourceObjects.push(resourceObject)
    }

    this.$store.commit('resetScore')

    // turn on:
    // turn on robot sensors and brains
    let allAgents = this.$store.state.redAgents.concat(this.$store.state.blueAgents)
    allAgents.forEach(agent => {
      agent.robot.turnBrainOn()
      agent.robot.turnSensorsOn()
    })
    window.requestAnimationFrame(this.update.bind(this))
  },
  methods: {
    update (timestamp) {
      // compute deltaTime:
      let deltaTime = 0
      if (this.previousTimestamp != null) {
        deltaTime = 0.001 * (timestamp - this.previousTimestamp)
      }
      this.previousTimestamp = timestamp

      // decrease resource size:
      this.resourceObjects.forEach(resource => {
        resource.life -= (deltaTime / this.resourceVanishingTime)
        // and relocate when the time is there:
        if (resource.life < 0) {
          resource.x = Math.random() - 0.5
          resource.y = Math.random() - 0.5
          resource.life = 1
        }
      })

      // collect environment state
      let environmentState = {
        redRobots: this.redAgentObjects,
        blueRobots: this.blueAgentObjects,
        resources: this.resourceObjects
      }
      // pass to agents
      let allAgents = this.$store.state.redAgents.concat(this.$store.state.blueAgents)
      allAgents.forEach(agent => {
        agent.robot.setEnvironmentState(environmentState)
      })

      // retrieve robot actuator state
      this.redAgentObjects.forEach(agentObject => {
        let actuators = agentObject.agent.robot.getActuatorState()
        this.moveRedAgent(agentObject, actuators['MOVE_X'], actuators['MOVE_Y'], deltaTime)
      })
      // hereiam move blue agent, detect collisions, tweak model

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
    moveRedAgent (agentObject, x, y, deltaTime) {
      // move object
      // todo: max x, y vector length so diagonal move is not faster
      if (Math.abs(x) > 0 || Math.abs(y) > 0) {
        let length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
        x = x / length
        y = y / length
      }
      agentObject.x += x * Globals.agentSpeed * deltaTime
      agentObject.y += y * Globals.agentSpeed * deltaTime
      // detect collisions
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
    overflow: hidden;
    border: 2px solid #ABB2BF;
    background-color: #21252B;
  }

  .resource, .red-agent, .blue-agent {
    position: absolute;
    border-radius: 100%;
  }
</style>
