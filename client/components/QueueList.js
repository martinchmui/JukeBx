import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Text, Appbar, MD3DarkTheme} from 'react-native-paper';
import {Provider} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TrackPlayer from 'react-native-track-player';

import {
  setBottomSheetIndex,
  setQueue,
  resetState,
} from '../redux/slices/playerSlice';
import ListItemComponent from './ListItemComponent';
import MenuItem from './MenuItem';

const QueueList = ({navigation}) => {
  const queue = useSelector(state => state.player.queue);
  const currentTrack = useSelector(state => state.player.currentTrack);
  const dispatch = useDispatch();
  useEffect(() => {
    const minimizePlayer = navigation.addListener('tabPress', e => {
      dispatch(setBottomSheetIndex(0));
    });
    return minimizePlayer;
  }, [navigation, dispatch]);
  const getQueue = async () => {
    try {
      const currentQueue = await TrackPlayer.getQueue();
      dispatch(setQueue(currentQueue));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Provider theme={MD3DarkTheme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
          <Appbar.Content title="Your Queue" />
          <Appbar.Action
            icon="playlist-remove"
            onPress={() => {
              TrackPlayer.reset();
              dispatch(resetState());
            }}
          />
        </Appbar.Header>
        <View style={styles.scrollViewWrapper(queue.length)}>
          <ScrollView>
            <Text
              variant="titleMedium"
              style={[styles.text, styles.headerSmall]}>
              Currently Playing
            </Text>
            <View style={styles.horizontalRule} />
            {currentTrack !== null ? (
              <View style={styles.trackContainer}>
                <View style={styles.trackWidth}>
                  <ListItemComponent
                    result={queue[currentTrack].jsonData}
                    menuItem={
                      <MenuItem result={queue[currentTrack].jsonData} />
                    }
                  />
                </View>
                <TouchableOpacity
                  onPress={async () => {
                    const currentTrackIndex =
                      await TrackPlayer.getCurrentTrack();
                    TrackPlayer.skipToNext();
                    if (queue.length === currentTrackIndex + 1) {
                      TrackPlayer.reset();
                      dispatch(resetState());
                    } else {
                      TrackPlayer.remove(currentTrackIndex);
                      getQueue();
                    }
                  }}>
                  <Ionicons name="close" size={30} color="#B8BBBC" />
                </TouchableOpacity>
              </View>
            ) : null}
            {queue.slice(currentTrack + 1).length !== 0 ? (
              <View>
                <Text
                  variant="titleMedium"
                  style={[styles.text, styles.headerSmall]}>
                  Next in your Queue
                </Text>
                <View style={styles.horizontalRule} />
                <View>
                  {queue.slice(currentTrack + 1).map((item, index) => {
                    const trackIndex = queue.findIndex(
                      track => track.id === item.id,
                    );
                    return (
                      <View style={styles.trackContainer} key={index}>
                        <View style={styles.trackWidth}>
                          <ListItemComponent
                            result={item.jsonData}
                            menuItem={<MenuItem result={item.jsonData} />}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            TrackPlayer.remove(trackIndex);
                            getQueue();
                          }}>
                          <Ionicons name="close" size={30} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Provider>
  );
};

export default QueueList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  text: {
    color: '#fff',
  },
  headerSmall: {
    paddingTop: 20,
    paddingLeft: 30,
    paddingBottom: 20,
  },
  horizontalRule: {
    borderBottomColor: 'grey',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  trackWidth: {
    width: '90%',
  },
  scrollViewWrapper: queueLength => ({
    height: queueLength !== 0 ? '82%' : '100%',
  }),
});
