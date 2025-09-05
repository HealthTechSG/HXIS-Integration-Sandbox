import { configureStore } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import global from '@/redux/slice/global';
import { CustomInventoryApi } from '@/services/CustomInventory/CustomInventoryService';
import { EducationApi } from '@/services/Education/EducationService';
import { PatientApi } from '@/services/Patient/PatientService';

// TODO: refactor redux to make it more organized.
export const rootReducer = combineReducers({
  global,
  [PatientApi.reducerPath]: PatientApi.reducer,
  [EducationApi.reducerPath]: EducationApi.reducer,
  [CustomInventoryApi.reducerPath]: CustomInventoryApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat<Middleware[]>([
      PatientApi.middleware,
      EducationApi.middleware,
      CustomInventoryApi.middleware,
    ]),
});

export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof store.dispatch;

export default store;
