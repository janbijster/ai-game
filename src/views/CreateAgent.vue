<template>
  <div id="create-agent">
    <div class="title">Create new agent</div>
    <div id="create-agent-box">
      <router-view
        :red-agent="redAgent" :blue-agent="blueAgent"
        @red-agent-input-selected="redAgentInputSelected"
        @blue-agent-input-selected="blueAgentInputSelected"
        @red-agent-samples-collected="redAgentSamplesCollected"
        @blue-agent-samples-collected="blueAgentSamplesCollected"
      ></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateAgent',
  data () {
    return {
      redAgent: {},
      blueAgent: {},
      redAgentState: 0,
      blueAgentState: 0
    }
  },
  components: {
  },
  mounted () {
    this.goToScreen(0)
  },
  methods: {
    redAgentInputSelected () {
      this.redAgentState = 1
      if (this.blueAgentState === 1) {
        this.goToScreen(1)
      }
    },
    blueAgentInputSelected () {
      this.blueAgentState = 1
      if (this.redAgentState === 1) {
        this.goToScreen(1)
      }
    },
    redAgentSamplesCollected () {
      this.redAgentState = 2
      if (this.blueAgentState === 2) {
        this.goToScreen(2)
      }
    },
    blueAgentSamplesCollected () {
      this.blueAgentState = 2
      if (this.redAgentState === 2) {
        this.goToScreen(2)
      }
    },
    goToScreen (screenIndex) {
      if (screenIndex === 0) {
        this.$router.push({ name: 'createAgent' })
      } else if (screenIndex === 1) {
        this.$router.push({ name: 'createAgentCollectSamples' })
      } else if (screenIndex === 2) {
        this.$router.push({ name: 'createAgentTrain' })
      }
    }
  }
}
</script>

<style scoped>
#create-agent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.title {
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  text-align: center;
}
#create-agent-box {
  position: absolute;
  top: 100px;
  left: 0px;
  right: 0px;
  bottom: 100px;
}
</style>
