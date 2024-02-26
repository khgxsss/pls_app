// ParkingLot.tsx
import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Text, ViewStyle, Image, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import parkingSpacesData from '../data/ParkingSpaces.json';
import { RootState } from '../redux/store';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ParkingLot: React.FC = () => {
  const [contentWidth, setContentWidth] = React.useState(screenWidth); // �ʱⰪ�� ��ũ�� �ʺ�
  const [contentHeight, setContentHeight] = React.useState(screenHeight);

  React.useEffect(() => {
    let maxRight = 0;
    let maxBottom = 0; // �ִ� �ϴ� ��ġ ����� ���� ���� �߰�
    parkingSpacesData.forEach(space => {
      const rightEdge = space.position[0] + space.width;
      const bottomEdge = space.position[1] + space.height; // �ϴ� �����ڸ� ��ġ ���
      if (rightEdge > maxRight) {
        maxRight = rightEdge;
      }
      if (bottomEdge > maxBottom) { // �ִ� �ϴ� ��ġ ������Ʈ
        maxBottom = bottomEdge;
      }
    });
    setContentWidth(maxRight + 50); // ���� �߰�
    setContentHeight(maxBottom + 50); // ���� �߰��Ͽ� ���� ������Ʈ
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
                  justifyContent: 'center', // �ùٸ� Ÿ���� �� ����
                  alignItems: 'center', // �ùٸ� Ÿ���� �� ����
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
    // ������ �����̳� ��Ÿ��, �ʿ信 ���� ����
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  container: {
      // ������ �����̳��� ũ��� ��Ÿ���� ����
      width: screenWidth,
      height: '100%',
      position: 'relative',
      backgroundColor: '#bfbfbf'
  },
});

export default ParkingLot;