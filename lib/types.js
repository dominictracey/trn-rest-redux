// -------
// The Rugby Net - Redux Action Types
// -------

// Action key that carries API call info interpreted by the API redux middleware.
export const CALL_API = Symbol('Call API');

export const CONF_REQUEST = 'CONF_REQUEST';
export const CONF_SUCCESS = 'CONF_SUCCESS';
export const CONF_FAILURE = 'CONF_FAILURE';

export const COMP_REQUEST = 'COMP_REQUEST';
export const COMP_SUCCESS = 'COMP_SUCCESS';
export const COMP_FAILURE = 'COMP_FAILURE';

export const MATCH_REQUEST = 'MATCH_REQUEST';
export const MATCH_SUCCESS = 'MATCH_SUCCESS';
export const MATCH_FAILURE = 'MATCH_FAILURE';

export const MATCH_TEAM_STATS_REQUEST = 'MATCH_TEAM_STATS_REQUEST';
export const MATCH_TEAM_STATS_SUCCESS = 'MATCH_TEAM_STATS_SUCCESS';
export const MATCH_TEAM_STATS_FAILURE = 'MATCH_TEAM_STATS_FAILURE';

export const MATCH_PLAYER_STATS_REQUEST = 'MATCH_PLAYER_STATS_REQUEST';
export const MATCH_PLAYER_STATS_SUCCESS = 'MATCH_PLAYER_STATS_SUCCESS';
export const MATCH_PLAYER_STATS_FAILURE = 'MATCH_PLAYER_STATS_FAILURE';

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';
