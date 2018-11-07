<template>
  <div id="box">
    <div>
      Select action for this situation:<br>
      <span class="color-red">Joystick = move</span><br>
      <span class="color-green">Enter = stand still</span><br>
      <span class="color-special">Back = skip sample</span>
    </div>
    <!-- image displaying the options -->
  </div>
</template>

<script>
import Sounds from '@/classes/Sounds.js'

export default {
  name: 'SampleAskUserInput',
  props: {
    inputSample: Array,
    navKeys: Object
  },
  mounted () {
    window.addEventListener('keydown', this.keyPress)
  },
  methods: {
    keyPress: function (event) {
      let output = null
      let skipped = false
      if ('leftUp' in this.navKeys && this.navKeys.leftUp === event.key) {
        output = [-1, 1]
      }
      if ('up' in this.navKeys && this.navKeys.up === event.key) {
        output = [0, 1]
      }
      if ('rightUp' in this.navKeys && this.navKeys.rightUp === event.key) {
        output = [1, 1]
      }
      if ('left' in this.navKeys && this.navKeys.left === event.key) {
        output = [-1, 0]
      }
      if ('right' in this.navKeys && this.navKeys.right === event.key) {
        output = [1, 0]
      }
      if ('leftDown' in this.navKeys && this.navKeys.leftDown === event.key) {
        output = [-1, -1]
      }
      if ('down' in this.navKeys && this.navKeys.down === event.key) {
        output = [0, -1]
      }
      if ('rightDown' in this.navKeys && this.navKeys.rightDown === event.key) {
        output = [1, -1]
      }
      if ('enter' in this.navKeys && this.navKeys.enter === event.key) {
        output = [0, 0]
        // cheat hack: output = input todo remove
        // todo more:
        // - timeout for each round
        // - map gamepad keys
        output = this.inputSample[0]
      }
      if ('back' in this.navKeys && this.navKeys.back === event.key) {
        skipped = true
      }
      if (output !== null || skipped) {
        Sounds.PlaySound('laser1')
        this.$emit('selected', output)
      }
    }
  }
}
</script>

<style scoped>

</style>
