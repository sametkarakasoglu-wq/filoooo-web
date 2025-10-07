import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// Modal türlerini tanımlayan bir tip oluşturuyoruz. Bu, kodun daha okunabilir ve yönetilebilir olmasını sağlar.
export type ModalType =
  | 'vehicle'
  | 'rental'
  | 'customer'
  | 'checkIn'
  | 'reservation'
  | 'maintenance'
  | 'rentalEdit'
  | 'reservationEdit'
  | 'maintenanceEdit';

interface AppState {
  activePage: string;
  theme: 'light' | 'dark';
  // Her modal için ayrı bir boolean flag tutuyoruz.
  isVehicleModalOpen: boolean;
  isRentalModalOpen: boolean;
  isCustomerModalOpen: boolean;
  isCheckInModalOpen: boolean;
  isReservationModalOpen: boolean;
  isMaintenanceModalOpen: boolean;
  isRentalEditModalOpen: boolean;
  isReservationEditModalOpen: boolean;
  isMaintenanceEditModalOpen: boolean;
  // Düzenleme ve aksiyonlar için seçili varlıkların ID'lerini veya verilerini tutuyoruz.
  editingVehicleIndex: number | null;
  editingReservationId: number | null;
  editingMaintenanceId: number | null;
  editingCustomerIndex: number | null;
  editingRentalId: number | null;
  selectedVehicleForAction: any | null; // Tip daha sonra iyileştirilebilir.
  // Formlar için özel state'ler
  rentalFormCustomerType: 'existing' | 'new';
  searchTerm: string;
  // Bildirimler için state'ler
  notificationFilter: 'all' | 'reminders' | 'activities';
  readNotifications: number[];
}

export const initialState: AppState = {
  activePage: 'dashboard',
  theme: 'light',
  isVehicleModalOpen: false,
  isRentalModalOpen: false,
  isCustomerModalOpen: false,
  isCheckInModalOpen: false,
  isReservationModalOpen: false,
  isMaintenanceModalOpen: false,
  isRentalEditModalOpen: false,
  isReservationEditModalOpen: false,
  isMaintenanceEditModalOpen: false,
  editingVehicleIndex: null,
  editingReservationId: null,
  editingMaintenanceId: null,
  editingCustomerIndex: null,
  editingRentalId: null,
  selectedVehicleForAction: null,
  rentalFormCustomerType: 'existing',
  searchTerm: '',
  notificationFilter: 'all',
  readNotifications: [],
};

// Modal state'lerini modal türüne göre eşleyen bir harita.
const modalStateMap: Record<ModalType, keyof AppState> = {
    vehicle: 'isVehicleModalOpen',
    rental: 'isRentalModalOpen',
    customer: 'isCustomerModalOpen',
    checkIn: 'isCheckInModalOpen',
    reservation: 'isReservationModalOpen',
    maintenance: 'isMaintenanceModalOpen',
    rentalEdit: 'isRentalEditModalOpen',
    reservationEdit: 'isReservationEditModalOpen',
    maintenanceEdit: 'isMaintenanceEditModalOpen',
};


const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActivePage: (state, action: PayloadAction<string>) => {
      state.activePage = action.payload;
      state.searchTerm = ''; // Sayfa değiştiğinde arama terimini ve diğer filtreleri sıfırla
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setNotificationFilter: (state, action: PayloadAction<'all' | 'reminders' | 'activities'>) => {
        state.notificationFilter = action.payload;
    },
    addReadNotification: (state, action: PayloadAction<number>) => {
        if (!state.readNotifications.includes(action.payload)) {
            state.readNotifications.push(action.payload);
        }
    },
    openModal: (state, action: PayloadAction<{ type: ModalType; entity?: any }>) => {
        const { type, entity } = action.payload;
        const modalStateKey = modalStateMap[type];
        if (modalStateKey) {
            state[modalStateKey] = true;
        }

        // Modal türüne göre ilgili ID'yi veya veriyi state'e yaz.
        if (entity) {
            switch (type) {
                case 'vehicle':
                    state.editingVehicleIndex = entity;
                    break;
                case 'rental':
                    state.selectedVehicleForAction = entity;
                    state.rentalFormCustomerType = 'existing'; // Reset form
                    break;
                case 'checkIn':
                    state.selectedVehicleForAction = entity;
                    break;
                case 'customer':
                    state.editingCustomerIndex = entity;
                    break;
                case 'rentalEdit':
                    state.editingRentalId = entity;
                    break;
                case 'reservationEdit':
                    state.editingReservationId = entity;
                    break;
                case 'maintenanceEdit':
                    state.editingMaintenanceId = entity;
                    break;
            }
        }
    },
    closeModal: (state, action: PayloadAction<{ type: ModalType }>) => {
        const { type } = action.payload;
        const modalStateKey = modalStateMap[type];
        if (modalStateKey) {
            state[modalStateKey] = false;
        }

        // Modal kapandığında ilgili ID'leri ve verileri temizle.
        state.editingVehicleIndex = null;
        state.editingReservationId = null;
        state.editingMaintenanceId = null;
        state.editingCustomerIndex = null;
        state.editingRentalId = null;
        state.selectedVehicleForAction = null;
    },
    setRentalFormCustomerType: (state, action: PayloadAction<'existing' | 'new'>) => {
        state.rentalFormCustomerType = action.payload;
    },
    updateSetting: (state, action: PayloadAction<{ key: keyof AppState['settings']; value: any }>) => {
        const { key, value } = action.payload;
        (state.settings as any)[key] = value;
    }
  },
});

export const {
    setActivePage,
    setTheme,
    setSearchTerm,
    openModal,
    closeModal,
    setRentalFormCustomerType,
    setNotificationFilter,
    addReadNotification,
    updateSetting,
} = appSlice.actions;

export const selectApp = (state: RootState) => state.app;

export default appSlice.reducer;