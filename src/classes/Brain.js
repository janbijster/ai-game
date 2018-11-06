// A Brain is a neural network, with training and evaluation capabilities and an
// internal buffer of samples.
// The current implementation uses nn (npm nn package).

import Globals from './Globals.js'
const NN = require('nn')

export default class Brain {
  constructor (inputDimension, outputDimension, hiddenLayers, callback) {
    // standard network architecture:
    // one hidden layer, with 2 * input_dim as the number of nodes
    if (hiddenLayers === null) {
      hiddenLayers = [2 * inputDimension]
    }

    // in- and output dimensions and hidden layers
    this.inputDimension = inputDimension
    this.outputDimension = outputDimension
    this.hiddenLayers = hiddenLayers

    // training batch size:
    this.batchSize = Globals.neededNumSamples

    this.lossMovingAverageSpeed = 0.05

    // to prevent the model from training when already doing so
    this.modelLock = false
    // internal list of samples
    this.samples = []

    this.modelState = {
      movingAverageLoss: 1
    }

    this.currentInput = new Array(inputDimension).fill(0)
    this.currentOutput = new Array(outputDimension).fill(0)

    this.model = this.makeModel()

    if (callback != null) {
      callback()
    }
  }

  makeModel () {
    // create model
    let options = {
      // hidden layers eg. [ 4, 3 ] => 2 hidden layers, with 4 neurons in the first, and 3 in the second.
      layers: this.hiddenLayers,
      // maximum training epochs to perform on the training data
      iterations: this.batchSize,
      // maximum acceptable error threshold
      errorThresh: 0.0005,
      // activation function ('logistic' and 'hyperbolic' supported)
      activation: 'logistic',
      // learning rate
      learningRate: 0.4,
      // learning momentum
      momentum: 0.5,
      // logging frequency to show training progress. 0 = never, 10 = every 10 iterations.
      log: 0
    }
    let model = NN(options)

    console.log('Made a model:', model)

    return model
  }

  clamp (val, min = 0, max = 1) {
    return Math.max(Math.min(val, max), min)
  }

  normalizeArray (arr) {
    return arr.map(val => this.clamp(0.5 * (val + 1)))
  }

  unNormalizeArray (arr) {
    return arr.map(val => 2 * val - 1)
  }

  addSample (input, output) {
    this.samples.push({ input: this.normalizeArray(input), output: this.normalizeArray(output) })
  }

  setSamples (newSamples) {
    this.samples = newSamples.map(sample => {
      return {
        input: this.normalizeArray(sample[0]),
        output: this.normalizeArray(sample[1])
      }
    })
  }

  getModelState () {
    return this.modelState
  }

  trainBatch () {
    // grab a batch of random samples
    let randomSamples = this.samples

    this.model.train(randomSamples)
    let test = this.model.test(randomSamples)
    return test.mse
  }

  train (maximumNumberOfSamples, maximumTime = Infinity, stopIfNotImproving = false) {
    console.log('async training not supported in this implementation')
  }

  setInput (input) {
    this.currentOutput = this.model.send(this.normalizeArray(input))
  }

  getOutput () {
    // see comment under SetInput ()
    return this.unNormalizeArray(this.currentOutput)
  }
}
