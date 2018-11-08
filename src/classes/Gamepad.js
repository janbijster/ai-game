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

  setAxesCallback (gamepadIndex, callback) {
    this.axesCallbacks[gamepadIndex] = callback
  }

  setCallback (gamepadIndex, buttonIndex, callback) {
    if (this.callbacks[gamepadIndex] == null) {
      this.callbacks[gamepadIndex] = {}
    }
    this.callbacks[gamepadIndex][buttonIndex] = callback
  }

  undefindedOrFalse (obj, key1, key2) {
    if (key2 == null) {
      return (obj[key1] == null || !obj[key1])
    } else {
      return (obj[key1] == null || obj[key1][key2] == null || !obj[key1][key2])
    }
  }

  defined (obj, key1, key2) {
    return (obj[key1] != null && obj[key1][key2] != null)
  }

  setNestedValue (obj, key1, key2, val) {
    if (obj[key1] == null) {
      obj[key1] = {}
    }
    obj[key1][key2] = val
  }

  triggerButtonCallback (key1, key2) {
    if (this.callbacks[key1] != null && this.callbacks[key1][key2] != null) {
      this.callbacks[key1][key2]()
    }
  }

  triggerAxesCallback (key, param) {
    if (this.axesCallbacks[key] != null) {
      this.axesCallbacks[key](param)
    }
  }

  deferredAxesTrigger (previousInput, gamepad, gamepadIndex) {
    // if the user pushes the joystick diagonal, the trigger may go off to soon, when only one of the axes is active.
    // so we query the input again after a small delay and take the abs max value for the inputs
    let input = [ Math.round(-gamepad.axes[0]), Math.round(gamepad.axes[1]) ]
    if (Math.abs(previousInput[0]) > Math.abs(input[0])) {
      input[0] = previousInput[0]
    }
    if (Math.abs(previousInput[1]) > Math.abs(input[1])) {
      input[1] = previousInput[1]
    }
    // console.log(`Axes of gamepad ${gamepadIndex} pressed: `, input)
    this.triggerAxesCallback(gamepadIndex, input)
  }

  update () {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [])
    if (gamepads.length === 0) { return }

    Object.keys(gamepads).forEach(gamepadIndex => {
      let gamepad = gamepads[gamepadIndex]
      if (gamepad) {
        if ((Math.abs(gamepad.axes[0]) > 0.5) || (Math.abs(gamepad.axes[1]) > 0.5)) {
          // check for fresh press
          if (this.undefindedOrFalse(this.axesPressed, gamepadIndex)) {
            this.axesPressed[gamepadIndex] = true
            let input = [ Math.round(-gamepad.axes[0]), Math.round(gamepad.axes[1]) ]
            setTimeout(() => {
              this.deferredAxesTrigger(input, gamepad, gamepadIndex)
            }, 100) // a little later so the user can trigger other axes also if it moves diagonal
          }
        } else {
          this.axesPressed[gamepadIndex] = false
        }
        gamepad.buttons.forEach((button, buttonIndex) => {
          if (button.pressed) {
            // check for fresh press
            if (this.undefindedOrFalse(this.pressed, gamepadIndex, buttonIndex)) {
              // console.log(`Button ${buttonIndex} of gamepad ${gamepadIndex} pressed!`)
              this.setNestedValue(this.pressed, gamepadIndex, buttonIndex, true)
              this.triggerButtonCallback(gamepadIndex, buttonIndex)
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
