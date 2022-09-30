import {ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {Appbar, Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';

import {onDismiss, setPlaylists} from '../../redux/slices/modalSlice';
import CheckBoxComponent from '../CheckBoxComponent';

const AddToPlaylist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const playlists = useSelector(state => state.modal.playlists);
  const selectedPlaylists = useSelector(state => state.modal.selectedPlaylists);
  const data = useSelector(state => state.modal.data);

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
      <Appbar.Header>
        <Appbar.Content
          title="Add to Playlist(s)"
          titleStyle={styles.titleStyle}
        />
        <Appbar.Action
          icon="close"
          onPress={() => dispatch(onDismiss())}
          iconColor="white"
        />
      </Appbar.Header>
      <ScrollView>
        {playlists !== null
          ? playlists.map(playlist => {
              return (
                <CheckBoxComponent
                  title={playlist.title}
                  key={playlist.id}
                  id={playlist.id}
                />
              );
            })
          : null}
        <Button icon="plus" onPress={() => navigate('/new')}>
          Add new playlist
        </Button>
      </ScrollView>
      <View style={styles.buttonRow}>
        <Button
          compact="true"
          onPress={() => {
            dispatch(onDismiss());
          }}
          style={styles.button}>
          Cancel
        </Button>
        <Button
          compact="true"
          mode="contained"
          textColor="black"
          styles={styles.button}
          onPress={async () => {
            const playlistData = await getData();
            const newPlaylistData = playlistData.map(playlistObject => {
              if (_.includes(selectedPlaylists, playlistObject.id)) {
                if (!_.find(playlistObject.playlist, {videoId: data.videoId})) {
                  const newPlaylist = _.concat(playlistObject.playlist, data);
                  return {...playlistObject, playlist: newPlaylist};
                } else {
                  return playlistObject;
                }
              } else {
                return playlistObject;
              }
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
          Done
        </Button>
      </View>
    </View>
  );
};

export default AddToPlaylist;

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
});
