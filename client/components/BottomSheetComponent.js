import React, {useCallback, useMemo, useRef} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {View, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {setBottomSheetIndex} from '../redux/slices/playerSlice';
import MusicPlayer from './MusicPlayer';

const BottomSheetComponent = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['9.5%', '100%'], []);
  const bottomSheetIndex = useSelector(state => state.player.bottomSheetIndex);
  const queue = useSelector(state => state.player.queue);

  const dispatch = useDispatch();

  const handleSheetChanges = useCallback(
    index => {
      dispatch(setBottomSheetIndex(index));
    },
    [dispatch],
  );

  const BottomSheetBackground = ({style}) => {
    return <View style={[{...styles.backgroundComponent}, {...style}]} />;
  };

  return (
    <View style={styles.container(queue.length)} pointerEvents="box-none">
      <BottomSheet
        ref={bottomSheetRef}
        index={bottomSheetIndex}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundComponent={BottomSheetBackground}
        handleIndicatorStyle={styles.displayNone}
        handleStyle={styles.displayNone}>
        <MusicPlayer />
      </BottomSheet>
    </View>
  );
};
const styles = StyleSheet.create({
  container: queueLength => ({
    flex: 1,
    padding: 24,
    zIndex: queueLength !== 0 ? 1 : 0,
    position: 'absolute',
    left: 0,
    top: 0,
    height: '87%',
    width: '100%',
  }),
  backgroundComponent: {
    backgroundColor: '#121A1D',
    borderRadius: 0,
  },
  displayNone: {
    display: 'none',
  },
});
export default BottomSheetComponent;
