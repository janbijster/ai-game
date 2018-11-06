<template>
  <div>
    <div class="subtitle color-accent">Collect samples</div>
    <div id="samples">

      <div class="left-part">
        <template v-if="samplesRed.length < neededNumSamples">
          <SampleVisualization
            :sample="currentSampleRed"
            :agent="redAgent"
            :colorSet="colors.red">
          </SampleVisualization>
        </template>
      </div>

      <div class="right-part">
        <template v-if="samplesBlue.length < neededNumSamples">
          <SampleVisualization
            :sample="currentSampleBlue"
            :agent="blueAgent"
            :colorSet="colors.blue">
          </SampleVisualization>
        </template>
      </div>

    </div>
    <div id="info">

      <div class="left-part font-sm">
        <template v-if="samplesRed.length < neededNumSamples">
          <SampleAskUserInput
            :input-sample="currentSampleRed"
            :nav-keys="keys.red"
            @selected="outputSelectedRed">
          </SampleAskUserInput>
        </template>
        <template v-else>
          <div class="center-message">Done!</div>
        </template>
        <div class="sample-status color-accent font-sm">
          Samples collected: {{ samplesRed.length }}
        </div>
      </div>

      <div class="right-part font-sm">
        <template v-if="samplesBlue.length < neededNumSamples">
          <SampleAskUserInput
            :input-sample="currentSampleBlue"
            :nav-keys="keys.blue"
            @selected="outputSelectedBlue">
          </SampleAskUserInput>
        </template>
        <template v-else>
          <div class="center-message">Done!</div>
        </template>
        <div class="sample-status color-accent font-sm">
          Samples collected: {{ samplesBlue.length }}/{{ neededNumSamples }}
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import SampleVisualization from '@/components/SampleVisualization.vue'
import SampleAskUserInput from '@/components/SampleAskUserInput.vue'
import Globals from '@/classes/Globals.js'

export default {
  name: 'CreateAgentCollectSamples',
  props: {
    redAgent: Object,
    blueAgent: Object
  },
  data () {
    return {
      samplesRed: [],
      samplesBlue: [],
      currentSampleRed: null,
      currentSampleBlue: null
    }
  },
  mounted () {
    this.newSampleRed()
    this.newSampleBlue()
  },
  components: {
    SampleVisualization,
    SampleAskUserInput
  },
  methods: {
    newSampleRed () {
      this.currentSampleRed = this.randomSample()
    },
    newSampleBlue () {
      this.currentSampleBlue = this.randomSample()
    },
    randomSample () {
      // for now this is a really simple function, later move to own class.
      // to save a little memory, samples are 2d arrays:
      // sample[0] = input, sample[1] = output, sample[0][0] = input dim1, etc

      // we square the values so there are more samples close by, these are more important
      return [[
        this.randomDistribution(),
        this.randomDistribution()
      ]]
    },
    randomDistribution () {
      // random between -1 and 1, with more chance on values close to 0
      return Math.pow(Math.random() * 2 - 1, 3)
    },
    outputSelectedRed (output) {
      if (output !== null) {
        this.currentSampleRed[1] = output
        this.samplesRed.push(this.currentSampleRed)
      }
      this.newSampleRed()
    },
    outputSelectedBlue (output) {
      if (output !== null) {
        this.currentSampleBlue[1] = output
        this.samplesBlue.push(this.currentSampleBlue)
      }
      this.newSampleBlue()
    }
  },
  computed: {
    colors () {
      return Globals.colors
    },
    keys () {
      return Globals.keys
    },
    neededNumSamples () {
      return Globals.neededNumSamples
    }
  },
  watch: {
    samplesRed () {
      if (this.samplesRed.length >= this.neededNumSamples) {
        this.redAgent.samples = this.samplesRed
        this.$emit('red-agent-samples-collected', this.samplesRed)
      }
    },
    samplesBlue () {
      if (this.samplesBlue.length >= this.neededNumSamples) {
        this.blueAgent.samples = this.samplesBlue
        this.$emit('blue-agent-samples-collected', this.samplesBlue)
      }
    }
  }
}
</script>

<style>
#samples {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 100px;
}
#info {
  position: absolute;
  top: calc(100% - 50px);
  left: 0;
  right: 0;
}
.sample-status {
  margin-top: 20px;
}
</style>
