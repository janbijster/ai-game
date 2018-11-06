<template>
  <div id="simulation">
    <div class="title color-yellow">Simulation</div>
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
          Resources gathered: {{ score.blue }} | Rounds: {{ rounds.blue }}
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
    this.checkScores()
    if (this.$store.state.redAgents.length === 0) {
      console.log('game start, creating new agents...')
      this.$router.push({ name: 'createAgent' })
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
    },
    rounds () {
      return this.$store.state.rounds
    }
  },
  methods: {
    checkScores () {
      // check if round is won:
      if (
        this.$store.state.score.red >= Globals.roundWonScore ||
        this.$store.state.score.blue >= Globals.roundWonScore
      ) {
        console.log('round was won:', this.$store.state.score, this.$store.state.rounds)
        // turn off simulation
        this.$store.commit('turnSimulationOff')
        // new round for the scores
        this.$store.commit('newRound')
        // check if the game is won:
        if (
          this.$store.state.rounds.red >= Globals.gameWonRounds ||
          this.$store.state.rounds.blue >= Globals.gameWonRounds
        ) {
          this.$router.push({ name: 'gameOver' })
        } else {
          // not yet won, add a new agent in the game:
          console.log('game was not yet won:', this.$store.state.redAgents.length, this.$store.state.scoreHistory.length)
          if (this.$store.state.redAgents.length <= this.$store.state.scoreHistory.length) {
            this.$router.push({ name: 'createAgent' })
          }
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
