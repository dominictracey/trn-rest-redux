import { CALL_API, Schemas } from './api'
import _ from 'lodash'

export const CONF_REQUEST = 'CONF_REQUEST'
export const CONF_SUCCESS = 'CONF_SUCCESS'
export const CONF_FAILURE = 'CONF_FAILURE'

// Fetches a single user from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchConfiguration = () => ({
  [CALL_API]: {
    types: [ CONF_REQUEST, CONF_SUCCESS, CONF_FAILURE ],
    endpoint: `configuration`,
    schema: Schemas.CONF
  }
})

// Fetches the core configuration unless it is cached.
// Relies on Redux Thunk middleware.
export const loadConfiguration = (requiredFields = []) => (dispatch, getState) => {
  if (!getState().entities || !getState().entities.config)  {
    return dispatch(fetchConfiguration())
  }

  const config = getState().entities.config[Object.keys(getState().entities.config)]
  if (config && requiredFields.every(key => config.hasOwnProperty(key))) {
    return null
  }

  return dispatch(fetchConfiguration())
}

export const COMP_REQUEST = 'COMP_REQUEST'
export const COMP_SUCCESS = 'COMP_SUCCESS'
export const COMP_FAILURE = 'COMP_FAILURE'

// Fetches a single comp.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchComp = id => ({
  [CALL_API]: {
    types: [ COMP_REQUEST, COMP_SUCCESS, COMP_FAILURE ],
    endpoint: `competitions/get?id=${id}`,
    schema: Schemas.COMP
  }
})

// Fetches a single comp from TRN API unless it is cached.
// Relies on Redux Thunk middleware.
export const loadCompetition = (id, requiredFields = []) => (dispatch, getState) => {
  const comp = getState().entities.comp
    ? getState().entities.comp[id] || null
    : null
  if (comp && requiredFields.every(key => comp.hasOwnProperty(key))) {
    return null
  }

  return dispatch(fetchComp(id))
}

export const MATCH_REQUEST = 'MATCH_REQUEST'
export const MATCH_SUCCESS = 'MATCH_SUCCESS'
export const MATCH_FAILURE = 'MATCH_FAILURE'

// Fetches a single MATCH.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchMatch = id => ({
  [CALL_API]: {
    types: [ MATCH_REQUEST, MATCH_SUCCESS, MATCH_FAILURE ],
    endpoint: `match/get?id=${id}`,
    schema: Schemas.MATCH
  }
})

// Fetches a single match from TRN API unless it is cached.
// Relies on Redux Thunk middleware.
export const loadMatch = (id, requiredFields = []) => (dispatch, getState) => {
  const match = getState().entities.matches
    ? getState().entities.matches[id] || null
    : null
  if (match && requiredFields.every(key => match.hasOwnProperty(key))) {
    return null
  }

  return dispatch(fetchMatch(id))
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export const resetErrorMessage = () => ({
    type: RESET_ERROR_MESSAGE
})
