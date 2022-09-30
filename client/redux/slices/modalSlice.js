import {createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    visible: false,
    data: null,
    playlists: [],
    selectedPlaylists: [],
    editPlaylist: null,
  },
  reducers: {
    setModalVisibility: (state, action) => {
      state.visible = action.payload;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
    setPlaylists: (state, action) => {
      state.playlists = action.payload;
    },
    setEditPlaylist: (state, action) => {
      state.editPlaylist = action.payload;
    },
    addSelectedPlaylist: (state, action) => {
      state.selectedPlaylists = [...state.selectedPlaylists, action.payload];
    },
    removeSelectedPlaylist: (state, action) => {
      state.selectedPlaylists = _.difference(state.selectedPlaylists, [
        action.payload,
      ]);
    },
    onDismiss: state => {
      state.visible = false;
      state.data = null;
      state.selectedPlaylists = [];
      state.editPlaylist = null;
    },
  },
});

export const {
  setModalVisibility,
  setData,
  setPlaylists,
  setEditPlaylist,
  addSelectedPlaylist,
  removeSelectedPlaylist,
  onDismiss,
} = modalSlice.actions;
export default modalSlice.reducer;
