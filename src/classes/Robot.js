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
  constructor (parts) {
    this.parts = parts.map(part => new RobotPart(part.sensors, part.actuators))
  }

  setEnvironmentState (environmentState) {
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
}
