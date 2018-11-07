export default class Gamepad {
  constructor () {
    this.listening = false
    this.callbacks = {}
    this.pressed = {}
  }

  start () {
    this.listening = true
    requestAnimationFrame(this.update.bind(this))
  }

  addCallback (gamepadIndex, buttonIndex, callback) {
    if (this.callbacks[gamepadIndex] == null) {
      this.callbacks[gamepadIndex] = {}
    }
    if (this.callbacks[gamepadIndex][buttonIndex] == null) {
      this.callbacks[gamepadIndex][buttonIndex] = []
    }
    this.callbacks[gamepadIndex][buttonIndex].push(callback)
  }

  update () {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [])
    if (gamepads.length === 0) { return }

    Object.keys(gamepads).forEach(gamepadIndex => {
      let gamepad = gamepads[gamepadIndex]
      if (gamepad) {
        gamepad.buttons.forEach((button, buttonIndex) => {
          if (button.pressed) {
            // check for fresh press
            if (this.pressed[gamepadIndex] == null || this.pressed[gamepadIndex][buttonIndex] == null || !this.pressed[gamepadIndex][buttonIndex]) {
              console.log(`Button ${buttonIndex} of gamepad ${gamepadIndex} pressed!`)
              if (this.pressed[gamepadIndex] == null) {
                this.pressed[gamepadIndex] = {}
              }
              this.pressed[gamepadIndex][buttonIndex] = true
              if (this.callbacks[gamepadIndex] != null && this.callbacks[gamepadIndex][buttonIndex] != null && this.callbacks[gamepadIndex][buttonIndex].length > 0) {
                this.callbacks[gamepadIndex][buttonIndex].forEach(callback => { callback() })
              }
            }
          } else {
            if (this.pressed[gamepadIndex] == null) {
              this.pressed[gamepadIndex] = {}
            }
            this.pressed[gamepadIndex][buttonIndex] = false
          }
        })
      }
    })
    requestAnimationFrame(this.update.bind(this))
  }
}
