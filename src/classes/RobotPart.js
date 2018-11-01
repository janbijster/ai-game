// A RobotPart consists of a Brain (neural network), wired to sensors and
// actuators. Sensors and actuators are specified by name (e.g. sensor:
// "POSITION_X_NORMALIZED", actuator: "MOVE_X")

// Note that while the Brain in- and output are arrays, the in- and output of a RobotPart
// are objects: the input is (part of) the environment state object, with sensor-names as
// keys and readouts as values. The output is an object with the state of the actuators,
// with actuator-names as keys and values indicating things like voltages for the motors.

import Brain from './Brain.js'

export default class RobotPart {
  constructor (sensors, actuators) {
    this.sensors = sensors
    this.actuators = actuators
    this.brain = new Brain(sensors.length, actuators.length)

    this.state = {
      sensorsOn: false,
      brainOn: false
    }

    this.environmentState = {}
    this.brainInput = new Array(sensors.length).fill(0)
    this.brainOutput = new Array(actuators.length).fill(0)

    window.requestAnimationFrame(this.update.bind(this))
  }

  turnSensorsOn () {
    this.state.sensorsOn = true
  }
  turnSensorsOff () {
    this.state.sensorsOn = false
  }
  turnBrainOn () {
    this.state.brainOn = true
  }
  turnBrainOff () {
    this.state.brainOn = false
  }

  update (timestamp) {
    if (this.state.sensorsOn) {
      // look for my sensor readouts in the environmentState:
      this.brainInput = this.sensors.map(sensorName => this.environmentState[sensorName] || 0)
    }
    if (this.state.brainOn) {
      // let the brain evaluate the model:
      this.brain.setInput(this.brainInput)
    }
  }

  setEnvironmentState (environmentState) {
    this.environmentState = environmentState
  }

  getActuatorState () {
    if (!this.state.brainOn) {
      this.brainOutput = new Array(this.actuators.length).fill(0)
    } else {
      this.brainOutput = this.brain.getOutput()
    }
    let actuatorState = {}
    this.actuators.forEach((actuatorName, index) => {
      actuatorState[actuatorName] = this.brainOutput[index]
    })
    return actuatorState
  }

  getState () {
    return {
      robotPartState: this.state,
      modelState: this.brain.getModelState()
    }
  }

  addSample (input, output) {
    this.brain.addSample(input, output)
  }

  setSamples (newSamples) {
    this.brain.setSamples(newSamples)
  }

  train (maximumNumberOfSamples, maximumTime = Infinity, stopIfNotImproving = false) {
    this.brain.train(maximumNumberOfSamples, maximumTime, stopIfNotImproving)
  }
}
