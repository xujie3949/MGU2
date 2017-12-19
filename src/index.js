import React from 'react';
import { render } from 'react-dom';
import { useStrict } from 'mobx';

import App from 'Components/app/App';
import constValues from 'Utils/constants';

useStrict(true);

const renderApp = component => {
  const RootComponent = component;
  const root = document.getElementById('root');
  render(
    <RootComponent/>,
    root,
  );
};

renderApp(App);

if (module.hot && !constValues.isProduction) {
  module.hot.accept('Components/app/App', () => renderApp(App));
}
