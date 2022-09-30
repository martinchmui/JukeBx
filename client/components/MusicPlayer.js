import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import TrackPlayer, {
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
  Capability,
} from 'react-native-track-player';
import {Slider} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import _ from 'lodash';
import TextTicker from 'react-native-text-ticker';

import {
  setRepeatMode,
  setTrackTitle,
  setTrackArtist,
  setTrackArtwork,
  setQueue,
  setBottomSheetIndex,
  setCurrentTrack,
  resetState,
  setTrackProgress,
  setShuffleMode,
} from '../redux/slices/playerSlice';

const togglePlayBack = async playBackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  if (currentTrack != null) {
    if (
      playBackState === State.Paused ||
      playBackState === State.Stopped ||
      playBackState === State.Ready
    ) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};

const setupPlayer = async (queue, trackProgress) => {
  try {
    await TrackPlayer.setupPlayer({
      backBuffer: 300,
      minBuffer: 300,
      maxBuffer: 300,
      waitForBuffer: true,
    });
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      progressUpdateEventInterval: 5,
    });
    const tracksFromQueue = queue.map(item => {
      const track = {
        duration: Number(item.duration),
        id: item.id,
        title: item.title,
        artist: item.artist,
        artwork: item.artwork,
        url: item.url,
        jsonData: item.jsonData,
      };
      return track;
    });
    await TrackPlayer.reset();
    await TrackPlayer.add(tracksFromQueue);
    await TrackPlayer.skip(trackProgress.track, trackProgress.position);
  } catch (error) {
    console.log(error);
  }
};

const MusicPlayer = () => {
  const playBackState = usePlaybackState();
  const progress = useProgress();
  const repeatMode = useSelector(state => state.player.repeatMode);
  const shuffleMode = useSelector(state => state.player.shuffleMode);
  const trackTitle = useSelector(state => state.player.trackTitle);
  const trackArtist = useSelector(state => state.player.trackArtist);
  const trackArtwork = useSelector(state => state.player.trackArtwork);
  const bottomSheetIndex = useSelector(state => state.player.bottomSheetIndex);
  const queue = useSelector(state => state.player.queue);
  const currentTrackPlaying = useSelector(state => state.player.currentTrack);
  const trackProgress = useSelector(state => state.player.trackProgress);

  const dispatch = useDispatch();

  useEffect(() => {
    setupPlayer(queue, trackProgress);
    getCurrentTrack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useTrackPlayerEvents(
    [
      Event.PlaybackTrackChanged,
      Event.PlaybackError,
      Event.PlaybackQueueEnded,
      Event.PlaybackProgressUpdated,
    ],
    async event => {
      if (
        event.type === Event.PlaybackTrackChanged &&
        event.nextTrack !== undefined
      ) {
        try {
          const track = await TrackPlayer.getTrack(event.nextTrack);
          const {title, artwork, artist} = track;
          getQueue();
          getCurrentTrack();
          dispatch(setTrackTitle(title));
          dispatch(setTrackArtist(artist));
          dispatch(setTrackArtwork(artwork));
        } catch (error) {
          console.log(error);
        }
      }
      if (event.type === Event.PlaybackError) {
        console.warn('An error occuered while playing the current track');
      }
      if (event.type === Event.PlaybackQueueEnded) {
        TrackPlayer.reset();
        dispatch(resetState());
      }
      if (event.type === Event.PlaybackProgressUpdated) {
        dispatch(setTrackProgress(event));
      }
    },
  );

  const repeatIcon = () => {
    if (repeatMode === 'off') {
      return 'repeat-off';
    }

    if (repeatMode === 'track') {
      return 'repeat-once';
    }

    if (repeatMode === 'repeat') {
      return 'repeat';
    }
  };

  const changeShuffleMode = () => {
    if (shuffleMode === 'off') {
      dispatch(setShuffleMode('on'));
    }
    if (shuffleMode === 'on') {
      dispatch(setShuffleMode('off'));
    }
  };

  const changeRepeatMode = () => {
    if (repeatMode === 'off') {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      dispatch(setRepeatMode('track'));
    }

    if (repeatMode === 'track') {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      dispatch(setRepeatMode('repeat'));
    }

    if (repeatMode === 'repeat') {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      dispatch(setRepeatMode('off'));
    }
  };

  const getQueue = async () => {
    try {
      const currentQueue = await TrackPlayer.getQueue();
      dispatch(setQueue(currentQueue));
    } catch (error) {
      console.log(error);
    }
  };
  const getCurrentTrack = async () => {
    try {
      const currentTrack = await TrackPlayer.getCurrentTrack();
      const trackInfo = await TrackPlayer.getTrack(currentTrack);
      const {title, artwork, artist} = trackInfo;
      if (trackInfo !== null) {
        dispatch(setTrackTitle(title));
        dispatch(setTrackArtist(artist));
        dispatch(setTrackArtwork(artwork));
        dispatch(setCurrentTrack(currentTrack));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {bottomSheetIndex === 1 ? (
        <View style={styles.mainContainer}>
          <TouchableOpacity
            style={styles.chevronDown}
            onPress={() => dispatch(setBottomSheetIndex(0))}>
            <Ionicons name="chevron-down" color="#fff" size={30} />
          </TouchableOpacity>
          <View style={[styles.imageWrapper, styles.elevation]}>
            <Image source={{uri: trackArtwork}} style={styles.musicImage} />
          </View>

          <View style={styles.songInfo}>
            <Text style={[styles.songContent, styles.songTitle]}>
              {trackTitle}
            </Text>
            <Text style={[styles.songContent, styles.songArtist]}>
              {trackArtist}
            </Text>
          </View>

          <View>
            <Slider
              style={styles.progressBar}
              value={progress.position}
              minimumValue={0}
              maximumValue={progress.duration}
              thumbTintColor="#FFD369"
              minimumTrackTintColor="#FFD369"
              maximumTrackTintColor="#fff"
              onSlidingComplete={async value => {
                await TrackPlayer.seekTo(value);
              }}
              thumbStyle={styles.thumbStyle}
              trackStyle={styles.trackStyle}
              allowTouchTrack={true}
            />

            <View style={styles.progressLevelDuraiton}>
              <Text style={styles.progressLabelText}>
                {new Date(progress.position * 1000)
                  .toLocaleTimeString('it-IT')
                  .substring(3)}
              </Text>
              <Text style={styles.progressLabelText}>
                {new Date((progress.duration - progress.position) * 1000)
                  .toLocaleTimeString('it-IT')
                  .substring(3)}
              </Text>
            </View>
          </View>

          <View style={styles.musicControlsContainer}>
            <TouchableOpacity
              onPress={async () => {
                try {
                  const upcomingQueue = queue.slice(currentTrackPlaying + 1);
                  await upcomingQueue.forEach(track =>
                    TrackPlayer.remove(currentTrackPlaying + 1),
                  );
                  changeShuffleMode();
                  TrackPlayer.add(_.shuffle(upcomingQueue));
                  getQueue();
                  TrackPlayer.play();
                } catch (error) {
                  console.log(error);
                }
              }}>
              <MaterialCommunityIcons
                name={'shuffle-variant'}
                size={30}
                color={shuffleMode !== 'off' ? '#FFD369' : '#888888'}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => TrackPlayer.skipToPrevious()}>
              <Ionicons
                name="play-skip-back-outline"
                size={35}
                color="#FFD369"
              />
            </TouchableOpacity>
            {playBackState === State.Buffering ||
            playBackState === State.Connecting ? (
              <ActivityIndicator color="#FFD369" size={79} />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  togglePlayBack(playBackState);
                }}>
                <Ionicons
                  name={
                    playBackState === State.Playing
                      ? 'ios-pause-circle'
                      : 'ios-play-circle'
                  }
                  size={75}
                  color="#FFD369"
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => TrackPlayer.skipToNext()}>
              <Ionicons
                name="play-skip-forward-outline"
                size={35}
                color="#FFD369"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={changeRepeatMode}>
              <MaterialCommunityIcons
                name={`${repeatIcon()}`}
                size={30}
                color={repeatMode !== 'off' ? '#FFD369' : '#888888'}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.smallPlayerContainer}>
          <Image source={{uri: trackArtwork}} style={styles.smallPlayerImage} />
          <View style={styles.container}>
            <View style={styles.smallPlayerInfo}>
              <View style={styles.smallPlayerText}>
                <TextTicker
                  animationType={'scroll'}
                  scrollSpeed={100}
                  style={styles.smallPlayerTextColor}>
                  {trackTitle}
                </TextTicker>
                <Text style={styles.smallPlayerTextColor}>{trackArtist}</Text>
              </View>
              <View style={styles.smallPlayerControl}>
                {playBackState === State.Buffering ||
                playBackState === State.Connecting ? (
                  <ActivityIndicator color="#FFD369" size={30} />
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      togglePlayBack(playBackState);
                    }}>
                    <Ionicons
                      name={
                        playBackState === State.Playing
                          ? 'pause-sharp'
                          : 'play-sharp'
                      }
                      color="#FFD369"
                      size={30}
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => TrackPlayer.skipToNext()}>
                  <Ionicons
                    name={'play-skip-forward-sharp'}
                    color="#FFD369"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Slider
              style={styles.smallSliderStyle}
              value={progress.position}
              minimumValue={0}
              maximumValue={progress.duration}
              thumbTintColor="#FFD369"
              minimumTrackTintColor="#FFD369"
              maximumTrackTintColor="#fff"
              thumbStyle={styles.smallThumbStyle}
              trackStyle={styles.smallTrackStyle}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MusicPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121A1D',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    width: 300,
    height: 340,
    marginBottom: 25,
  },
  musicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  elevation: {
    elevation: 5,

    shadowColor: '#ccc',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  songContent: {
    textAlign: 'center',
    color: '#EEEEEE',
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  songArtist: {
    fontSize: 16,
    fontWeight: '300',
  },

  progressBar: {
    width: 350,
    height: 40,
    marginTop: 20,
  },
  progressLevelDuraiton: {
    width: 340,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    color: '#FFF',
  },

  musicControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    width: '80%',
  },
  thumbStyle: {
    height: 10,
    width: 10,
  },
  trackStyle: {
    height: 1,
  },
  songInfo: {
    width: '80%',
    height: '10%',
  },
  smallPlayerContainer: {
    flexDirection: 'row',
    backgroundColor: '#121A1D',
  },
  smallPlayerImage: {
    width: 112,
    height: 63,
  },
  smallPlayerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  smallPlayerControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  smallPlayerText: {
    width: '70%',
    paddingLeft: 10,
  },
  smallSliderStyle: {
    width: '100%',
    height: -1,
  },
  smallThumbStyle: {
    height: 1,
    width: 1,
  },
  smallTrackStyle: {
    height: 2,
  },
  chevronDown: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  smallPlayerTextColor: {
    color: '#B8BBBC',
  },
});
