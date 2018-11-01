<template>
  <SimulationSpace param="test param"></SimulationSpace>
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
    if (this.$store.state.agents.length < Globals.requiredRobots) {
      this.$router.push({ name: 'createAgent' })
    }
  }
}
</script>
