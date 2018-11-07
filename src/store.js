import Vue from 'vue'
import Vuex from 'vuex'
import Gamepad from '@/classes/Gamepad.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    redAgents: [],
    blueAgents: [],
    score: {
      red: 0,
      blue: 0
    },
    rounds: {
      red: 0,
      blue: 0
    },
    scoreHistory: [],
    simulationOn: false,
    gamepad: new Gamepad()
  },
  mutations: {
    startGamepad (state) {
      state.gamepad.start()
    },
    addGamepadCallback (state, payload) {
      state.gamepad.addCallback(payload.gamepadIndex, payload.buttonIndex, payload.callback)
    },
    addGamepadAxesCallback (state, payload) {
      state.gamepad.addAxesCallback(payload.gamepadIndex, payload.callback)
    },
    addRedAgent (state, agent) {
      state.redAgents.push(agent)
    },
    addBlueAgent (state, agent) {
      state.blueAgents.push(agent)
    },
    incrementScoreRed (state) {
      let newScore = {
        red: state.score.red + 1,
        blue: state.score.blue
      }
      state.score = newScore
    },
    incrementScoreBlue (state) {
      let newScore = {
        red: state.score.red,
        blue: state.score.blue + 1
      }
      state.score = newScore
    },
    newRound (state) {
      let newRounds = state.rounds
      if (state.score.red > state.score.blue) {
        newRounds.red += 1
      } else {
        newRounds.blue += 1
      }
      state.rounds = newRounds

      state.scoreHistory.push(state.score)
      state.score = {
        red: 0,
        blue: 0
      }
    },
    resetScore (state) {
      state.score = {
        red: 0,
        blue: 0
      }
    },
    turnSimulationOn (state) {
      state.simulationOn = true
    },
    turnSimulationOff (state) {
      state.simulationOn = false
    }
  },
  actions: {

  }
})
