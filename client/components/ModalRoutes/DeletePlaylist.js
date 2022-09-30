import {View, StyleSheet} from 'react-native';
import React from 'react';
import {Appbar, Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';

import {setPlaylists, onDismiss} from '../../redux/slices/modalSlice';

const DeletePlaylist = () => {
  const playlistObj = useSelector(state => state.modal.editPlaylist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('playlists');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content
          title={`Delete ${
            playlistObj !== null ? playlistObj.title : ''
          } Playlist?`}
          titleStyle={styles.titleStyle}
          style={styles.appbarContent}
        />
      </Appbar.Header>
      <View style={styles.buttonRow}>
        <Button
          compact="true"
          onPress={() => navigate('/edit')}
          style={styles.button}>
          Go Back
        </Button>
        <Button
          compact="true"
          mode="contained"
          textColor="white"
          buttonColor="red"
          styles={styles.button}
          onPress={async () => {
            const playlistData = await getData();
            const newPlaylistData = _.filter(playlistData, function (o) {
              return o.id !== playlistObj.id;
            });
            try {
              dispatch(setPlaylists(newPlaylistData));
              const jsonValue = JSON.stringify(newPlaylistData);
              await AsyncStorage.setItem('playlists', jsonValue);
            } catch (error) {
              console.log(error);
            }
            dispatch(onDismiss());
          }}>
          Delete
        </Button>
      </View>
    </View>
  );
};

export default DeletePlaylist;

const styles = StyleSheet.create({
  titleStyle: {
    color: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 20,
  },
  appbarContent: {
    flex: 0,
  },
});
