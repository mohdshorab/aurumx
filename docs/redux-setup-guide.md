# Redux State Management Guide

This document outlines the architecture and usage of the global Redux state management setup in the application, which is built using **Redux Toolkit** and **TypeScript**.

---

## 1. Redux Folder Structure

The Redux-related files are located in `src/store/` and `src/hooks/`:

```text
src/
├── store/
│   ├── index.ts               # Store configuration & RootState/AppDispatch exports
│   └── slice/
│       └── metals.slice.ts    # Metals state slice & async API thunk
├── hooks/
│   ├── useRedux.ts            # Typed Redux Hooks (useAppDispatch, useAppSelector)
│   └── useFetchMetals.ts      # Feature-specific hook for fetching metals data
└── App.tsx                    # Root wrapper supplying the Redux Provider
```

---

## 2. Architecture & File Breakdown

### A. Store Configuration
The store is configured in [src/store/index.ts](file:///Users/mohod.shorab/Development/Assesments/aurumx/src/store/index.ts). It registers all state reducers and exports the strict TypeScript types for state and dispatch.

```typescript
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
```

### B. Typed Hooks
To avoid repeating type annotations in components, always import typed hooks from [src/hooks/useRedux.ts](file:///Users/mohod.shorab/Development/Assesments/aurumx/src/hooks/useRedux.ts):
* `useAppDispatch()`: The dispatch function typed to handle async thunks correctly.
* `useAppSelector(...)`: State selector pre-typed with `RootState`.

### C. State Slices & Thunks
Redux Toolkit uses **slices** to bundle actions, reducers, and initial states.
For example, [src/store/slice/metals.slice.ts](file:///Users/mohod.shorab/Development/Assesments/aurumx/src/store/slice/metals.slice.ts) handles calling the API asynchronously:

1. **Thunk (`getMetals`)**: Dispatches request, handles Axios requests, extracts response data, handles API errors via response interceptors, and returns either the payload or rejects with mapped error strings.
2. **Reducers (`extraReducers`)**: Updates state fields based on the lifecycle of the thunk:
   * `pending`: Sets status to `'loading'`.
   * `fulfilled`: Saves data and sets status to `'success'`.
   * `rejected`: Stores error messages and sets status to `'failed'`.

---

## 3. How to Consume Redux State in UI Components

To access state and dispatch actions, we use a custom React hook: [src/hooks/useFetchMetals.ts](file:///Users/mohod.shorab/Development/Assesments/aurumx/src/hooks/useFetchMetals.ts).

### Example Hook Usage
```typescript
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { getMetals } from '../store/slice/metals.slice';

const useFetchMetals = () => {
  const dispatch = useAppDispatch();
  const { data: metals, status, error } = useAppSelector(state => state.metals);

  useEffect(() => {
    const promise = dispatch(getMetals());
    return () => promise.abort(); // Auto-cancel requests on unmount
  }, [dispatch]);

  return { metals, status, error };
};

export default useFetchMetals;
```

### Rendering in a Screen
Consume the hook cleanly in your screen (e.g. [src/features/dashboard/Dashboard.tsx](file:///Users/mohod.shorab/Development/Assesments/aurumx/src/features/dashboard/Dashboard.tsx)):

```tsx
import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import useFetchMetals from '../../hooks/useFetchMetals';

const Dashboard: React.FC = () => {
  const { metals, status, error } = useFetchMetals();

  if (status === 'loading') {
    return <ActivityIndicator size="large" />;
  }

  if (status === 'failed') {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View>
      <Text>Gold Price (INR): {metals?.metals?.gold}</Text>
    </View>
  );
};
```

---

## 4. How to Add a New Slice

To add a new state slice (e.g., `user` or `settings`):

1. **Create the Slice**: Create `src/store/slice/user.slice.ts` using `createSlice` or `createAsyncThunk`.
2. **Register the Reducer**: Import it in [src/store/index.ts](file:///Users/mohod.shorab/Development/Assesments/aurumx/src/store/index.ts) and add it to `reducer`:
   ```typescript
   import userReducer from './slice/user.slice';

   const store = configureStore({
     reducer: {
       metals: metalsReducer,
       user: userReducer, // Added here
     },
   });
   ```
3. **Use State**: Access the new state inside any component using `useAppSelector(state => state.user)`.
