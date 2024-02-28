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
import init from 'react_native_mqtt';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './pages/Home';
import ParkingLot from './pages/ParkingLot';
import ViewHistory from './pages/ViewHistory';
import { useDispatch } from 'react-redux';
import { setDeviceData } from './redux/deviceSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? "#000000" : "#ffffff",
  };
  const dispatch = useDispatch();

  // MQTT Ŭ���̾�Ʈ �ʱ�ȭ �� ����
  const initializeMQTT = () => {
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      reconnect: true,
      sync: {},
    });
  };

  useEffect(() => {
    initializeMQTT();

    // Ŭ���̾�Ʈ ���� �� �ɼ� ����
    const client = new Paho.MQTT.Client('ws://14.50.159.2:1884/', 'client1');

    // ���� �ν�Ʈ �� ó��
    client.onConnectionLost = (error: { errorCode: number, errorMessage: string,invocationContext:string }) => {
      if (error.errorCode !== 0) {
        console.log('onConnectionLost:' + error.errorMessage);
        if (error.errorCode ===7){
          console.log("Need Wifi or Cellular activated")
        }
        // ���⿡ �翬�� ������ �߰��� �� �ֽ��ϴ�.
      }
    };

    // �޽��� ���� �� ó��
    client.onMessageArrived = (message: {topic: string, payloadString: string }) => {
      console.log('onMessageArrived:' + message.payloadString);
      // �޽��� ó�� ������ �߰��� �� �ֽ��ϴ�.
      dispatch(setDeviceData(JSON.parse(message.payloadString)));
    };

    // MQTT ������ ����
    client.connect({ 
      onSuccess: () => {
        console.log('Connected');
        client.subscribe('rcn/plc/v1/devices/+/up');
      },
      useSSL: false,
      onFailure: (error:{errorCode:number,errorMessage:string,invocationContext:string}) => {
        console.log('Connection failed:', error.errorMessage);
        if (error.errorCode ===7){
          console.log("Need Wifi or Cellular activated")
        }
      }
    });

    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };
  }, []);

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
