import { Reducers } from 'meteor/nova:lib';
import * as ActionTypes from '../actions'
import _ from 'lodash'

// Updates an entity cache in response to any action with response.entities.
Reducers.entities = (state = { comps: {}, config: {} }, action) => {
  if (action.response && action.response.entities) {
    return _.merge({}, state, action.response.entities)
  }
  return state
}

// Updates error message to notify about the failed fetches.
Reducers.errorMessage = (state = null, action) => {
  const { type, error } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return action.error
  }

  return state
}
