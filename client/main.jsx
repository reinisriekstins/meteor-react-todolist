import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import '../imports/startup/accounts-config.jsx';
import App from '../imports/ui/App.jsx';


Meteor.startup(() => {
  render(<App />, document.querySelector('#render-target'));
});