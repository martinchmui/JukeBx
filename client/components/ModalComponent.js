import {StyleSheet} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Modal, Portal} from 'react-native-paper';
import {Routes, Route} from 'react-router-dom';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {onDismiss, setPlaylists} from '../redux/slices/modalSlice';
import EditPlaylist from './ModalRoutes/EditPlaylist';
import AddToPlaylist from './ModalRoutes/AddToPlaylist';
import NewPlaylist from './ModalRoutes/NewPlaylist';
import DeletePlaylist from './ModalRoutes/DeletePlaylist';

const ModalComponent = () => {
  const visible = useSelector(state => state.modal.visible);
  const dispatch = useDispatch();
  const getPlaylists = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('playlists');
      const jsonData = JSON.parse(data);
      dispatch(setPlaylists(jsonData));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    getPlaylists();
  }, [getPlaylists]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => dispatch(onDismiss())}
        contentContainerStyle={styles.containerStyle}
        style={styles.modalBackground}>
        <Routes>
          <Route path="/" element={<AddToPlaylist />} />
          <Route path="/edit" element={<EditPlaylist />} />
          <Route path="/new" element={<NewPlaylist />} />
          <Route path="/delete" element={<DeletePlaylist />} />
        </Routes>
      </Modal>
    </Portal>
  );
};

export default ModalComponent;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    color: 'white',
  },
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginTop: 0,
    marginBottom: 0,
  },
});
