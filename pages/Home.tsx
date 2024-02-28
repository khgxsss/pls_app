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
  useWindowDimensions // Dimensions API ����Ʈ
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

  // useWindowDimensions ���� ����Ͽ� ȭ�� ũ�� ��������
  const { width, height } = useWindowDimensions();

  // ȭ�� �ʺ� ���̺��� ũ�� ���� ���, �ƴϸ� ���� ���
  const numColumns = width > height ? 3 : 2;
  const flatListKey = numColumns.toString();

  useEffect(() => {
    // numColumns�� ����� ������ imageSize�� ������Ʈ�մϴ�.
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
    // height �Ӽ��� �����Ͽ� ���빰�� ���� ���̰� �ڵ����� �����ǵ��� ��
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  deviceIdText: {
    fontSize: 18, // �۲� ũ��
    color: '#333333', // �ؽ�Ʈ ����
    fontWeight: 'bold', // �۲� �β�
    marginBottom: 8, // �Ʒ��� ����
    // textAlign: 'center', // �ؽ�Ʈ ���� (�ɼ�)
  },
  plsImage: {
    // �̹����� ���̸� �������� �����Ϸ���, ���� ��� ������ ����� �� ����
    // aspectRatio: 1, // ���� ���� ������ 1:1�� ����
  }
});

export default Home;
