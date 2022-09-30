import {createSlice} from '@reduxjs/toolkit';

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    repeatMode: 'off',
    trackTitle: '',
    trackArtist: '',
    trackArtwork: 'http://clipart-library.com/images/6cr6xX8Ei.png',
    queue: [],
    bottomSheetIndex: 0,
    currentTrack: null,
    trackProgress: null,
    shuffleMode: 'off',
  },
  reducers: {
    setRepeatMode: (state, action) => {
      state.repeatMode = action.payload;
    },
    setShuffleMode: (state, action) => {
      state.shuffleMode = action.payload;
    },
    setTrackTitle: (state, action) => {
      state.trackTitle = action.payload;
    },
    setTrackArtist: (state, action) => {
      state.trackArtist = action.payload;
    },
    setTrackArtwork: (state, action) => {
      state.trackArtwork = action.payload;
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
    },
    setBottomSheetIndex: (state, action) => {
      state.bottomSheetIndex = action.payload;
    },
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
    },
    setTrackProgress: (state, action) => {
      state.trackProgress = action.payload;
    },
    resetState: state => {
      state.trackTitle = '';
      state.trackArtist = '';
      state.trackArtwork = 'http://clipart-library.com/images/6cr6xX8Ei.png';
      state.queue = [];
      state.currentTrack = null;
      state.trackProgress = null;
    },
  },
});

export const {
  setRepeatMode,
  setShuffleMode,
  setTrackTitle,
  setTrackArtist,
  setTrackArtwork,
  setQueue,
  setBottomSheetIndex,
  setBottomSheetSnapPoint,
  setCurrentTrack,
  resetState,
  setTrackProgress,
} = playerSlice.actions;
export default playerSlice.reducer;
