import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../services/api/apiClient';
import endpoints from '../../constants/api/endpoints';
import { createMMKV } from 'react-native-mmkv';
import NetInfo from '@react-native-community/netinfo';

export type MetalType = 'gold' | 'silver' | 'platinum' | 'palladium';

export type MetalState = {
  price: number | null;
  status: 'idle' | 'loading' | 'success' | 'failed';
  timestamp: string | null;
  error: string | null;
};

type InitialState = {
  gold: MetalState;
  silver: MetalState;
  platinum: MetalState;
  palladium: MetalState;
};

export const storage = createMMKV();

const getInitialMetalState = (metal: MetalType): MetalState => {
  const cachedPrice = storage.getNumber(`metal_price_${metal}`);
  const cachedTimestamp = storage.getString(`metal_timestamp_${metal}`);
  return {
    price: cachedPrice !== undefined ? cachedPrice : null,
    status: cachedPrice !== undefined ? 'success' : 'idle',
    timestamp: cachedTimestamp || null,
    error: null,
  };
};

const initialState: InitialState = {
  gold: getInitialMetalState('gold'),
  silver: getInitialMetalState('silver'),
  platinum: getInitialMetalState('platinum'),
  palladium: getInitialMetalState('palladium'),
};

export const getMetalPrice = createAsyncThunk<
  { metal: MetalType; price: number; timestamp: string },
  MetalType,
  { rejectValue: string }
>('fetch/metalPrice', async (metal, { rejectWithValue, signal }) => {
  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return rejectWithValue('No internet available to fetch fresh');
    }

    const response = await apiClient.get(`${endpoints.latest}`, {
      signal,
    });
    const data = response?.data;
    const price = data?.metals?.[metal];
    const timestamp = data?.timestamps?.metal;

    if (price === undefined || price === null) {
      return rejectWithValue(`Price for ${metal} was not found.`);
    }

    return { metal, price, timestamp };
  } catch (e: any) {
    return rejectWithValue(
      e?.message || `Failed to fetch ${metal} price`,
    );
  }
});

const metalsSlice = createSlice({
  name: 'slice/metals',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(getMetalPrice.pending, (state, action) => {
        const metal = action.meta.arg;
        state[metal].status = 'loading';
        state[metal].error = null;
      })
      .addCase(getMetalPrice.fulfilled, (state, action) => {
        const { metal, price, timestamp } = action.payload;
        state[metal].status = 'success';
        state[metal].price = price;
        state[metal].timestamp = timestamp;
        state[metal].error = null;

        storage.set(`metal_price_${metal}`, price);
        storage.set(`metal_timestamp_${metal}`, timestamp);
      })
      .addCase(getMetalPrice.rejected, (state, action) => {
        const metal = action.meta.arg;
        state[metal].status = 'failed';
        state[metal].error =
          (action.payload as string) ||
          action.error?.message ||
          `Failed to fetch ${metal} price`;
      }),
});

export default metalsSlice.reducer;
