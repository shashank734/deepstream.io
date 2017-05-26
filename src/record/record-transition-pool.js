'use strict'

const RecordTransition = require('./record-transition')

const RecordTransitionsPool = class {
  constructor () {
    this._freeRecordTransitions = []
  }

  get (recordName, options, recordHandler) {
    let recordTransition = null

    if (this._freeRecordTransitions.length > 0) {
      recordTransition = this._freeRecordTransitions.shift()
    } else {
      recordTransition = new RecordTransition(recordName, options, recordHandler, this)
    }

    recordTransition.init(recordName)

    return recordTransition
  }

  release (recordTransition) {
    this._freeRecordTransitions.push(recordTransition)
  }

}

module.exports = new RecordTransitionsPool()