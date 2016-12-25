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

Install [meteor-fetch](https://github.com/timbrandin/meteor-fetch) to support server side fetch.

Add both to .meteor/packages:
```
############ Your Packages ############
trn:rest-redux
timbrandin:fetch
```

Replace nova-base-components/lib/common/App.jsx to use redux
```
import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { configureStore } from 'meteor/trn:rest-redux';
import { IntlProvider, intlShape} from 'react-intl';
import { AppComposer } from "meteor/nova:core";
import {Provider} from 'react-intl-redux'

var store = {}

class App extends Component {

  componentWillMount() {
    const locale = Telescope.settings.get("locale", "en")
    const messages = Telescope.strings[locale];
    store = configureStore({
      intl: {
        locale: locale,
        messages: messages,
      },
    })
  }

  getLocale() {
    return Telescope.settings.get("locale", "en");
  }

  getChildContext() {

    const messages = Telescope.strings[this.getLocale()] || {};
    const intlProvider = new IntlProvider({locale: this.getLocale()}, messages);

    const {intl} = intlProvider.getChildContext();

    return {
      currentUser: this.props.currentUser,
      actions: this.props.actions,
      events: this.props.events,
      messages: this.props.messages,
      intl: intl
    };
  }

  render() {

    return (
      <Provider store={store}>
          {
            this.props.ready ?
              <Telescope.components.Layout>{this.props.children}</Telescope.components.Layout>
            : <Telescope.components.AppLoading />
          }
      </Provider>
    )
  }

}

App.propTypes = {
  ready: React.PropTypes.bool,
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  messages: React.PropTypes.object,
}

App.childContextTypes = {
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  messages: React.PropTypes.object,
  intl: intlShape
}

module.exports = AppComposer(App);
export default AppComposer(App);
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

export default connect(mapStateToProps)(MyCustomComponent)

```

Install the chrome redux devtools to inspect the redux store and watch the actions happen.

# Credits

[Telescope](https://github.com/TelescopeJS/Telescope) is a community work led by various people including [Sacha Greif](https://github.com/SachaG) and [Xavier Cazalot](https://github.com/xavcz)

[Normalizr](https://github.com/paularmstrong/normalizr)  was originally created by Dan Abramov and inspired by a conversation with Jing Chen.
