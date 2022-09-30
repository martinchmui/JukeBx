import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Appbar, TextInput, Button, List} from 'react-native-paper';
import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigate} from 'react-router-native';

import {
  onDismiss,
  setEditPlaylist,
  setPlaylists,
} from '../../redux/slices/modalSlice';

const EditPlaylist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const playlistObj = useSelector(state => state.modal.editPlaylist);
  const [text, setText] = useState(
    playlistObj !== null ? playlistObj.title : '',
  );
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
          title="Edit Playlist"
          titleStyle={styles.titleStyle}
          style={styles.appbarContent}
        />
        <View style={styles.appbarActions}>
          <Appbar.Action
            icon="delete"
            onPress={() => {
              navigate('/delete');
            }}
            iconColor="red"
          />
          <Appbar.Action
            icon="close"
            onPress={() => dispatch(onDismiss())}
            iconColor="white"
          />
        </View>
      </Appbar.Header>
      <TextInput
        label="Playlist Title"
        value={text}
        onChangeText={value => {
          setText(value);
          dispatch(setEditPlaylist({...playlistObj, title: value}));
        }}
        theme={{colors: {onSurfaceVariant: 'white'}}}
      />
      <View style={styles.scrollView}>
        <ScrollView>
          <View>
            <List.Subheader style={styles.listSubheader}>
              Tracks:
            </List.Subheader>
            {playlistObj !== null
              ? playlistObj.playlist.map(item => {
                  return (
                    <List.Item
                      title={item.title}
                      right={props => (
                        <TouchableOpacity
                          onPress={() => {
                            const playlist = playlistObj.playlist;
                            const newPlaylist = _.filter(
                              playlist,
                              function (o) {
                                return o.videoId !== item.videoId;
                              },
                            );
                            dispatch(
                              setEditPlaylist({
                                ...playlistObj,
                                playlist: newPlaylist,
                              }),
                            );
                          }}>
                          <List.Icon {...props} icon="delete" color="white" />
                        </TouchableOpacity>
                      )}
                      key={item.etag}
                      titleStyle={styles.titleStyle}
                      titleNumberOfLines={2}
                    />
                  );
                })
              : null}
          </View>
        </ScrollView>
      </View>
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
            if (text !== '') {
              const playlistData = await getData();
              const newPlaylistData = playlistData.map(item => {
                if (item.id === playlistObj.id) {
                  return playlistObj;
                } else {
                  return item;
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
            } else {
              console.log('Enter a title for playlist');
            }
          }}>
          Save
        </Button>
      </View>
    </View>
  );
};

export default EditPlaylist;

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
  listSubheader: {
    color: '#FFD369',
  },
  appbarActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  appbarContent: {
    flex: 0,
  },
  scrollView: {
    height: '60%',
  },
});
