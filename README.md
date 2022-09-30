# JukeBx (Version 1.0)
Music player app with Youtube search function.

## Built With

- [React Native](https://reactnative.dev/)
- [Redux](https://redux.js.org/)
- [Express](https://expressjs.com/)

### Components & Libraries

- [React Native Track Player](https://react-native-track-player.js.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Native Elements](https://reactnativeelements.com/)
- [React Native Async Storage](https://react-native-async-storage.github.io/async-storage/docs/install/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Bottom Sheet](https://gorhom.github.io/react-native-bottom-sheet/)
- [node-ytdl-core](https://www.npmjs.com/package/ytdl-core)

## Installation and Setup

```
$ npm i
```

### Environment Variables

Development app variables are stored in a ".env" files at in client and api folders.

```
//client
REACT_APP_BASE_URL=serverURL

//api
YOUTUBE_API_KEY=XXXXX
```

Steps on how to obtain YouTube API key is detailed at [YouTube Data API docs](https://developers.google.com/youtube/v3/getting-started)