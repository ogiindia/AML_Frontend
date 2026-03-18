// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
// import 'reactflow/dist/style.css';
// import './index.css';
import { persistor, store } from './redux/store';
import Navigations from './router/Navigations';
// import './static/css/antdgrid.css';

import { injectStore } from '@ais/api';
import { PersistGate } from 'redux-persist/integration/react';
// import './App.css';
import HOC from './HOC';
// import './static/css/custom.scss';
import AntWrapper from './utilites/AntWrapper';
import { GlobalProvider } from './utilites/Contexts/GlobalContext';
import { PageProvider } from './utilites/Contexts/PageContext';
import { SessionProvider } from './utilites/Contexts/WithSession';

import '@ais/components/styles';

import '@fontsource/inter';

import './static/css/theme.css';
import { initializeBranding } from './utilites/BrandingLoader';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Initialize branding configuration before rendering the app
initializeBranding().then(() => {
  root.render(
    <React.Fragment>
      <AntWrapper />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GlobalProvider>
            <PageProvider>
              <SessionProvider>
                <HOC>
                  <Navigations />
                </HOC>
              </SessionProvider>
            </PageProvider>
          </GlobalProvider>
        </PersistGate>
      </Provider>
    </React.Fragment>,
  );

  injectStore(store);
});
