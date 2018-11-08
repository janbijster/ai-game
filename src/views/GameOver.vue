<template>
  <div id="gameover">
    <div :class="`title color-${colorWon}`">Game won by {{ colorWon }}</div>
    <div id="history">
      <div class="subtitle color-yellow">Rounds</div>
      <div>Press Enter for new game</div>
      <div class="left-part color-red">
        <div v-for="(score, index) in scoreHistory" :key="index" :ref="`score-red-${index}`">
          Round {{ index + 1 }}: {{ score.red }}
        </div>
      </div>
      <div class="right-part color-blue">
        <div v-for="(score, index) in scoreHistory" :key="index" :ref="`score-blue-${index}`">
          Round {{ index + 1 }}: {{ score.blue }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Globals from '@/classes/Globals.js'

export default {
  name: 'GameOver',
  components: {
  },
  mounted () {
    // for keys:
    window.addEventListener('keydown', this.keyPress)
    // for gamepad:
    this.$store.commit('setGamepadCallback', {
      gamepadIndex: 0,
      buttonIndex: 0,
      callback: this.newGame
    })
    this.$store.commit('setGamepadCallback', {
      gamepadIndex: 1,
      buttonIndex: 0,
      callback: this.newGame
    })
  },
  methods: {
    newGame () {
      this.$router.push({ name: 'simulation' })
      window.location = window.location.href.substr(0, window.location.href.indexOf('#'))
      // location.reload()
    },
    keyPress: function (event) {
      let redKeys = Globals.keys.red
      let blueKeys = Globals.keys.blue
      if (
        ('enter' in redKeys && redKeys.enter === event.key) ||
        ('enter' in blueKeys && blueKeys.enter === event.key)
      ) {
        this.newGame()
      }
    }
  },
  computed: {
    scoreHistory () {
      return this.$store.state.scoreHistory
    },
    colorWon () {
      return this.$store.state.rounds.red > this.$store.state.rounds.blue ? 'red' : 'blue'
    }
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
  #history {
    position: absolute;
    top: 400px;
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
