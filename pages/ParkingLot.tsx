// ParkingLot.tsx
import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Text, ViewStyle, Image } from 'react-native';
import { useSelector } from 'react-redux';
import parkingSpacesData from '../data/ParkingSpaces.json';
import { RootState } from '../redux/store';

const { width: screenWidth } = Dimensions.get('window');

const ParkingLot: React.FC = () => {

  const deviceData = useSelector((state: RootState) => state.device.deviceData);

    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.parkingLotContainer}>
          {parkingSpacesData.map((space) => {
            const { id, position, width, height, rotation } = space;
            const isOccupied = deviceData[space.id] && deviceData[space.id].status === 'on';
            const spaceStyle: ViewStyle = {
              position: 'absolute',
              left: position[0],
              top: position[1],
              width: width,
              height: height,
              backgroundColor: isOccupied ? '#FF4C4C' : '#aaff00',
              transform: [{ rotate: `${rotation}deg` }],
              justifyContent: 'center', // 올바른 타입의 값 제공
              alignItems: 'center', // 올바른 타입의 값 제공
              borderWidth: 1,
              borderColor: '#000',
            };
  
            return (
              <View key={id} style={spaceStyle}>
                {/* <Image source={require('../assets/img/PLS_on.png')} style={styles.carImage} resizeMode="contain" /> */}
                <Text>{id}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: screenWidth,
    minHeight: '100%'
  },
  parkingLotContainer: {
    // 주차장 컨테이너 스타일, 필요에 따라 정의
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  container: {
      // 주차장 컨테이너의 크기와 스타일을 설정
      width: screenWidth,
      height: '100%',
      position: 'relative',
      backgroundColor: '#bfbfbf'
  },
});

export default ParkingLot;