import {View} from 'react-native';
import React, {useEffect} from 'react';
import {StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Button, Provider, Searchbar, MD3DarkTheme} from 'react-native-paper';

import {
  setQuery,
  setResults,
  setValue,
  getMoreResults,
  setPageToken,
  setLoadingState,
} from '../redux/slices/searchSlice';
import {setBottomSheetIndex} from '../redux/slices/playerSlice';
import ListItemComponent from './ListItemComponent';
import MenuItem from './MenuItem';

const Search = ({navigation}) => {
  useEffect(() => {
    const minimizePlayer = navigation.addListener('tabPress', e => {
      dispatch(setBottomSheetIndex(0));
    });
    return minimizePlayer;
  }, [navigation, dispatch]);
  const query = useSelector(state => state.search.query);
  const results = useSelector(state => state.search.results);
  const value = useSelector(state => state.search.value);
  const pageToken = useSelector(state => state.search.pageToken);
  const loading = useSelector(state => state.search.loading);
  const queue = useSelector(state => state.player.queue);

  const dispatch = useDispatch();

  const updateValue = newValue => {
    dispatch(setValue(newValue));
  };

  const url = process.env.REACT_APP_BASE_URL;

  const searchYT = async queryYT => {
    if (queryYT !== query) {
      try {
        dispatch(setLoadingState(true));
        dispatch(setResults([]));
        return fetch(`${url}/search?search_query=${queryYT}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(data => {
            dispatch(setResults(data.results));
            dispatch(setQuery(queryYT));
            dispatch(setPageToken(data.nextPageToken));
            dispatch(setLoadingState(false));
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const moreResults = async (queryYT, nextPageToken) => {
    try {
      dispatch(setLoadingState(true));
      return fetch(
        `${url}/search?search_query=${queryYT}&pageToken=${nextPageToken}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
        .then(response => response.json())
        .then(data => {
          dispatch(getMoreResults(data.results));
          dispatch(setPageToken(data.nextPageToken));
          dispatch(setLoadingState(false));
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Provider theme={MD3DarkTheme}>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search"
          onChangeText={updateValue}
          value={value}
          onSubmitEditing={() => searchYT(value)}
        />
        {loading === true && results.length === 0 ? (
          <ActivityIndicator
            size="large"
            color="#FFD369"
            style={styles.loading}
          />
        ) : (
          <View style={styles.scrollViewWrapper(queue.length)}>
            <ScrollView>
              {results.map(result => (
                <ListItemComponent
                  result={result}
                  key={result.etag}
                  menuItem={<MenuItem result={result} />}
                />
              ))}
              {results.length === 0 ? null : (
                <View style={styles.buttonPosition}>
                  {loading === false ? (
                    <Button
                      onPress={() => moreResults(query, pageToken)}
                      mode="outlined"
                      textColor="#FFD369"
                      icon="chevron-down"
                      contentStyle={styles.buttonDirection}
                      style={styles.button}>
                      Show More
                    </Button>
                  ) : (
                    <ActivityIndicator size="large" color="#FFD369" />
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>
    </Provider>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  buttonDirection: {
    flexDirection: 'row-reverse',
  },
  button: {
    width: '50%',
    borderColor: '#FFD369',
  },
  buttonPosition: {
    alignItems: 'center',
  },
  loading: {
    paddingTop: '50%',
  },
  scrollViewWrapper: queueLength => ({
    height: queueLength !== 0 ? '83%' : '100%',
  }),
});
