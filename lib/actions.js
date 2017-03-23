import { Schemas } from './api';
import * as ActionTypes from './types.js';
import { addAction } from 'meteor/vulcan:lib';

// -------
// The Rugby Net - Redux Async/Sync Actions
// -------

// all the action types needed here
const {
  CALL_API,
  CONF_REQUEST, CONF_SUCCESS, CONF_FAILURE,
  COMP_REQUEST, COMP_SUCCESS, COMP_FAILURE,
  COMP_STANDINGS_REQUEST, COMP_STANDINGS_SUCCESS, COMP_STANDINGS_FAILURE,
  MATCH_REQUEST, MATCH_SUCCESS, MATCH_FAILURE,
  MATCH_TEAM_STATS_REQUEST, MATCH_TEAM_STATS_SUCCESS, MATCH_TEAM_STATS_FAILURE,
  MATCH_PLAYER_STATS_REQUEST, MATCH_PLAYER_STATS_SUCCESS, MATCH_PLAYER_STATS_FAILURE,
  FIXTURES_AND_RESULTS_REQUEST, FIXTURES_AND_RESULTS_SUCCESS, FIXTURES_AND_RESULTS_FAILURE,
  RESET_ERROR_MESSAGE
} = ActionTypes;

// Fetches configuration of TRN API.
// Relies on the custom API middleware defined in ./api.js.
const fetchConfiguration = () => ({
  [CALL_API]: {
    types: [ CONF_REQUEST, CONF_SUCCESS, CONF_FAILURE ],
    endpoint: `configuration`,
    schema: Schemas.CONF
  }
});

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
};

// Fetches a single comp.
// Relies on the custom API middleware defined in ./api.js.
const fetchComp = id => ({
  [CALL_API]: {
    types: [ COMP_REQUEST, COMP_SUCCESS, COMP_FAILURE ],
    endpoint: `competitions/get?id=${id}`,
    schema: Schemas.COMP
  }
});

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
};

// Fetches a single MATCH.
const fetchMatch = id => ({
  [CALL_API]: {
    types: [ MATCH_REQUEST, MATCH_SUCCESS, MATCH_FAILURE ],
    endpoint: `match/get?id=${id}`,
    schema: Schemas.MATCH
  }
});

// Fetches a single match from TRN API unless it is cached.
export const loadMatch = (id, requiredFields = []) => (dispatch, getState) => {

      //Removed the caching so that the matches will actually refresh score.
  // const match = getState().entities.matches
  //   ? getState().entities.matches[id] || null
  //   : null
  // if (match && requiredFields.every(key => match.hasOwnProperty(key))) {
  //   return null
  // }
  return dispatch(fetchMatch(id))
};

// Fetches a team's stats for single MATCH.
const fetchTeamStats = (matchId) => ({
  [CALL_API]: {
    types: [ MATCH_TEAM_STATS_REQUEST, MATCH_TEAM_STATS_SUCCESS, MATCH_TEAM_STATS_FAILURE ],
    endpoint: `teamMatchStats/get?matchId=${matchId}`,
    schema: Schemas.TEAMMATCHSTATS
  }
});

// Fetches a single match from TRN API unless it is cached.
export const loadTeamMatchStats = (matchId, teamId, requiredFields = []) => (dispatch, getState) => {
  const teamMatchStats = getState().entities.teamMatchStats
    ? getState().entities.teamMatchStats[matchId] || null
    : null
  if (teamMatchStats && teamMatchStats[teamId] && requiredFields.every(key => teamMatchStats[teamId].hasOwnProperty(key))) {
    return null
  }

  return dispatch(fetchTeamStats(matchId))
};

// Fetches a team's players' stats for single MATCH.
const fetchPlayerStats = (matchId) => ({
  [CALL_API]: {
    types: [ MATCH_PLAYER_STATS_REQUEST, MATCH_PLAYER_STATS_SUCCESS, MATCH_PLAYER_STATS_FAILURE ],
    endpoint: `match/getScrumPlayerMatchStats?matchId=${matchId}`,
    schema: Schemas.PLAYERMATCHSTATS
  }
});

// Fetches a single match's players' stats from TRN API unless it is cached.
export const loadPlayerMatchStats = (matchId, teamId, requiredFields = []) => (dispatch, getState) => {
  const playerMatchStats = getState().entities.players
    ? getState().entities.players[matchId] || null
    : null
  if (playerMatchStats && playerMatchStats[teamId] && requiredFields.every(key => playerMatchStats[teamId].hasOwnProperty(key))) {
    return null
  }

  return dispatch(fetchPlayerStats(matchId))
};

// Fetches the standings from a competition
const fetchCompStandings = (compId) => ({
  [CALL_API]: {
    types: [ COMP_STANDINGS_REQUEST, COMP_STANDINGS_SUCCESS, COMP_STANDINGS_FAILURE ],
    endpoint: `competitions/getStandings?compId=${compId}`,
    schema: Schemas.COMPSTANDINGS
  }
});

export const loadCompStandings = (compId) => (dispatch, getState) => {
  const compStandings = getState().entities.compStandingsById
    ? getState().entities.compStandingsById[compId] || null
    : null

  if (compStandings) {
    return null;
  }

  return dispatch(fetchCompStandings(compId))
}

// Fetches the standings from a competition
const fetchFixturesAndResults = (uro, compIds) => ({
  [CALL_API]: {
    types: [ FIXTURES_AND_RESULTS_REQUEST, FIXTURES_AND_RESULTS_SUCCESS, FIXTURES_AND_RESULTS_FAILURE ],
    endpoint: `fixturesAndResults/get?universalRoundOrdinal=${uro}&compIds=${compIds}`,
    schema: Schemas.FIXTURESANDRESULTS,
  }
});

export const loadFixturesAndResults = (uro, compIds) => (dispatch, getState) => {
  const fixturesAndResults = getState().entities.fixturesAndResultsByUR
    ? getState().entities.fixturesAndResultsByUR[uro][compIds] || null
    : null

  if (fixturesAndResults) {
    return null;
  }

  return dispatch(fetchFixturesAndResults(uro, compIds))
}


// Resets the currently visible error message.
export const resetErrorMessage = () => ({
    type: RESET_ERROR_MESSAGE
});

addAction({
  loadConfiguration: loadConfiguration,
  loadCompetition: loadCompetition,
  loadMatch: loadMatch,
  loadTeamMatchStats: loadTeamMatchStats,
  loadPlayerMatchStats: loadPlayerMatchStats,
  loadCompStandings: loadCompStandings,
  loadFixturesAndResults: loadFixturesAndResults,
  resetErrorMessage: resetErrorMessage,
});
