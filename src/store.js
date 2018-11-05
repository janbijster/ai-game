import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    redAgents: [],
    blueAgents: [],
    score: {
      red: 0,
      blue: 0
    },
    simulationOn: false
  },
  mutations: {
    addRedAgent (state, agent) {
      state.redAgents.push(agent)
    },
    addBlueAgent (state, agent) {
      state.blueAgents.push(agent)
    },
    incrementScoreRed (state) {
      state.score.red += 1
    },
    incrementScoreBlue (state) {
      state.score.blue += 1
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
