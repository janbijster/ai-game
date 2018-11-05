<template>
  <div id="simulation">
    <div class="title color-yellow">Simulation</div>
    <div id="simulation-space">
      <SimulationSpace></SimulationSpace>
    </div>
    <div id="status">
      <div class="left-part">
        <div class="color-red align-left">
          Resources gathered: {{ score.red }}
        </div>
      </div>
      <div class="right-part">
        <div class="color-blue align-right">
          Resources gathered: {{ score.blue }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import SimulationSpace from '@/components/SimulationSpace.vue'
import Globals from '@/classes/Globals'

export default {
  name: 'Simulation',
  components: {
    SimulationSpace
  },
  mounted () {
    if (this.$store.state.redAgents.length < Globals.requiredRobots) {
      this.$store.commit('turnSimulationOff')
      this.$router.push({ name: 'createAgent' })
    } else {
      this.$store.commit('turnSimulationOn')
    }
  },
  computed: {
    redAgents () {
      return this.$store.state.redAgents
    },
    blueAgents () {
      return this.$store.state.blueAgents
    },
    score () {
      return this.$store.state.score
    }
  }
}
</script>

<style scoped>
  #simulation {
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
  #simulation-space {
    position: absolute;
    top: 100px;
    left: 0px;
    right: 0px;
    bottom: 150px;
  }
  #status {
    position: absolute;
    bottom: 60px;
    width: 100%;
  }
</style>
