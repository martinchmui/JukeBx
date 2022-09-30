import {createSlice} from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    value: '',
    query: '',
    results: [],
    pageToken: '',
    loading: false,
    snackbar: false,
  },
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    getMoreResults: (state, action) => {
      state.results = [...state.results, ...action.payload];
    },
    setPageToken: (state, action) => {
      state.pageToken = action.payload;
    },
    setLoadingState: (state, action) => {
      state.loading = action.payload;
    },
    setSnackBarState: (state, action) => {
      state.snackbar = action.payload;
    },
  },
});

export const {
  setQuery,
  setResults,
  setPageToken,
  setValue,
  getMoreResults,
  setLoadingState,
  setSnackBarState,
} = searchSlice.actions;
export default searchSlice.reducer;
