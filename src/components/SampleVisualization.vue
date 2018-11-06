<template>
  <div class="sample-box" ref="box">
    <div id="viewport" :style="viewportStyle">
      <div class="object" :style="objectStyle"></div>
      <div class="agent" :style="agentStyle"></div>
    </div>
  </div>
</template>

<script>
import Globals from '@/classes/Globals.js'

export default {
  name: 'SampleVisualization',
  props: {
    sample: Array,
    agent: Object,
    colorSet: Object
  },
  mounted () {
    if (this.$refs['box'] != null) {
      this.bounds = this.$refs['box'].getBoundingClientRect()
      this.minimumDimension = Math.min(this.bounds.width, this.bounds.height)
      this.smallObjectSize = 0.03 * this.minimumDimension
      this.mediumObjectSize = 0.04 * this.minimumDimension
      this.bigObjectSize = 0.05 * this.minimumDimension
    }

    if (this.agent != null) {
      if (this.agent.sensorChoice === 'FIELD_POSITION') {
        this.objectSize = this.minimumDimension
      } else if (this.agent.sensorChoice === 'CLOSEST_RESOURCE_POSITION') {
        this.objectSize = this.smallObjectSize
      } else if (this.agent.sensorChoice === 'CLOSEST_BLUE_AGENT_POSITION') {
        this.objectSize = this.mediumObjectSize
      } else if (this.agent.sensorChoice === 'CLOSEST_RED_AGENT_POSITION') {
        this.objectSize = this.mediumObjectSize
      }
      this.updateViewportStyle()
    }

    if (this.sample != null) {
      this.updateObjectStyle()
    }
  },
  data () {
    return {
      bounds: {},
      minimumDimension: 0,
      smallObjectSize: 0,
      mediumObjectSize: 0,
      bigObjectSize: 0,
      objectSize: 0,
      viewportStyle: {},
      objectStyle: {}
    }
  },
  computed: {
    agentStyle () {
      return {
        backgroundColor: this.colorSet.main,
        width: this.bigObjectSize + 'px',
        height: this.bigObjectSize + 'px',
        borderRadius: this.bigObjectSize + 'px',
        left: 0.5 * this.minimumDimension - 0.5 * this.bigObjectSize + 'px',
        top: 0.5 * this.minimumDimension - 0.5 * this.bigObjectSize + 'px'
      }
    }
  },
  methods: {
    updateViewportStyle () {
      if (this.bounds.width > this.bounds.height) {
        this.viewportStyle = {
          left: 0.5 * (this.bounds.width - this.minimumDimension) + 'px',
          top: 0,
          width: this.minimumDimension + 'px',
          height: this.minimumDimension + 'px'
        }
      } else {
        this.viewportStyle = {
          left: 0,
          top: 0,
          width: this.minimumDimension + 'px',
          height: this.minimumDimension + 'px'
        }
      }
    },
    updateObjectStyle () {
      let style = {
        width: this.objectSize + 'px',
        height: this.objectSize + 'px'
      }
      if (this.agent.sensorChoice === 'FIELD_POSITION') {
        style.backgroundColor = Globals.colors.grey.main
        style.border = '2px solid #ABB2BF'
      } else if (this.agent.sensorChoice === 'CLOSEST_RESOURCE_POSITION') {
        style.backgroundColor = Globals.colors.green.main
        style.borderRadius = '100%'
      } else if (this.agent.sensorChoice === 'CLOSEST_BLUE_AGENT_POSITION') {
        style.backgroundColor = Globals.colors.blue.main
        style.borderRadius = '100%'
      } else if (this.agent.sensorChoice === 'CLOSEST_RED_AGENT_POSITION') {
        style.backgroundColor = Globals.colors.red.main
        style.borderRadius = '100%'
      }

      // position:
      let objectPosition = {
        x: 0,
        y: 0
      }
      if (this.sample !== null) {
        objectPosition.x = this.sample[0][0]
        objectPosition.y = this.sample[0][1]
      }
      style.left = 0.5 * (objectPosition.x + 1) * this.minimumDimension - 0.5 * this.objectSize + 'px'
      style.top = 0.5 * (-objectPosition.y + 1) * this.minimumDimension - 0.5 * this.objectSize + 'px'

      this.objectStyle = style
    }
  },
  watch: {
    sample () {
      this.updateObjectStyle()
    }
  }
}
</script>

<style scoped>
  .sample-box {
    width: 100%;
    height: 100%
  }
  .agent {
    position: absolute;
  }
  .object {
    position: absolute;
    border-radius: 0 !important;

  }
  #viewport {
    position: absolute;
    overflow: hidden;
    border: 2px solid #ABB2BF;
    background-color: #21252B;
  }
</style>
