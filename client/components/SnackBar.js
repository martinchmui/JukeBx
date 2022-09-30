import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Snackbar} from 'react-native-paper';
import {StyleSheet, Text} from 'react-native';

import {setSnackBarState} from '../redux/slices/searchSlice';

const SnackBar = () => {
  const snackbar = useSelector(state => state.search.snackbar);
  const dispatch = useDispatch();

  const onDismiss = () => {
    dispatch(setSnackBarState(false));
  };

  return (
    <Snackbar
      visible={snackbar}
      onDismiss={onDismiss}
      action={{
        label: 'Dismiss',
        onPress: () => {
          onDismiss;
        },
      }}
      wrapperStyle={styles.wrapper}
      style={styles.snackBarStyle}>
      <Ionicons name="checkmark-circle-outline" color="green" size={20} />
      <Text style={styles.textColor}>TRACK ADDED TO QUEUE</Text>
    </Snackbar>
  );
};

export default SnackBar;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: '13%',
    zIndex: 2,
  },
  snackBarStyle: {
    backgroundColor: 'black',
  },
  textColor: {
    color: '#B8BBBC',
  },
});
