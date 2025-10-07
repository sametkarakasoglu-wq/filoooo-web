import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Activity } from '../../types';

interface ActivitiesState {
  activities: Activity[];
}

// Başlangıçta boş bir aktivite listesiyle başlıyoruz.
const initialState: ActivitiesState = {
  activities: [],
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    // Bu action, yeni bir aktivite kaydı ekler.
    logActivity: (state, action: PayloadAction<{ icon: string; message: string }>) => {
      const newActivity: Activity = {
        ...action.payload,
        time: new Date(), // Zaman damgasını burada ekliyoruz.
      };
      // Yeni aktiviteyi listenin başına ekle
      state.activities.unshift(newActivity);
      // Listenin boyutunu sınırla (örneğin, son 10 aktivite)
      if (state.activities.length > 10) {
        state.activities.pop();
      }
    },
    // Bu, localStorage'dan yüklenen verileri state'e yazmak için kullanılabilir.
    setActivities: (state, action: PayloadAction<Activity[]>) => {
        state.activities = action.payload;
    }
  },
});

export const { logActivity, setActivities } = activitiesSlice.actions;

export const selectActivities = (state: RootState) => state.activities.activities;

export default activitiesSlice.reducer;