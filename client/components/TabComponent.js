import {Dimensions} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import Search from './Search';
import QueueList from './QueueList';
import BottomSheetComponent from './BottomSheetComponent';

const Tab = createMaterialTopTabNavigator();
const {width} = Dimensions.get('window');

const TabComponent = () => {
  return (
    <>
      <BottomSheetComponent />
      <Tab.Navigator tabBarPosition="bottom">
        <Tab.Screen
          name="Now Playing"
          component={QueueList}
          options={{
            tabBarStyle: {
              backgroundColor: '#222831',
              borderTopColor: '#393E46',
              borderWidth: 1,
              width: width,
              paddingVertical: 15,
            },
            tabBarActiveTintColor: '#FFD369',
            tabBarInactiveTintColor: '#fff',
            tabBarIcon: ({focused, color}) => {
              return (
                <Ionicons
                  name="musical-notes"
                  size={25}
                  color={color}
                  focused={focused}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarStyle: {
              backgroundColor: '#222831',
              borderTopColor: '#393E46',
              borderWidth: 1,
              width: width,
              paddingVertical: 15,
            },
            tabBarActiveTintColor: '#FFD369',
            tabBarInactiveTintColor: '#fff',
            tabBarIcon: ({focused, color}) => {
              return (
                <Ionicons
                  name="search"
                  size={25}
                  color={color}
                  focused={focused}
                />
              );
            },
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default TabComponent;
