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
