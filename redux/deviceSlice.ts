import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DeviceState {
  deviceData: { [key: string]: any };
}

const initialState: DeviceState = {
  deviceData: {},
};

export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setDeviceData: (state, action: PayloadAction<{ [key: string]: any }>) => {
      state.deviceData = action.payload;
    },
  },
});

export const { setDeviceData } = deviceSlice.actions;

export default deviceSlice.reducer;
