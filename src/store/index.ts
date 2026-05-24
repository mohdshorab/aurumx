import { configureStore } from '@reduxjs/toolkit';
import metalsReducer from './slice/metals.slice';

const store = configureStore({
  reducer: {
    metals: metalsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
