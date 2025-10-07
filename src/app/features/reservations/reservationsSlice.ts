import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Reservation } from '../../types';
import { reservationsData } from '../../data/reservations';

interface ReservationsState {
  reservations: Reservation[];
}

const initialState: ReservationsState = {
  reservations: reservationsData,
};

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.reservations.unshift(action.payload);
    },
    updateReservation: (state, action: PayloadAction<Partial<Reservation> & { id: number }>) => {
      const index = state.reservations.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.reservations[index] = { ...state.reservations[index], ...action.payload };
      }
    },
    deleteReservation: (state, action: PayloadAction<number>) => { // payload is reservationId
      const index = state.reservations.findIndex(r => r.id === action.payload);
      if (index !== -1) {
        state.reservations.splice(index, 1);
      }
    },
  },
});

export const { addReservation, updateReservation, deleteReservation } = reservationsSlice.actions;

export const selectReservations = (state: RootState) => state.reservations.reservations;

export default reservationsSlice.reducer;