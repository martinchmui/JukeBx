import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {List} from 'react-native-paper';

const ListItemComponent = ({result, menuItem}) => {
  const secondsToTime = seconds => {
    const h = Math.floor(seconds / 3600).toString(),
      m = Math.floor((seconds % 3600) / 60).toString(),
      s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0');
    if (seconds < 3600) {
      return m + ':' + s;
    } else {
      const mPad = m.padStart(2, '0');
      return h + ':' + mPad + ':' + s;
    }
  };

  return (
    <List.Item
      title={result.title}
      description={result.channelTitle}
      titleStyle={styles.title}
      descriptionStyle={styles.description}
      left={() => (
        <Image
          source={{uri: result.thumbnails.default.url}}
          style={styles.avatarImage}
        />
      )}
      right={() => {
        return (
          <View style={styles.listItemRight}>
            {menuItem}
            <Text style={styles.durationText}>
              {secondsToTime(result.duration)}
            </Text>
          </View>
        );
      }}
    />
  );
};

export default ListItemComponent;

const styles = StyleSheet.create({
  title: {
    color: '#fff',
  },
  description: {
    color: '#FFD369',
  },
  avatarImage: {
    width: 64,
    height: 64,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '20%',
  },
  durationText: {
    color: '#B8BBBC',
  },
});
