<template>
  <div id="simulation">
    <div class="title color-yellow">Simulation {{ timer }}...</div>
    <div id="simulation-space">
      <SimulationSpace></SimulationSpace>
    </div>
    <div id="status">
      <div class="left-part">
        <div class="color-red align-left">
          Score: {{ score.red }} | Rounds: {{ rounds.red }}
        </div>
      </div>
      <div class="right-part">
        <div class="color-blue align-right">
          Targets hit: {{ score.blue }} | Rounds: {{ rounds.blue }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import SimulationSpace from '@/components/SimulationSpace.vue'
import Globals from '@/classes/Globals.js'
import Sounds from '@/classes/Sounds.js'

export default {
  name: 'Simulation',
  data () {
    return {
      timer: Globals.roundTime,
      timerIntervalId: null
    }
  },
  components: {
    SimulationSpace
  },
  mounted () {
    this.checkScores()
    if (this.$store.state.redAgents.length === 0) {
      console.log('game start, creating new agents...')
      this.$router.push({ name: 'createAgent' })
    }
    this.timerIntervalId = setInterval(this.slowUpdate, 1000)
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
    },
    rounds () {
      return this.$store.state.rounds
    }
  },
  methods: {
    slowUpdate () {
      this.timer -= 1
      if (this.timer < 0) {
        this.endRound()
      }
    },
    checkScores () {
      // check if round is won:
      if (
        this.$store.state.score.red >= Globals.roundWonScore ||
        this.$store.state.score.blue >= Globals.roundWonScore
      ) {
        this.endRound()
      }
    },
    endRound () {
      clearInterval(this.timerIntervalId)
      this.timer = Globals.roundTime
      console.log('round was won:', this.$store.state.score, this.$store.state.rounds)
      Sounds.PlaySound('coin2')
      // turn off simulation
      this.$store.commit('turnSimulationOff')
      // new round for the scores
      this.$store.commit('newRound')
      // check if the game is won:
      if (
        this.$store.state.rounds.red >= Globals.gameWonRounds ||
        this.$store.state.rounds.blue >= Globals.gameWonRounds
      ) {
        Sounds.PlaySound('coin2')
        this.$router.push({ name: 'gameOver' })
      } else {
        // not yet won, add a new agent in the game:
        console.log('game was not yet won:', this.$store.state.redAgents.length, this.$store.state.scoreHistory.length)
        if (this.$store.state.redAgents.length <= this.$store.state.scoreHistory.length) {
          this.$router.push({ name: 'createAgent' })
          Sounds.PlaySound('laser2')
        }
      }
    }
  },
  watch: {
    score () {
      this.checkScores()
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
