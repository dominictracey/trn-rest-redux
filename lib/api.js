import { schema, normalize } from 'normalizr';
import { camelizeKeys } from 'humps'
import { addMiddleware } from 'meteor/nova:lib'
import thunk from 'redux-thunk'

import { CALL_API } from './types';

const API_ROOT = 'https://fantasyrugbyengine-hrd.appspot.com/_ah/api/topten/v1/'

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = (endpoint, schema) => {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint

  return fetch(fullUrl)
    .then(response =>
      response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json)
        }

        const camelizedJson = camelizeKeys(json)
        // const nextPageUrl = getNextPageUrl(response)

        return Object.assign({},
          normalize(camelizedJson, schema),
          // { nextPageUrl }
        )
      })
    )
}

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/paularmstrong/normalizr
const confSchema = new schema.Entity('config', {
  idAttribute: config => config.id,
})

const compSchema = new schema.Entity('comp', {
  idAttribute: comp => comp.id,
})

const roundSchema = new schema.Entity('rounds', {
  idAttribute: round => round.id,
})

const matchSchema = new schema.Entity ('matches', {
  idAttribute: match => match.id,
})

const teamSchema = new schema.Entity ('teams', {
  idAttribute: team => team.id,
})

const matchResultSchema = new schema.Entity ('simpleScoreMatchResults', {
    idAttribute: simpleScoreMatchResult => simpleScoreMatchResult.id
})

const teamStatsSchema = new schema.Entity ('teamMatchStatsByMatchId', {
  //idAttribute: teamMatchStats => match.id,
})

const teamMatchStatsSchema = new schema.Entity ('teamMatchStats', {
  //idAttribute: teamMatchStats => teamMatchStats.tmsList.teamId,
})

const playerSchema = new schema.Entity('playerStats', {
  // Something here to make it look like I know what I'm doing/
  idAttribute: player => player.id
})

const playerMatchSchema = new schema.Entity('playerMatchStats', {
  //idAttribute: player => player.id,
})

const standingsSchema = new schema.Entity('compStandingsById', {
  // Weeeee
})

const compStandingsSchema = new schema.Entity('compStandings', {

})

compSchema.define({
  rounds: [roundSchema],
})

roundSchema.define({
  matches: [matchSchema],
})

matchSchema.define({
  homeTeam: teamSchema,
  visitingTeam: teamSchema,
  simpleScoreMatchResult: matchResultSchema,
})

teamStatsSchema.define({
  tmsList: [teamMatchStatsSchema],
})

playerMatchSchema.define({
  players: [playerSchema],
})

standingsSchema.define({
  standingsList: [compStandingsSchema],
})

// Schemas for TRN API responses.
export const Schemas = {
  CONF: confSchema,
  COMP: compSchema,
  ROUND: roundSchema,
  ROUND_ARRAY: [roundSchema],
  MATCH: matchSchema,
  MATCH_ARRAY: [matchSchema],
  TEAMMATCHSTATS: teamStatsSchema,
  PLAYERMATCHSTATS: playerMatchSchema,
  COMPSTANDINGS: standingsSchema,
}

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
addMiddleware([
  thunk,
  store => next => action => {
    const callAPI = action[CALL_API]
    if (typeof callAPI === 'undefined') {
      return next(action)
    }

    let { endpoint } = callAPI
    const { schema, types } = callAPI

    if (typeof endpoint === 'function') {
      endpoint = endpoint(store.getState())
    }

    if (typeof endpoint !== 'string') {
      throw new Error('Specify a string endpoint URL.')
    }
    if (!schema) {
      throw new Error('Specify one of the exported Schemas.')
    }
    if (!Array.isArray(types) || types.length !== 3) {
      throw new Error('Expected an array of three action types.')
    }
    if (!types.every(type => typeof type === 'string')) {
      throw new Error('Expected action types to be strings.')
    }

    const actionWith = data => {
      const finalAction = Object.assign({}, action, data)
      delete finalAction[CALL_API]
      return finalAction
    }

    const [ requestType, successType, failureType ] = types
    next(actionWith({ type: requestType }))

    return callApi(endpoint, schema).then(
      response => next(actionWith({
        response,
        type: successType
      })),
      error => next(actionWith({
        type: failureType,
        error: error.message || 'Something bad happened'
      }))
    )
  },
]);
