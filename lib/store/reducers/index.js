
import * as ActionTypes from '../actions'
import _ from 'lodash'
import { routerReducer as routing } from 'react-router-redux'
import { intlReducer } from 'react-intl-redux'
import { combineReducers } from 'redux'

// Updates an entity cache in response to any action with response.entities.
const entities = (state = { comps: {}, config: {} }, action) => {
  if (action.response && action.response.entities) {
    return _.merge({}, state, action.response.entities)
  }
  return state
}

// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
  const { type, error } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return action.error
  }

  return state
}

const rootReducer = combineReducers({
  intl: intlReducer,
  entities,
  errorMessage,
  routing
})

export default rootReducer
