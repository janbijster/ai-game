// A Robot is collection of RobotParts with information.

// For construction pass an array of parts: objects with sensors and actuator arrays
// e.g.:
//
// parts = [
//   {
//     sensors: [
//       'POSITION_X_NORMALIZED',
//       'POSITION_Y_NORMALIZED'
//     ],
//     actuators: [
//       'MOVE_ARM_Z'
//     ]
//   }
// ]

import RobotPart from './RobotPart.js'

export default class Robot {
  constructor (parts, callback) {
    this.id = this.uuidv4()
    this.constructorCallback = callback
    this.numberOfParts = parts.length
    this.partsConstructed = 0
    this.parts = parts.map(part => new RobotPart(part.sensors, part.actuators, this.id, this.partDone.bind(this)))
  }

  partDone () {
    this.partsConstructed += 1
    if (this.partsConstructed === this.numberOfParts) {
      if (this.constructorCallback != null) {
        this.constructorCallback()
      }
    }
  }

  setEnvironmentState (environmentState) {
    // environmentState holds information about the environment:
    // an array of robots and resources, objects containing x and y position (in the range 0-1).
    // agents also contain an id.
    this.parts.forEach((robotPart) => {
      robotPart.setEnvironmentState(environmentState)
    })
  }

  getActuatorState () {
    let actuatorState = {}
    this.parts.forEach((robotPart) => {
      Object.entries(robotPart.getActuatorState()).forEach(([key, value]) => {
        if (key in actuatorState) {
          // combine using the absolute max
          if (Math.abs(value) > Math.abs(actuatorState[key])) {
            actuatorState[key] = value
          }
        } else {
          actuatorState[key] = value
        }
      })
      // if there are no overlapping actuators, this would do:
      // Object.assign(actuatorState, robotPart.getActuatorState());
    })

    return actuatorState
  }

  getState () {
    return {
      parts: this.parts.map(robotPart => robotPart.getState())
    }
  }

  turnSensorsOn () {
    this.parts.forEach((robotPart) => {
      robotPart.turnSensorsOn()
    })
  }
  turnSensorsOff () {
    this.parts.forEach((robotPart) => {
      robotPart.turnSensorsOff()
    })
  }

  turnBrainOn () {
    this.parts.forEach((robotPart) => {
      robotPart.turnBrainOn()
    })
  }
  turnBrainOff () {
    this.parts.forEach((robotPart) => {
      robotPart.turnBrainOff()
    })
  }

  addSample (partIndex, input, output) {
    this.parts[partIndex].addSample(input, output)
  }

  setSamples (partIndex, newSamples) {
    this.parts[partIndex].setSamples(newSamples)
  }

  train (partIndex, maximumNumberOfSamples, maximumTime = Infinity, stopIfNotImproving = false) {
    this.parts[partIndex].train(maximumNumberOfSamples, maximumTime, stopIfNotImproving)
  }

  uuidv4 () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0
      let v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}
