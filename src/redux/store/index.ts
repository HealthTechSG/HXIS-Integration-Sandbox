import { configureStore } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import global from '@/redux/slice/global';
import tabs from '@/redux/slice/tabs';
import { AllergyIntoleranceApi } from '@/services/AllergyIntolerance/AllergyIntoleranceService';
import { AppointmentApi } from '@/services/Appointment/AppointmentService';
import { ConditionApi } from '@/services/Condition/ConditionService';
import { CustomInventoryApi } from '@/services/CustomInventory/CustomInventoryService';
import { EducationApi } from '@/services/Education/EducationService';
import { EncounterApi } from '@/services/Encounter/EncounterService';
import { FlagApi } from '@/services/Flag/FlagService';
import ListApi from '@/services/List/ListService';
import { LocationApi } from '@/services/Location/LocationService';
import { MedicationApi } from '@/services/Medication/MedicationService';
import { MedicationRequestApi } from '@/services/MedicationRequest/MedicationRequestService';
import { ObservationApi } from '@/services/Observation/ObservationService';
import { PatientApi } from '@/services/Patient/PatientService';
import { PractitionerApi } from '@/services/Practitioner/PractitionerService';
import { ProcedureApi } from '@/services/Procedure/ProcedureService';

// TODO: refactor redux to make it more organized.
export const rootReducer = combineReducers({
  global,
  tabs,
  [AllergyIntoleranceApi.reducerPath]: AllergyIntoleranceApi.reducer,
  [AppointmentApi.reducerPath]: AppointmentApi.reducer,
  [ConditionApi.reducerPath]: ConditionApi.reducer,
  [CustomInventoryApi.reducerPath]: CustomInventoryApi.reducer,
  [EducationApi.reducerPath]: EducationApi.reducer,
  [EncounterApi.reducerPath]: EncounterApi.reducer,
  [FlagApi.reducerPath]: FlagApi.reducer,
  [ListApi.reducerPath]: ListApi.reducer,
  [LocationApi.reducerPath]: LocationApi.reducer,
  [MedicationApi.reducerPath]: MedicationApi.reducer,
  [MedicationRequestApi.reducerPath]: MedicationRequestApi.reducer,
  [ObservationApi.reducerPath]: ObservationApi.reducer,
  [PatientApi.reducerPath]: PatientApi.reducer,
  [PractitionerApi.reducerPath]: PractitionerApi.reducer,
  [ProcedureApi.reducerPath]: ProcedureApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore RTK Query action types that have non-serializable payloads
          'persist/PERSIST',
          'persist/REHYDRATE',
        ],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: [
          // Ignore RTK Query cache and error states
          'api',
          // Ignore all API slices that might contain non-serializable errors
          'allergyIntoleranceApi',
          'appointmentApi',
          'conditionApi',
          'customInventoryApi',
          'educationApi',
          'encounterApi',
          'flagApi',
          'listApi',
          'locationApi',
          'medicationApi',
          'medicationRequestApi',
          'observationApi',
          'patientApi',
          'practitionerApi',
          'procedureApi',
        ],
      },
    }).concat<Middleware[]>([
      AllergyIntoleranceApi.middleware,
      AppointmentApi.middleware,
      ConditionApi.middleware,
      CustomInventoryApi.middleware,
      EducationApi.middleware,
      EncounterApi.middleware,
      FlagApi.middleware,
      ListApi.middleware,
      LocationApi.middleware,
      MedicationApi.middleware,
      MedicationRequestApi.middleware,
      ObservationApi.middleware,
      PatientApi.middleware,
      PractitionerApi.middleware,
      ProcedureApi.middleware,
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
