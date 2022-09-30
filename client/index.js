import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import {Provider} from 'react-redux';
import {store, persistor} from './redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {NativeRouter} from 'react-router-native';
import 'react-native-get-random-values';

const ReduxWrapper = () => {
  return (
    <NativeRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </NativeRouter>
  );
};

AppRegistry.registerComponent(appName, () => ReduxWrapper);
TrackPlayer.registerPlaybackService(() => require('./service'));
