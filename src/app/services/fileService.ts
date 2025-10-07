import { RootState, store } from '../store';

/**
 * Mevcut uygulama durumunu bir JSON dosyası olarak dışa aktarır.
 * @param state Dışa aktarılacak olan Redux state'i.
 */
export const exportDataAsJson = (state: RootState) => {
  try {
    const stateToExport = {
      theme: state.app.theme,
      readNotifications: state.app.readNotifications,
      vehicles: state.vehicles,
      customers: state.customers,
      rentals: state.rentals,
      reservations: state.reservations,
      maintenance: state.maintenance,
      activities: state.activities,
    };

    const dataStr = JSON.stringify(stateToExport, null, 2); // Okunabilir formatta JSON
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rehber-otomotiv-yedek-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    // showToast("Veriler başarıyla dışa aktarıldı!", "success"); // Toast bildirimi burada veya çağıran yerde gösterilebilir.
  } catch (error) {
    console.error("Veri dışa aktarılırken hata:", error);
    // showToast("Veri dışa aktarılırken bir hata oluştu.", "error");
  }
};

/**
 * Bir JSON dosyasından veri içe aktarır ve state'i günceller.
 * Bu fonksiyon, eski veri formatlarını dönüştürme mantığını da içerebilir.
 * @param file Kullanıcının seçtiği JSON dosyası.
 */
export const importDataFromJson = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);

        // TODO: Eski veri formatlarını yeni state yapısına dönüştürmek için
        // burada bir veri dönüştürme (transformation) mantığı eklenebilir.
        // Örneğin, eski `rehber_filo_yedekLEME 2.json` formatını yeni Redux state yapısına uyarlama.

        if (confirm('Veriler içe aktarılacak. Bu işlem mevcut verilerin üzerine yazılacaktır. Onaylıyor musunuz?')) {
            // Veriyi doğrudan dispatch etmek yerine, belki de her slice için ayrı ayrı
            // "setState" action'ları oluşturup dispatch etmek daha kontrollü olabilir.

            // Şimdilik basitçe sayfayı yeniden yükleyerek yeni state'in
            // localStorage'dan okunmasını sağlıyoruz.
            const dataToLoad = JSON.stringify(importedData);
            localStorage.setItem('rehberOtomotivData_v2', dataToLoad);

            // Başarı mesajı için bir işaret bırakıp sayfayı yeniden yükle
            localStorage.setItem('showImportSuccessToast', 'true');
            window.location.reload();
            resolve();
        } else {
            reject(new Error("Kullanıcı işlemi iptal etti."));
        }
      } catch (err) {
        console.error("Veri içe aktarılırken hata:", err);
        reject(new Error(`Hata: ${err.message}. Lütfen doğru formatta bir JSON dosyası seçin.`));
      }
    };

    reader.onerror = (err) => {
        reject(new Error("Dosya okunurken bir hata oluştu."));
    };

    reader.readAsText(file);
  });
};