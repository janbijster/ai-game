/* eslint-disable padded-blocks */
// A RobotPart consists of a Brain (neural network), wired to sensors and
// actuators. Sensors and actuators are specified by name (e.g. sensor:
// "POSITION_X_NORMALIZED", actuator: "MOVE_X")

// Note that while the Brain in- and output are arrays, the in- and output of a RobotPart
// are objects: the input is (part of) the environment state object, with sensor-names as
// keys and readouts as values. The output is an object with the state of the actuators,
// with actuator-names as keys and values indicating things like voltages for the motors.

import Brain from './Brain.js'

export default class RobotPart {
  constructor (sensors, actuators, id, callback) {
    this.robotId = id
    this.sensors = sensors
    this.actuators = actuators
    this.brain = new Brain(sensors.length, actuators.length, null, callback)

    this.state = {
      sensorsOn: false,
      brainOn: false
    }
    this.sensorReadoutState = {}

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
      // look for my sensor readouts in the sensorReadoutState:
      this.brainInput = this.sensors.map(sensorName => this.sensorReadoutState[sensorName] || 0)
    }
    if (this.state.brainOn) {
      // let the brain evaluate the model:
      this.brain.setInput(this.brainInput)
    }
    window.requestAnimationFrame(this.update.bind(this))
  }

  setEnvironmentState (environmentState) {
    // environmentState holds information about the environment:
    // redRobots, blueRobots and resources arrays, objects containing x and y position (in the range -0.5 to 0.5).
    // agents also contain an id.
    let sensorReadoutState = {}

    // find the robot itself by id
    let myRobotState = environmentState.redRobots.find(robot => robot.id === this.robotId)
    if (myRobotState == null) {
      myRobotState = environmentState.blueRobots.find(robot => robot.id === this.robotId)
    }
    // todo optimize this
    let closestResource = this.findClosestObject(myRobotState, environmentState.resources)
    let closestBlueRobot = this.findClosestObject(myRobotState, environmentState.blueRobots)
    let closestRedRobot = this.findClosestObject(myRobotState, environmentState.redRobots)

    // calculate the sensor readouts:
    // todo later: replace the sensor names by actual sensor classes, that perform this action themselves
    this.sensors.forEach(sensorName => {
      if (sensorName === 'FIELD_POSITION_X') {
        sensorReadoutState['FIELD_POSITION_X'] = 2 * -myRobotState.x

      } else if (sensorName === 'FIELD_POSITION_Y') {
        sensorReadoutState['FIELD_POSITION_Y'] = 2 * -myRobotState.y

      } else if (sensorName === 'CLOSEST_RESOURCE_POSITION_X') {
        if (closestResource != null) {
          sensorReadoutState['CLOSEST_RESOURCE_POSITION_X'] = closestResource.x - myRobotState.x
        }

      } else if (sensorName === 'CLOSEST_RESOURCE_POSITION_Y') {
        if (closestResource != null) {
          sensorReadoutState['CLOSEST_RESOURCE_POSITION_Y'] = closestResource.y - myRobotState.y
        }

      } else if (sensorName === 'CLOSEST_BLUE_AGENT_POSITION_X') {
        if (closestBlueRobot != null) {
          sensorReadoutState['CLOSEST_BLUE_AGENT_POSITION_X'] = closestBlueRobot.x - myRobotState.x
        }

      } else if (sensorName === 'CLOSEST_BLUE_AGENT_POSITION_Y') {
        if (closestBlueRobot != null) {
          sensorReadoutState['CLOSEST_BLUE_AGENT_POSITION_Y'] = closestBlueRobot.y - myRobotState.y
        }

      } else if (sensorName === 'CLOSEST_RED_AGENT_POSITION_X') {
        if (closestRedRobot != null) {
          sensorReadoutState['CLOSEST_RED_AGENT_POSITION_X'] = closestRedRobot.x - myRobotState.x
        }

      } else if (sensorName === 'CLOSEST_RED_AGENT_POSITION_Y') {
        if (closestRedRobot != null) {
          sensorReadoutState['CLOSEST_RED_AGENT_POSITION_Y'] = closestRedRobot.y - myRobotState.y
        }
      }
    })
    this.sensorReadoutState = sensorReadoutState
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

  findClosestObject (me, objects) {
    // me: object with x and y values,
    // objects: array with objects with x and y values

    // returns: closest object that is not identical (===) to me
    let minDist = Infinity
    let closestObject = null

    objects.forEach(ob => {
      if (ob !== me) {
        // actually the square of the distances will do, saves a root calculation:
        let dist = Math.pow(ob.x - me.x, 2) + Math.pow(ob.y - me.y, 2)
        if (dist < minDist) {
          minDist = dist
          closestObject = ob
        }
      }
    })

    return closestObject
  }
}
