// A Brain is a neural network, with training and evaluation capabilities and an
// internal buffer of samples.
// The current implementation uses tensorflow.js.

import * as tf from '@tensorflow/tfjs'
const _ = require('lodash')

export default class Brain {
  constructor (inputDimension, outputDimension, hiddenLayers = null) {
    // standard network architecture:
    // one hidden layer, same number of nodes as input_dim
    if (hiddenLayers === null) {
      hiddenLayers = [inputDimension, inputDimension]
    }

    // in- and output dimensions and hidden layers
    this.inputDimension = inputDimension
    this.outputDimension = outputDimension
    this.hiddenLayers = hiddenLayers

    // training batch size:
    this.batchSize = 8

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
  }

  makeModel () {
    // create model
    let model = tf.sequential()

    // hidden layers
    let lastLayerDimension = this.inputDimension
    for (let layer of this.hiddenLayers) {
      model.add(tf.layers.dense({ units: layer, inputShape: [lastLayerDimension], activation: 'softsign' }))
      lastLayerDimension = layer
    }

    // output layer
    model.add(tf.layers.dense({ units: this.outputDimension, activation: 'softsign' }))

    // compile
    model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    })

    // debugging
    console.log('Made a model:')
    model.summary()

    return model
  }

  addSample (input, output) {
    this.samples.push([input, output])
  }

  setSamples (newSamples) {
    this.samples = newSamples
  }

  getModelState () {
    return this.modelState
  }

  train (maximumNumberOfSamples, maximumTime = Infinity, stopIfNotImproving = false) {
    // check if there are enough samples for at least one batch:
    if (this.samples.length < this.batchSize) { return }
    this.modelState.isTraining = true

    // prevent double training:
    if (this.modelLock) { return }
    this.modelLock = true

    // grab a batch of random samples and unzip:
    let randomSamples = _.sampleSize(this.samples, this.batchSize)
    let input = randomSamples.map(sample => sample[0])
    let output = randomSamples.map(sample => sample[1])

    // record training start for time duration
    this.trainingStartedDate = new Date()

    // fit the model:
    this.model.fit(
      tf.tensor(input), tf.tensor(output), { batchSize: this.batchSize }
    ).then(history => {
      // release model lock
      this.modelLock = false

      // update model state
      this.modelState.isTrained = true
      this.modelState.currentLoss = Math.min(1, history.history.loss[0])
      this.modelState.movingAverageLoss = (1 - this.lossMovingAverageSpeed) * this.modelState.movingAverageLoss + this.lossMovingAverageSpeed * this.modelState.currentLoss
      maximumNumberOfSamples -= this.batchSize
      this.modelState.samplesLeftinCurrentRun = maximumNumberOfSamples
      maximumTime -= (new Date() - this.trainingStartedDate) / 1000
      this.modelState.timeLeftinCurrentRun = maximumTime

      // check stop conditions:
      if (maximumNumberOfSamples < 0) {
        // stop training, maximum number of samples reached
        this.modelState.isTraining = false
      }
      if (maximumTime < 0) {
        // stop training, maximum number of time reached
        this.modelState.isTraining = false
      }
      if (stopIfNotImproving) {
        if (this.modelState.currentLoss > this.modelState.movingAverageLoss) {
          // stop training, loss not imporoving
          this.modelState.isTraining = false
        }
      }

      if (this.modelState.isTraining) {
        // if no stop condition was triggered then keep training, start new batch:
        this.train(maximumNumberOfSamples, maximumTime, stopIfNotImproving)
      }
    })
  }

  setInput (input) {
    // evaluating the model is an asynchronous process. You don't call an
    // evaluate function, instead you set the current input for the brain and
    // get the latest output
    this.currentInput = input

    if (!this.modelState.isTrained) { return }

    let prediction = this.model.predict(tf.tensor([input]))
    prediction.data().then(data => {
      this.currentOutput = Array.from(data)
      console.log('input:', this.currentInput, 'output:', this.currentOutput)
      console.log('samples:', this.samples)
    })
  }

  getOutput () {
    // see comment under SetInput ()
    return this.currentOutput
  }
}
