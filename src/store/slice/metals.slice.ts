import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../services/api/apiClient';
import endpoints from '../../constants/api/endpoints';
import { createMMKV } from 'react-native-mmkv';
import NetInfo from '@react-native-community/netinfo';

export type MetalType = 'gold' | 'silver' | 'platinum' | 'palladium';

export type MetalDetails = {
  previousClose: number;
} | null;

export type MetalState = {
  price: number | null;
  status: 'idle' | 'loading' | 'success' | 'failed';
  timestamp: string | null;
  error: string | null;
  details: MetalDetails;
  detailsStatus: 'idle' | 'loading' | 'success' | 'failed';
  detailsError: string | null;
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
  const cachedDetailsStr = storage.getString(`metal_details_${metal}`);
  let cachedDetails = null;
  if (cachedDetailsStr) {
    try {
      cachedDetails = JSON.parse(cachedDetailsStr);
    } catch {
      // ignore
    }
  }
  return {
    price: cachedPrice !== undefined ? cachedPrice : null,
    status: cachedPrice !== undefined ? 'success' : 'idle',
    timestamp: cachedTimestamp || null,
    error: null,
    details: cachedDetails,
    detailsStatus: cachedDetails !== null ? 'success' : 'idle',
    detailsError: null,
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

    if (data?.status === 'failure' || data?.error_code === 1203) {
      return rejectWithValue('Your free transactions limit has ended here');
    }

    const price = data?.metals?.[metal];
    const timestamp = data?.timestamps?.metal;

    if (price === undefined || price === null) {
      return rejectWithValue(`Price for ${metal} was not found.`);
    }

    return { metal, price, timestamp };
  } catch (e: any) {
    const msg = e?.message || '';
    if (msg.includes('quota') || msg.includes('limit') || msg.includes('exceeded') || msg.includes('1203')) {
      return rejectWithValue('Your free transactions limit has ended here');
    }
    return rejectWithValue(
      msg || `Failed to fetch ${metal} price`,
    );
  }
});

export const getMetalDetails = createAsyncThunk<
  { metal: MetalType; price: number; details: NonNullable<MetalDetails>; timestamp: string },
  MetalType,
  { rejectValue: string }
>('fetch/metalDetails', async (metal, { rejectWithValue, signal }) => {
  try {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return rejectWithValue('No internet available to fetch fresh');
    }

    const response = await apiClient.get('/metal/spot', {
      params: { metal },
      signal,
    });
    const data = response?.data;

    if (data?.status === 'failure' || data?.error_code === 1203) {
      return rejectWithValue('Your free transactions limit has ended here');
    }

    if (data?.status !== 'success' || !data?.rate) {
      return rejectWithValue(data?.error_message || `Failed to fetch details for ${metal}`);
    }

    const rate = data.rate;
    const TOZ_TO_G = 31.1034768;
    const price = rate.price / TOZ_TO_G;
    const details = {
      previousClose: (rate.price - rate.change) / TOZ_TO_G,
    };

    return { metal, price, details, timestamp: data.timestamp };
  } catch (e: any) {
    const msg = e?.message || '';
    if (msg.includes('quota') || msg.includes('limit') || msg.includes('exceeded') || msg.includes('1203')) {
      return rejectWithValue('Your free transactions limit has ended here');
    }
    return rejectWithValue(
      msg || `Failed to fetch details for ${metal}`
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
      })
      .addCase(getMetalDetails.pending, (state, action) => {
        const metal = action.meta.arg;
        state[metal].detailsStatus = 'loading';
        state[metal].detailsError = null;
      })
      .addCase(getMetalDetails.fulfilled, (state, action) => {
        const { metal, price, details, timestamp } = action.payload;
        state[metal].detailsStatus = 'success';
        state[metal].details = details;
        state[metal].price = price;
        state[metal].timestamp = timestamp;
        state[metal].detailsError = null;

        storage.set(`metal_price_${metal}`, price);
        storage.set(`metal_timestamp_${metal}`, timestamp);
        storage.set(`metal_details_${metal}`, JSON.stringify(details));
      })
      .addCase(getMetalDetails.rejected, (state, action) => {
        const metal = action.meta.arg;
        state[metal].detailsStatus = 'failed';
        state[metal].detailsError =
          (action.payload as string) ||
          action.error?.message ||
          `Failed to fetch details for ${metal}`;
      }),
});

export default metalsSlice.reducer;
