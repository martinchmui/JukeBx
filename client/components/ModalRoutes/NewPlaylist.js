import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Appbar, Button, TextInput} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {v4 as uuidv4} from 'uuid';

import {onDismiss, setPlaylists} from '../../redux/slices/modalSlice';

const NewPlaylist = () => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const data = useSelector(state => state.modal.data);

  const addNewPlaylist = async () => {
    try {
      const value = await AsyncStorage.getItem('playlists');
      if (value === null) {
        const playlistObject = [{title: text, id: uuidv4(), playlist: [data]}];
        const jsonValue = JSON.stringify(playlistObject);
        try {
          dispatch(setPlaylists(playlistObject));
          await AsyncStorage.setItem('playlists', jsonValue);
        } catch (error) {
          console.log(error);
        }
      }
      if (value !== null) {
        const jsonData = JSON.parse(value);
        const playlistObject = [
          ...jsonData,
          {title: text, id: uuidv4(), playlist: [data]},
        ];
        const jsonValue = JSON.stringify(playlistObject);
        try {
          dispatch(setPlaylists(playlistObject));
          await AsyncStorage.setItem('playlists', jsonValue);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content
          title="Create New Playlist"
          titleStyle={styles.titleStyle}
        />
        <Appbar.Action
          icon="close"
          onPress={() => dispatch(onDismiss())}
          iconColor="white"
        />
      </Appbar.Header>
      <TextInput
        label="Playlist Title"
        value={text}
        onChangeText={value => setText(value)}
        theme={{colors: {onSurfaceVariant: 'white'}}}
      />
      <View style={styles.buttonRow}>
        <Button
          compact="true"
          onPress={() => {
            dispatch(onDismiss());
            setText('');
          }}
          style={styles.button}>
          Cancel
        </Button>
        <Button
          compact="true"
          mode="contained"
          textColor="black"
          styles={styles.button}
          onPress={() => {
            if (text !== '') {
              addNewPlaylist();
              dispatch(onDismiss());
            } else {
              console.log('Enter a title for playlist');
            }
          }}>
          Create & Add
        </Button>
      </View>
    </View>
  );
};

export default NewPlaylist;

const styles = StyleSheet.create({
  titleStyle: {
    color: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 20,
  },
  button: {
    paddingHorizontal: 10,
  },
  container: {
    paddingBottom: 30,
    paddingTop: 20,
  },
});
