'use strict'

const C = require('../constants/constants')

function sendError (event, message, recordName, socketWrapper, onError, options, context) {
  options.logger.log(C.LOG_LEVEL.ERROR, event, message)
  if (socketWrapper) {
    socketWrapper.sendError(C.TOPIC.RECORD, event, message)
  }
  if (onError) {
    onError.call(context, event, message, recordName, socketWrapper)
  }
}

function onStorageResponse(error, record, recordName, socketWrapper, onComplete, onError, options, context) {
  if (error) {
    sendError(
      C.EVENT.RECORD_LOAD_ERROR,
      `error while loading ${recordName} from storage:${error.toString()}`,
      recordName,
      socketWrapper,
      onError,
      options,
      context
    )
  } else {
    onComplete.call(context, record || null, recordName, socketWrapper)

    if (record) {
      options.cache.set(recordName, record, () => {})
    }
  }
}

function onCacheResponse (error, record, recordName, socketWrapper, onComplete, onError, options, context) {
  if (error) {
    sendError(
      C.EVENT.RECORD_LOAD_ERROR, 
      `error while loading ${recordName} from cache:${error.toString()}`,
      recordName,
      socketWrapper,
      onError,
      options,
      context
    )
  } else if (record) {
    onComplete.call(context, record, recordName, socketWrapper)
  } else if (
      !options.storageExclusion ||
      !options.storageExclusion.test(recordName)
    ) {
    options.storage.get(recordName, (error, record) => onStorageResponse(
      error,
      record,
      recordName,
      socketWrapper,
      onComplete,
      onError,
      options,
      context
    ))
  } else {
    onComplete.call(context, null, recordName, socketWrapper)
  }
}

module.exports = function (recordName, options, socketWrapper, onComplete, onError, context) {
  options.cache.get(recordName, (error, record) => onCacheResponse(
    error,
    record,
    recordName,
    socketWrapper,
    onComplete,
    onError,
    options,
    context
  ))
}
