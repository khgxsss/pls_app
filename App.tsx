import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client, Message, IClientOptions } from 'react-native-paho-mqtt';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './pages/Home';
import ParkingLot from './pages/ParkingLot';
import ViewHistory from './pages/ViewHistory';
import { useDispatch } from 'react-redux';
import { setDeviceData } from './redux/deviceSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

// AsyncStorage 기반 스토리지 클래스 구현
class Storage {
  static setItem(key: string, item: string): Promise<void> {
    return AsyncStorage.setItem(key, item);
  }

  static getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }

  static removeItem(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  }
}

const App: React.FC = () => {

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? "#000000" : "#ffffff",
  };
  const dispatch = useDispatch();

  useEffect(() => {
    const options: IClientOptions = {
      uri: 'ws://14.50.159.2:1884/',
      clientId: 'client1',
      storage: new Storage(), // AsyncStorage 기반 스토리지 사용
    };
    const client = new Client(options);

    client.on('connectionLost', (responseObject: object) => {
      if ((responseObject as any).errorCode !== 0) {
        console.log('onConnectionLost:' + (responseObject as any).errorMessage);
      }
    });

    client.on('messageReceived', (message: Message) => {
      // console.log('onMessageArrived:' + message.payloadString);
      const data = JSON.parse(message.payloadString);
      // deviceData 상태 업데이트
      dispatch(setDeviceData(data));
    });

    client.connect()
      .then(() => {
        console.log('Connected');
        return client.subscribe(`rcn/plc/v1/devices/+/up`);
      })
      .catch((error: any) => console.log(error));

    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Device" component={Home} options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),
          }}/>
        <Tab.Screen name="Parking Lot" component={ParkingLot} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-parking" color={color} size={size} />
          ),
        }}/>
        <Tab.Screen name="View History" component={ViewHistory} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" color={color} size={size} />
          ),
        }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
