import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Vehicle } from '../../types';
import { vehiclesData } from '../../data/vehicles';

interface VehiclesState {
  vehicles: Vehicle[];
}

const initialState: VehiclesState = {
  vehicles: vehiclesData,
};

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.vehicles.unshift(action.payload);
    },
    updateVehicle: (state, action: PayloadAction<{ vehicleIndex: number; vehicleData: Partial<Vehicle> }>) => {
      const { vehicleIndex, vehicleData } = action.payload;
      if (state.vehicles[vehicleIndex]) {
        state.vehicles[vehicleIndex] = { ...state.vehicles[vehicleIndex], ...vehicleData };
      }
    },
    deleteVehicle: (state, action: PayloadAction<number>) => {
      state.vehicles.splice(action.payload, 1);
    },
    // Kiralama veya check-in işlemleri için araç durumunu güncelleyen reducer'lar
    setVehicleStatusToRented: (state, action: PayloadAction<{ vehiclePlate: string; customerName: string; customerPhone: string; rentalId: number; }>) => {
        const vehicle = state.vehicles.find(v => v.plate === action.payload.vehiclePlate);
        if (vehicle) {
            vehicle.status = 'Kirada';
            vehicle.rentedBy = { name: action.payload.customerName, phone: action.payload.customerPhone };
            vehicle.activeRentalId = action.payload.rentalId;
        }
    },
    setVehicleStatusToAvailable: (state, action: PayloadAction<{ vehiclePlate: string; returnKm: number }>) => {
        const vehicle = state.vehicles.find(v => v.plate === action.payload.vehiclePlate);
        if (vehicle) {
            vehicle.status = 'Müsait';
            vehicle.km = action.payload.returnKm.toLocaleString('tr-TR');
            delete vehicle.rentedBy;
            delete vehicle.activeRentalId;
        }
    }
  },
});

export const { addVehicle, updateVehicle, deleteVehicle, setVehicleStatusToRented, setVehicleStatusToAvailable } = vehiclesSlice.actions;

export const selectVehicles = (state: RootState) => state.vehicles.vehicles;

export default vehiclesSlice.reducer;