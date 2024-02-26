// ParkingLot.tsx
import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Text, ViewStyle, Image, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import parkingSpacesData from '../data/ParkingSpaces.json';
import { RootState } from '../redux/store';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ParkingLot: React.FC = () => {
  const [contentWidth, setContentWidth] = React.useState(screenWidth); // 초기값은 스크린 너비
  const [contentHeight, setContentHeight] = React.useState(screenHeight);

  React.useEffect(() => {
    let maxRight = 0;
    let maxBottom = 0; // 최대 하단 위치 계산을 위한 변수 추가
    parkingSpacesData.forEach(space => {
      const rightEdge = space.position[0] + space.width;
      const bottomEdge = space.position[1] + space.height; // 하단 가장자리 위치 계산
      if (rightEdge > maxRight) {
        maxRight = rightEdge;
      }
      if (bottomEdge > maxBottom) { // 최대 하단 위치 업데이트
        maxBottom = bottomEdge;
      }
    });
    setContentWidth(maxRight + 50); // 여백 추가
    setContentHeight(maxBottom + 50); // 여백 추가하여 상태 업데이트
  }, []);
  const deviceData = useSelector((state: RootState) => state.device.deviceData);

    return (
      <SafeAreaView style={styles.SafeAreaView}>
        <ScrollView horizontal={true}>
          <ScrollView   contentContainerStyle={[styles.contentContainer, { minWidth: contentWidth, minHeight: contentHeight}]} >
            <View style={styles.parkingLotContainer}>
              {parkingSpacesData.map((space) => {
                const { id, position, width, height, rotation } = space;
                const isCarOn = deviceData[space.id] && deviceData[space.id].status === 'on';
                const isPowerOn = deviceData[space.id] && deviceData[space.id].power === 'on';
                const spaceStyle: ViewStyle = {
                  position: 'absolute',
                  left: position[0],
                  top: position[1],
                  width: width,
                  height: height,
                  backgroundColor: isCarOn ? (isPowerOn ? '#FF4C4C' : '#8a2929') : (isPowerOn ? '#aaff00' : '#5c8a01'),
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
        </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SafeAreaView: {
    flex:1
  },
  contentContainer: {
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