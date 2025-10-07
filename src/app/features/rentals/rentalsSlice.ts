import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Rental } from '../../types';
import { rentalsData } from '../../data/rentals';

interface RentalsState {
  rentals: Rental[];
}

const initialState: RentalsState = {
  rentals: rentalsData,
};

const rentalsSlice = createSlice({
  name: 'rentals',
  initialState,
  reducers: {
    addRental: (state, action: PayloadAction<Rental>) => {
      state.rentals.unshift(action.payload);
    },
    updateRental: (state, action: PayloadAction<Partial<Rental> & { id: number }>) => {
      const index = state.rentals.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.rentals[index] = { ...state.rentals[index], ...action.payload };
      }
    },
    deleteRental: (state, action: PayloadAction<number>) => { // payload is rentalId
      const index = state.rentals.findIndex(r => r.id === action.payload);
      if (index !== -1) {
        state.rentals.splice(index, 1);
      }
    },
    // Bu reducer, check-in mantığını özel olarak ele alır
    completeRental: (state, action: PayloadAction<{ rentalId: number; returnDate: string; returnKm: number; totalCost: number }>) => {
        const rental = state.rentals.find(r => r.id === action.payload.rentalId);
        if (rental) {
            rental.endDate = action.payload.returnDate;
            rental.endKm = action.payload.returnKm;
            rental.status = 'completed';
            rental.totalCost = action.payload.totalCost;
        }
    }
  },
});

export const { addRental, updateRental, deleteRental, completeRental } = rentalsSlice.actions;

export const selectRentals = (state: RootState) => state.rentals.rentals;

export default rentalsSlice.reducer;