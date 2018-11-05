import Vue from 'vue'
import Router from 'vue-router'
import Simulation from './views/Simulation.vue'
import CreateAgent from './views/CreateAgent.vue'
import CreateAgentStart from './views/CreateAgentStart.vue'
import CreateAgentSelectInput from './views/CreateAgentSelectInput.vue'
import CreateAgentCollectSamples from './views/CreateAgentCollectSamples.vue'
import CreateAgentTrain from './views/CreateAgentTrain.vue'
import GameOver from './views/GameOver.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'simulation',
      component: Simulation
    },
    {
      path: '/create',
      component: CreateAgent,
      children: [
        {
          path: '',
          name: 'createAgent',
          component: CreateAgentStart
        },
        {
          path: 'input',
          name: 'createAgentSelectInput',
          component: CreateAgentSelectInput
        },
        {
          path: 'collect',
          name: 'createAgentCollectSamples',
          component: CreateAgentCollectSamples
        },
        {
          path: 'train',
          name: 'createAgentTrain',
          component: CreateAgentTrain
        }
      ]
    },
    {
      path: '/gameover',
      name: 'gameOver',
      component: GameOver
    }
  ]
})
