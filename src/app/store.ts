import { configureStore } from '@reduxjs/toolkit';
import appReducer from './features/app/appSlice';
import vehiclesReducer from './features/vehicles/vehiclesSlice';
import customersReducer from './features/customers/customersSlice';
import rentalsReducer from './features/rentals/rentalsSlice';
import reservationsReducer from './features/reservations/reservationsSlice';
import maintenanceReducer from './features/maintenance/maintenanceSlice';
import activitiesReducer from './features/activities/activitiesSlice';
import { loadState, saveState } from './services/localStorageService';
import throttle from 'lodash.throttle';

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    app: appReducer,
    vehicles: vehiclesReducer,
    customers: customersReducer,
    rentals: rentalsReducer,
    reservations: reservationsReducer,
    maintenance: maintenanceReducer,
    activities: activitiesReducer,
  },
  preloadedState, // Store'un başlangıç durumunu localStorage'dan yükle
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// State'teki her değişiklikte localStorage'a kaydet.
// throttle, fonksiyonun çok sık çağrılmasını engeller (örneğin saniyede bir kez).
store.subscribe(throttle(() => {
  saveState(store.getState());
}, 1000));


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;