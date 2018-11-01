<template>
  <div>
    <div class="subtitle">Training</div>
    <div class="training-visualization">
      <div class="left-part"></div>
      <div class="right-part"></div><!-- hereiam: show current loss -->
    </div>
  </div>
</template>

<script>
import Robot from '@/classes/Robot.js'

export default {
  name: 'CreateAgentTrain',
  props: {
    redAgent: Object,
    blueAgent: Object
  },
  data () {
    return {
      redRobot: null,
      blueRobot: null,
      intervalId: null
    }
  },
  mounted () {
    this.redAgent.robot = new Robot([this.redAgent.part])
    this.blueAgent.robot = new Robot([this.blueAgent.part])
    console.log('just created the robots, states: ', this.redAgent.robot.getState(), this.blueAgent.robot.getState())
    console.log('now let\'s train...')
    this.redAgent.robot.setSamples(0, this.redAgent.samples)
    // train part 0 of the red robot for 10 seconds:
    this.redAgent.robot.train(0, Infinity, 10)

    this.blueAgent.robot.setSamples(0, this.blueAgent.samples)
    // train part 0 of the blue robot for 10 seconds:
    this.blueAgent.robot.train(0, Infinity, 30)

    this.intervalId = setInterval(this.showProgress, 500)
    setTimeout(this.stopTraining, 31000)
  },
  methods: {
    showProgress () {
      console.log('red: ', this.redAgent.robot.getState().parts[0].modelState.currentLoss)
      console.log('blue: ', this.blueAgent.robot.getState().parts[0].modelState.currentLoss)
    },
    stopTraining () {
      console.log('stop.')
      clearInterval(this.intervalId)
    }
  }
}
</script>
