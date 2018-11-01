<template>
  <div class="simulation-space">
    <p>Simulation space</p>
    <p>{{ param }}</p>
  </div>
</template>

<script>
export default {
  name: 'SimulationSpace',
  props: {
    param: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.simulation-space {
  width: 200px;
  height: 200px;
  background-color: #999;
}
</style>
