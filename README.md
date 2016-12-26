## The Rugby Net REST client for Telescope

For use cases where you have data available in a REST server that you would like to include in your Telescope application.

# Features

  - Asyncronously calls your REST api and puts returned objects in redux store
  - Only fetches data that is not currently in the store
  - Redux middleware included requires no modification to adapt to your REST api
  - Uses [normalizr](https://github.com/paularmstrong/normalizr) to flatten and normalize JSON return values before inserting into redux store.
  - Add new endpoints with minimal boilerplate
    - Three events per endpoint (REQUEST, RESPONSE, FAILURE)
    - Exported load* action creator provides initiation method to application
    - Promise-based api call lifecycle
    - Provide any new object schemas necessary for normalizr
  - Integrated with [redux devtools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)


# Getting Started

Put this package in your Telescope packages folder

Add to .meteor/packages:
```
############ Your Packages ############
trn:rest-redux
```

Set your REST api base URL in trn-rest-redux/lib/store/api.js:
```
const API_ROOT = https://yourapi.com/v1/
```
Create actions and action creator(s) in trn-rest-redux/lib/store/actions.js e.g.:
```
export const CONF_REQUEST = 'CONF_REQUEST'
export const CONF_SUCCESS = 'CONF_SUCCESS'
export const CONF_FAILURE = 'CONF_FAILURE'

// Fetches singleton configuration object.
// Relies on the custom API middleware defined in ./api.js.
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
  const config = getState().entities.config[0]
  if (config && requiredFields.every(key => config.hasOwnProperty(key))) {
    return null
  }

  return dispatch(fetchConfiguration())
}
```
Define and export your REST return object *schemas* per [normalizr](https://github.com/paularmstrong/normalizr) in rn-rest-redux/lib/store/api.js

```
const confSchema = new Schema('config', {
  idAttribute: config => config.id,
})

export const Schemas = {
  CONF: confSchema,
}
```
# Loading REST data into redux store

To trigger a REST call from a component use the exported action creators:
```
import { actions } from 'meteor/trn:rest-redux';
```
```
const loadData = props => {
  if (actions.loadConfiguration) {
    props.dispatch(actions.loadConfiguration([ 'compsForClient' ]))
  }
}
```
```
componentWillMount() {
  loadData(this.props)
}
```

# Connect your component to redux

These entities are flattened and placed in redux store when the REST call completes successfully. Connect your component to the appropriate entities to spawn a render() call when the REST call completes successfully.

```
const mapStateToProps = state => {
  const { entities } = state
  const { config } = entities

  return {
    config,
  }
}

// if you are extending a Telescope entity
replaceComponent('CategoriesList', MyCustomComponent, connect(mapStateToProps))

// or if you are creating a plain old react component:
// export default connect(mapStateToProps)(MyPlainOldReactComponent)
```

Install the chrome redux devtools to inspect the redux store and watch the actions happen.

# Credits

[Telescope](https://github.com/TelescopeJS/Telescope) is a community work led by various people including [Sacha Greif](https://github.com/SachaG) and [Xavier Cazalot](https://github.com/xavcz)

[Normalizr](https://github.com/paularmstrong/normalizr)  was originally created by Dan Abramov and inspired by a conversation with Jing Chen.
