import { RootState } from '../store';
import { initialState as appInitialState } from '../features/app/appSlice';

const LOCAL_STORAGE_KEY = 'rehberOtomotivData_v2';

/**
 * Uygulamanın state'ini localStorage'a kaydeder.
 */
export const saveState = (state: RootState) => {
  try {
    // Sadece kalıcı olması gereken state dilimlerini seçerek kaydet.
    const stateToPersist = {
      app: {
        theme: state.app.theme,
        readNotifications: state.app.readNotifications,
        settings: state.app.settings, // Ayarları da kaydet
      },
      vehicles: state.vehicles,
      customers: state.customers,
      rentals: state.rentals,
      reservations: state.reservations,
      maintenance: state.maintenance,
      activities: state.activities,
    };
    const serializedState = JSON.stringify(stateToPersist);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (error) {
    console.error("!!! HATA: State localStorage'a kaydedilirken bir sorun oluştu:", error);
  }
};

/**
 * localStorage'dan state'i yükler.
 */
export const loadState = (): Partial<RootState> | undefined => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return undefined; // Kayıtlı state yok, varsayılanı kullan.
    }
    const loadedData = JSON.parse(serializedState);

    // Yüklenen veriyi Redux'un beklediği formata dönüştür.
    // Eksik state'ler için varsayılan değerleri kullan.
    return {
        app: {
            ...appInitialState, // Önce varsayılanları yükle
            ...(loadedData.app || {}), // Sonra kayıtlı olanlarla üzerine yaz
        },
        vehicles: loadedData.vehicles,
        customers: loadedData.customers,
        rentals: loadedData.rentals,
        reservations: loadedData.reservations,
        maintenance: loadedData.maintenance,
        activities: loadedData.activities,
    };

  } catch (error) {
    console.error("!!! HATA: localStorage'dan state yüklenirken bir sorun oluştu:", error);
    return undefined;
  }
};