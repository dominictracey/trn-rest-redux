import { addReducer } from 'meteor/vulcan:lib';
import * as ActionTypes from './types.js';
import _ from 'lodash';

// -------
// The Rugby Net - Redux Reducers
// -------

const entitiesInitalState = {
  comps: {},
  rounds: {},
  config: {},
  teams: {},
  simpleScoreMatchResults: {},
  teamMatchStatsByMatchId: {},
  teamMatchStats: {},
  playerStats: {},
  playerMatchStats: {},
  standing: {},
  compStandingsById: {},
  universalRoundFnR: {},
}

addReducer({
  // Updates an entity cache in response to any action with response.entities.
  entities: (state = entitiesInitalState, action) => {
    if (action.response && action.response.entities) {
      return _.merge({}, state, action.response.entities);
    }
    return state;
  },

  // Updates error message to notify about the failed fetches.
  errorMessage: (state = null, action) => {
    const { type, error } = action;

    if (type === ActionTypes.RESET_ERROR_MESSAGE) {
      return null;
    } else if (error) {
      return action.error;
    }

    return state;
  },
});
