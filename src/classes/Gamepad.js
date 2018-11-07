export default class Gamepad {
  constructor () {
    this.listening = false
    this.callbacks = {}
    this.pressed = {}
    this.axesCallbacks = {}
    this.axesPressed = {}
  }

  start () {
    this.listening = true
    requestAnimationFrame(this.update.bind(this))
  }

  addAxesCallback (gamepadIndex, callback) {
    if (this.axesCallbacks[gamepadIndex] == null) {
      this.axesCallbacks[gamepadIndex] = {}
    }
    if (this.axesCallbacks[gamepadIndex][0] == null) {
      this.axesCallbacks[gamepadIndex][0] = []
    }
    this.axesCallbacks[gamepadIndex][0].push(callback)
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

  undefindedOrFalse (obj, key1, key2) {
    return (obj[key1] == null || obj[key1][key2] == null || !obj[key1][key2])
  }

  setNestedValue (obj, key1, key2, val) {
    if (obj[key1] == null) {
      obj[key1] = {}
    }
    obj[key1][key2] = val
  }

  triggerNestedCallbacks (callbacks, key1, key2, param) {
    if (callbacks[key1] != null && callbacks[key1][key2] != null && callbacks[key1][key2].length > 0) {
      callbacks[key1][key2].forEach(callback => {
        if (param == null) {
          callback()
        } else {
          callback(param)
        }
      })
    }
  }

  deferredAxesTrigger (previousInput, gamepad, gamepadIndex) {
    let input = [ Math.round(-gamepad.axes[0]), Math.round(-gamepad.axes[1]) ]
    if (Math.abs(previousInput[0]) > Math.abs(input[0])) {
      input[0] = previousInput[0]
    }
    if (Math.abs(previousInput[1]) > Math.abs(input[1])) {
      input[1] = previousInput[1]
    }
    // console.log(`Axes of gamepad ${gamepadIndex} pressed: `, input)
    this.triggerNestedCallbacks(this.axesCallbacks, gamepadIndex, 0, input)
  }

  update () {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [])
    if (gamepads.length === 0) { return }

    Object.keys(gamepads).forEach(gamepadIndex => {
      let gamepad = gamepads[gamepadIndex]
      if (gamepad) {
        if ((Math.abs(gamepad.axes[0]) > 0.5) || (Math.abs(gamepad.axes[1]) > 0.5)) {
          // check for fresh press
          if (this.undefindedOrFalse(this.axesPressed, gamepadIndex, 0)) {
            this.setNestedValue(this.axesPressed, gamepadIndex, 0, true)
            let input = [ Math.round(-gamepad.axes[0]), Math.round(gamepad.axes[1]) ]
            setTimeout(() => {
              this.deferredAxesTrigger(input, gamepad, gamepadIndex)
            }, 100) // a little later so the user can trigger other axes also if it moves diagonal
          }
        } else {
          this.setNestedValue(this.axesPressed, gamepadIndex, 0, false)
        }
        gamepad.buttons.forEach((button, buttonIndex) => {
          if (button.pressed) {
            // check for fresh press
            if (this.undefindedOrFalse(this.pressed, gamepadIndex, buttonIndex)) {
              // console.log(`Button ${buttonIndex} of gamepad ${gamepadIndex} pressed!`)
              this.setNestedValue(this.pressed, gamepadIndex, buttonIndex, true)
              this.triggerNestedCallbacks(this.callbacks, gamepadIndex, buttonIndex)
            }
          } else {
            this.setNestedValue(this.pressed, gamepadIndex, buttonIndex, false)
          }
        })
      }
    })
    requestAnimationFrame(this.update.bind(this))
  }
}
