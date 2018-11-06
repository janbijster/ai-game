/* eslint-disable no-unused-vars */
require('howler')

export default class Sounds {
  static get Sounds () {
    return {
      bleep1: { volume: 0.1, path: require('../assets/sounds/bleep1.wav') },
      bleep2: { volume: 0.1, path: require('../assets/sounds/bleep2.wav') },
      bleep3: { volume: 0.1, path: require('../assets/sounds/bleep3.wav') },
      bleep4: { volume: 0.1, path: require('../assets/sounds/bleep4.wav') },
      bleep5: { volume: 0.2, path: require('../assets/sounds/bleep5.wav') },
      bleep6: { volume: 0.3, path: require('../assets/sounds/bleep6.wav') },
      coin1: { volume: 0.1, path: require('../assets/sounds/coin1.wav') },
      coin2: { volume: 0.1, path: require('../assets/sounds/coin2.wav') },
      explosion: { volume: 0.1, path: require('../assets/sounds/explosion.wav') },
      training: { volume: 0.2, path: require('../assets/sounds/training.wav') },
      laser1: { volume: 0.1, path: require('../assets/sounds/laser1.wav') },
      laser2: { volume: 0.2, path: require('../assets/sounds/laser2.wav') },
      click: { volume: 0.1, path: require('../assets/sounds/click.wav') },
      jump: { volume: 0.2, path: require('../assets/sounds/jump.wav') }
    }
  }

  static PlaySound (soundName) {
    let sound = new Howl({
      src: Sounds.Sounds[soundName].path,
      volume: Sounds.Sounds[soundName].volume
    })
    sound.play()
  }
}
