import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  FlatList,
  Dimensions,
  useWindowDimensions // Dimensions API 임포트
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const plsOnImagePath = require('../assets/img/PLS_on.png');
const plsOffImagePath = require('../assets/img/PLS_off.png');

const Home: React.FC = () => {
  const deviceData = useSelector((state: RootState) => state.device.deviceData);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? "#000000" : "#ffffff",
    flex:1
  };
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  
  const deviceArray = Object.keys(deviceData).map(key => ({
    key_rid: key,
    ...deviceData[key],
  }));

  // useWindowDimensions 훅을 사용하여 화면 크기 가져오기
  const { width, height } = useWindowDimensions();

  // 화면 너비가 높이보다 크면 가로 모드, 아니면 세로 모드
  const numColumns = width > height ? 3 : 2;
  const flatListKey = numColumns.toString();

  useEffect(() => {
    // numColumns가 변경될 때마다 imageSize를 업데이트합니다.
    const newWidth = width / numColumns - 10 * 2;
    setImageSize({ width: newWidth, height: newWidth });
  }, [numColumns]);

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, { width: imageSize.width }]}>
      <Text style={styles.deviceIdText}>Device ID : {item.id}</Text>
      <Text>Last TimeStamp: {item.time}</Text>
      <Image
        source={item.status === 'on' ? plsOnImagePath : plsOffImagePath}
        style={[styles.plsImage, { width: imageSize.width, height: imageSize.height }]}
        resizeMode= 'contain'
      />
    </View>
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
      <FlatList
        data={deviceArray}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        key={flatListKey}
        numColumns={numColumns}
        contentContainerStyle={styles.listContentContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContentContainer: {
    alignItems: 'center',
  },
  itemContainer: {
    margin: 10,
    // height 속성을 제거하여 내용물에 따라 높이가 자동으로 조정되도록 함
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  deviceIdText: {
    fontSize: 18, // 글꼴 크기
    color: '#333333', // 텍스트 색상
    fontWeight: 'bold', // 글꼴 두께
    marginBottom: 8, // 아래쪽 마진
    // textAlign: 'center', // 텍스트 정렬 (옵션)
  },
  plsImage: {
    // 이미지의 높이를 동적으로 조정하려면, 예를 들어 비율을 사용할 수 있음
    // aspectRatio: 1, // 가로 세로 비율을 1:1로 설정
  }
});

export default Home;
