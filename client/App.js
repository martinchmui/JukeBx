import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';

import DrawerComponent from './components/DrawerComponent';
import ModalComponent from './components/ModalComponent';
import SnackBar from './components/SnackBar';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider theme={{colors: {primary: '#FFD369'}}}>
      <GestureHandlerRootView style={styles.container}>
        <NavigationContainer theme={{colors: {primary: '#FFD369'}}}>
          <ModalComponent />
          <DrawerComponent />
          <SnackBar />
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
