<template>
  <div id="gameover">
    <div class="title color-yellow">Game over</div>

  </div>
</template>

<script>
export default {
  name: 'GameOver',
  components: {
  },
  mounted () {
  },
  computed: {
  }
}
</script>

<style scoped>
  #gameover {
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
</style>
