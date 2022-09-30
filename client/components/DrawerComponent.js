import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Text} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigate} from 'react-router-native';
import {v4 as uuidv4} from 'uuid';
import TrackPlayer from 'react-native-track-player';
import _ from 'lodash';

import TabComponent from './TabComponent';
import {setEditPlaylist, setModalVisibility} from '../redux/slices/modalSlice';
import {setQueue} from '../redux/slices/playerSlice';

const Drawer = createDrawerNavigator();

const DrawerContent = ({navigation}) => {
  const playlists = useSelector(state => state.modal.playlists);
  const shuffleMode = useSelector(state => state.player.shuffleMode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getQueue = async () => {
    try {
      const currentQueue = await TrackPlayer.getQueue();
      dispatch(setQueue(currentQueue));
    } catch (error) {
      console.log(error);
    }
  };
  const url = process.env.REACT_APP_BASE_URL;

  return (
    <View style={styles.drawerContainer}>
      <Text variant="headlineSmall" style={styles.textColor}>
        Playlists:
      </Text>
      <ScrollView>
        {playlists !== null
          ? playlists.map(playlistObj => {
              return (
                <View style={styles.playlistItems} key={playlistObj.id}>
                  <Text variant="titleMedium" style={styles.textColor}>
                    {playlistObj.title}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        const tracks = playlistObj.playlist.map(item => {
                          const track = {
                            duration: Number(item.duration),
                            id: uuidv4(),
                            title: item.title,
                            artist: item.channelTitle,
                            artwork: item.thumbnails.high.url,
                            url: `${url}/youtube?id=${item.videoId}`,
                            jsonData: item,
                          };
                          return track;
                        });
                        TrackPlayer.add(
                          shuffleMode === 'on' ? _.shuffle(tracks) : tracks,
                        );
                        getQueue();
                        TrackPlayer.play();
                        navigation.closeDrawer();
                      }}>
                      <Ionicons name="md-play" size={20} color="#B8BBBC" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => {
                        dispatch(setEditPlaylist(playlistObj));
                        navigate('/edit');
                        dispatch(setModalVisibility(true));
                      }}>
                      <MaterialIcons name="edit" size={20} color="#B8BBBC" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          : null}
      </ScrollView>
    </View>
  );
};

const DrawerComponent = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: 'black',
        },
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Tab" component={TabComponent} />
    </Drawer.Navigator>
  );
};

export default DrawerComponent;

const styles = StyleSheet.create({
  playlistItems: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  drawerContainer: {
    padding: 20,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    paddingLeft: 30,
  },
  textColor: {
    color: '#B8BBBC',
  },
});
