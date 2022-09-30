import {View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Menu} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import {v4 as uuidv4} from 'uuid';
import {useNavigate} from 'react-router-native';

import {setSnackBarState} from '../redux/slices/searchSlice';
import {setQueue} from '../redux/slices/playerSlice';
import {setModalVisibility, setData} from '../redux/slices/modalSlice';

const MenuItem = ({result}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({x: 0, y: 0});

  const onIconPress = event => {
    const {nativeEvent} = event;
    const anchor = {
      x: nativeEvent.pageX - 5,
      y: nativeEvent.pageY - 100,
    };

    setMenuAnchor(anchor);
    openMenu();
  };

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

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
    <View>
      <TouchableOpacity onPress={onIconPress}>
        <Ionicons
          name="ellipsis-vertical"
          size={35}
          color={visible === false ? '#fff' : '#FFD369'}
        />
      </TouchableOpacity>
      <Menu visible={visible} onDismiss={closeMenu} anchor={menuAnchor}>
        <Menu.Item
          onPress={() => {
            const track = {
              duration: Number(result.duration),
              id: uuidv4(),
              title: result.title,
              artist: result.channelTitle,
              artwork: result.thumbnails.high.url,
              url: `${url}/youtube?id=${result.videoId}`,
              jsonData: result,
            };
            dispatch(setSnackBarState(true));
            TrackPlayer.add(track);
            getQueue();
            TrackPlayer.play();
            closeMenu();
          }}
          leadingIcon="format-list-bulleted"
          title="Add to Queue"
        />
        <Menu.Item
          onPress={() => {
            dispatch(setData(result));
            dispatch(setModalVisibility(true));
            navigate('/');
            closeMenu();
          }}
          leadingIcon="plus"
          title="Add to Playlist"
        />
      </Menu>
    </View>
  );
};

export default MenuItem;
