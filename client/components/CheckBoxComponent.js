import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Checkbox} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {
  addSelectedPlaylist,
  removeSelectedPlaylist,
} from '../redux/slices/modalSlice';

const CheckBoxComponent = props => {
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();
  return (
    <View>
      <Checkbox.Item
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => {
          setChecked(!checked);
          if (!checked) {
            dispatch(addSelectedPlaylist(props.id));
          } else {
            dispatch(removeSelectedPlaylist(props.id));
          }
        }}
        uncheckedColor="white"
        label={props.title}
        labelStyle={styles.label}
      />
    </View>
  );
};

export default CheckBoxComponent;

const styles = StyleSheet.create({
  label: {
    color: 'white',
  },
});
