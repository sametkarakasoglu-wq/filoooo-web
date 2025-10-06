import type { Vehicle } from '../types';

interface MaintenanceModalProps {
    vehiclesData: Vehicle[];
}

const MaintenanceModal = ({ vehiclesData }: MaintenanceModalProps) => {
    const today = new Date().toISOString().split('T')[0];

    return `
    <div class="modal-overlay" id="maintenance-modal-overlay">
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2>Yeni Bakım Kaydı</h2>
                <button class="close-modal-btn" data-modal-id="maintenance-modal"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form class="modal-form" id="maintenance-form">
                <div class="form-group">
                    <label for="maintenance-vehicle-select">Araç</label>
                    <select name="vehiclePlate" id="maintenance-vehicle-select" required>
                        <option value="">Araç Seçiniz...</option>
                        ${vehiclesData.map(v => `<option value="${v.plate}">${v.plate} - ${v.brand}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="maintenance-date">Bakım Tarihi</label>
                        <input type="date" id="maintenance-date" name="maintenanceDate" value="${today}" required>
                    </div>
                    <div class="form-group">
                        <label for="maintenance-km">Bakım Kilometresi</label>
                        <input type="number" id="maintenance-km" name="maintenanceKm" placeholder="Örn: 95000" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="maintenance-type">Bakım Türü</label>
                        <input type="text" id="maintenance-type" name="type" placeholder="Örn: Periyodik Bakım" required>
                    </div>
                    <div class="form-group">
                        <label for="maintenance-cost">Maliyet (₺)</label>
                        <input type="number" id="maintenance-cost" name="cost" placeholder="Örn: 1500" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="maintenance-description">Açıklama / Yapılan İşlemler</label>
                    <textarea id="maintenance-description" name="description" rows="3" placeholder="Yağ, filtre değişimi..."></textarea>
                </div>
                <fieldset class="next-maintenance-fieldset">
                    <legend>Sonraki Bakım Bilgileri (Otomatik)</legend>
                    <div class="form-row">
                        <div class="form-group"><label for="next-maintenance-km">Sonraki Bakım KM</label><input type="number" id="next-maintenance-km" name="nextMaintenanceKm" readonly></div>
                        <div class="form-group"><label for="next-maintenance-date">Sonraki Bakım Tarihi</label><input type="date" id="next-maintenance-date" name="nextMaintenanceDate" readonly></div>
                    </div>
                </fieldset>
            </form>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-modal-id="maintenance-modal">İptal</button>
                <button type="submit" form="maintenance-form" class="btn btn-primary">Kaydı Oluştur</button>
            </div>
        </div>
    </div>
    `;
};

export default MaintenanceModal;