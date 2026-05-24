import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../services/api/apiClient';
import endpoints from '../../constants/api/endpoints';
import MetalsResponse from '../../types/metals.types';

type InitialState = {
  data: MetalsResponse | null;
  status: 'loading' | 'idle' | 'failed' | 'success';
  error: string | null;
};

const initialState: InitialState = {
  data: null,
  status: 'idle',
  error: null,
};

export const getMetals = createAsyncThunk<
  MetalsResponse,
  void,
  { rejectValue: string }
>('fetch/metals', async (_, { rejectWithValue, signal }) => {
  try {
    const response = await apiClient.get(`${endpoints.latest}`, {
      signal,
    });
    return response?.data as MetalsResponse;
  } catch (e: any) {
    return rejectWithValue(
      e?.message || `Something went wrong while fetching the metals.`,
    );
  }
});

const metalsSlice = createSlice({
  name: 'slice/metals',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(getMetals.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getMetals.fulfilled, (state, action) => {
        state.status = 'success';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getMetals.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string) ||
          action.error?.message ||
          'Failed to fetch metals';
      }),
});

export default metalsSlice.reducer;
