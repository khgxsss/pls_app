import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Button, StyleSheet, View, Modal, Dimensions, FlatList } from 'react-native';
import axios from 'axios';
import DatePicker from 'react-native-date-picker';
import { LineChart } from 'react-native-chart-kit';
import { ChartConfig } from 'react-native-chart-kit/dist/HelperTypes';

interface Record {
  timestamp: string;
  device_status: 'on' | 'off';
}

const ViewHistory: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [deviceId, setDeviceId] = useState<string>('a6');
  const [userId, setUserId] = useState<string>('testuser1');
  const [table, setTable] = useState<string>('devices_all');
  const [records, setRecords] = useState<Record[]>([]);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const fetchRecords = async () => {
    try {
      const response = await axios.get('http://14.50.159.2:19999/dbcall', {
        params: {
          table: table,
          period: `${startDate.toISOString().split('T')[0]}to${endDate.toISOString().split('T')[0]}`,
          device_id: deviceId,
          user_id: userId,
        },
      });
      setRecords(response.data);
      setModalVisible(true); // Show the modal
    } catch (error) {
      console.error(error);
    }
  };

  const chartConfig: ChartConfig = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>View Device History</Text>
      
      <Text style={styles.label}>Start Date:</Text>
      <DatePicker date={startDate} onDateChange={setStartDate} mode="date" />
      
      <Text style={styles.label}>End Date:</Text>
      <DatePicker date={endDate} onDateChange={setEndDate} mode="date"/>
      
      <Text style={styles.label}>Device ID:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setDeviceId}
        value={deviceId}
        placeholder="Enter Device ID"
      />
      
      <Text style={styles.label}>User ID:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUserId}
        value={userId}
        placeholder="Enter User ID"
      />
      
      <Text style={styles.label}>Table:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setTable}
        value={table}
        placeholder="devices or devices_all"
      />
      
      <Button title="Fetch History" onPress={fetchRecords} />
      <Modal visible={isModalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Device Usage History</Text>
          <FlatList style={styles.flatlist}
            data={records}
            keyExtractor={(item, index) => `record-${index}`}
            renderItem={({ item }) => (
              <View style={styles.recordRow}>
                <Text style={styles.recordCell}>{item.device_id}</Text>
                <Text style={styles.recordCell}>{item.user_id}</Text>
                <Text style={styles.recordCell}>{item.last_updated}</Text>
                <Text style={styles.recordCell}>{item.device_status.toUpperCase()}</Text>
              </View>
            )}
          />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 30,
    paddingBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
  },
  modalContent: {
    flex: 1,
    paddingTop: 20,
  },
  flatlist : {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  recordRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recordCell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default ViewHistory;
