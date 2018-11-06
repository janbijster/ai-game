<template>
  <div>
    <div class="subtitle">{{ currentTask }}<template v-if="isTraining"> {{ timeRemaining | round }}</template>...</div>
    <div class="training-visualization">
      <div class="left-part color-red">
        <div class="margin-top">
          <div id="training-text-red">
            <!-- Current loss: {{ loss.red }} -->
          </div>
          <div class="loss-indicator-holder">
            <div class="loss-indicator" :style="redLossIndicatorStyle"></div>
          </div>
        </div>
      </div>
      <div class="right-part color-blue">
        <div class="margin-top">
          <div id="training-text-blue">
            <!-- Current loss: {{ loss.blue }} -->
          </div>
          <div class="loss-indicator-holder">
            <div class="loss-indicator" :style="blueLossIndicatorStyle"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Robot from '@/classes/Robot.js'
import Globals from '@/classes/Globals.js'
import Sounds from '@/classes/Sounds.js'

export default {
  name: 'CreateAgentTrain',
  props: {
    redAgent: Object,
    blueAgent: Object
  },
  data () {
    return {
      isTraining: false,
      currentTask: 'Creating agents',
      redRobot: null,
      blueRobot: null,
      intervalId: null,
      redLossIndicatorStyle: {},
      blueLossIndicatorStyle: {},
      loss: { red: 1, blue: 1 },
      timeRemaining: 10,
      updateInterval: 200,
      agentsDone: 0
    }
  },
  mounted () {
    // create agents after everything is loaded:
    Sounds.PlaySound('coin1')
    setTimeout(this.createAgents.bind(this), 500)
  },
  methods: {
    createAgents () {
      this.currentTask = 'Creating models'
      this.redAgent.robot = new Robot([this.redAgent.part])
      this.blueAgent.robot = new Robot([this.blueAgent.part])
      setTimeout(this.startTraining.bind(this), 1000)
    },
    startTraining () {
      console.log('just created the robots, states: ', this.redAgent.robot.getState(), this.blueAgent.robot.getState())
      console.log('now let\'s train...')

      this.currentTask = 'Training'
      this.isTraining = true
      this.timeRemaining = Globals.trainingTime

      this.redAgent.robot.setSamples(0, this.redAgent.samples)
      this.blueAgent.robot.setSamples(0, this.blueAgent.samples)

      this.intervalId = setInterval(this.showProgress, this.updateInterval)
      setTimeout(this.stopTraining.bind(this), 1000 * (this.timeRemaining + 0.2))
    },
    showProgress () {
      Sounds.PlaySound('click')
      // console.log('red: ', this.redAgent.robot.getState().parts[0].modelState.currentLoss)
      // console.log('blue: ', this.blueAgent.robot.getState().parts[0].modelState.currentLoss)
      this.timeRemaining -= 0.001 * this.updateInterval

      this.loss = {
        red: this.redAgent.robot.trainBatch(0),
        blue: this.blueAgent.robot.trainBatch(0)
      }
      this.redLossIndicatorStyle = {
        backgroundColor: '#BE5046',
        width: (100 * (1 - this.loss.red)) + '%'
      }
      this.blueLossIndicatorStyle = {
        backgroundColor: '#528BFF',
        width: (100 * (1 - this.loss.blue)) + '%'
      }
    },
    stopTraining () {
      this.$store.commit('addRedAgent', this.redAgent)
      this.$store.commit('addBlueAgent', this.blueAgent)
      clearInterval(this.intervalId)
      this.$router.push({ name: 'simulation' })
      this.$store.commit('turnSimulationOn')
    }
  }
}
</script>

<style scoped>
  .loss-indicator-holder {
    position: absolute;
    width: 100%;
    top: 30px;
    height: 30px;
    background-color: #21252B;
  }
  .loss-indicator {
    position: absolute;
    height: 100%;
    left: 0;
  }
  .margin-top {
    margin-top: 150px;
    position: relative;
  }
</style>
