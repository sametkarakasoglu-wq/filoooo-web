import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Maintenance } from '../../types';
import { maintenanceData } from '../../data/maintenance';

interface MaintenanceState {
  maintenances: Maintenance[];
}

const initialState: MaintenanceState = {
  maintenances: maintenanceData,
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    addMaintenance: (state, action: PayloadAction<Maintenance>) => {
      state.maintenances.unshift(action.payload);
    },
    updateMaintenance: (state, action: PayloadAction<Partial<Maintenance> & { id: number }>) => {
      const index = state.maintenances.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.maintenances[index] = { ...state.maintenances[index], ...action.payload };
      }
    },
    deleteMaintenance: (state, action: PayloadAction<number>) => { // payload is maintenanceId
      const index = state.maintenances.findIndex(m => m.id === action.payload);
      if (index !== -1) {
        state.maintenances.splice(index, 1);
      }
    },
  },
});

export const { addMaintenance, updateMaintenance, deleteMaintenance } = maintenanceSlice.actions;

export const selectMaintenance = (state: RootState) => state.maintenance.maintenances;

export default maintenanceSlice.reducer;