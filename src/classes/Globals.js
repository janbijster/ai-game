export default class Globals {
  static get inputOptions () {
    return [
      { name: 'Field Position', value: 'FIELD_POSITION', sensors: ['FIELD_POSITION_X', 'FIELD_POSITION_Y'] },
      { name: 'Closest Resource Position', value: 'CLOSEST_RESOURCE_POSITION', sensors: ['CLOSEST_RESOURCE_POSITION_X', 'CLOSEST_RESOURCE_POSITION_Y'] },
      { name: 'Closest Blue Agent position', value: 'CLOSEST_BLUE_AGENT_POSITION', sensors: ['CLOSEST_BLUE_AGENT_POSITION_X', 'CLOSEST_BLUE_AGENT_POSITION_Y'] },
      { name: 'Closest Red Agent position', value: 'CLOSEST_RED_AGENT_POSITION', sensors: ['CLOSEST_RED_AGENT_POSITION_X', 'CLOSEST_RED_AGENT_POSITION_Y'] }
    ]
  }

  static get standardActuators () {
    return ['MOVE_X', 'MOVE_Y']
  }

  static get requiredRobots () {
    return 1
  }

  static get keys () {
    return {
      red: {
        leftUp: 'q', up: 'w', rightUp: 'e', left: 'a', right: 'd', leftDown: 'z', down: 'x', rightDown: 'c', enter: 'f', back: 'v'
      },
      blue: {
        leftUp: '7', up: '8', rightUp: '9', left: '4', right: '6', leftDown: '1', down: '2', rightDown: '3', enter: 'Enter', back: 'Backspace'
      }
    }
  }

  static get colors () {
    return {
      red: {
        main: '#E06C75',
        light: '#BE5046'
      },
      blue: {
        main: '#61AFEF',
        light: '#528BFF'
      },
      green: {
        main: '#98C379',
        light: '#56B6C2'
      },
      yellow: {
        main: '#E5C07B',
        light: '#D19A66'
      },
      grey: {
        main: '#282C34',
        dark: '#21252B',
        light: '#ABB2BF'
      }
    }
  }

  static get neededNumSamples () {
    return 30
  }

  static get trainingTime () {
    return 15
  }

  static get agentSpeed () {
    return 0.1
  }

  static forceArrayChangeDetection (arr) {
    // this is sometimes needed to make Vue detect changes in arrays.
    // by replacing the array with a shallow copy of itself the change should get detected:
    arr = arr.slice()
  }
}
