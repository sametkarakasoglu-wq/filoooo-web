import type { Maintenance } from '../types';

interface MaintenanceEditModalProps {
    state: any;
    maintenanceData: Maintenance[];
}

const MaintenanceEditModal = ({ state, maintenanceData }: MaintenanceEditModalProps) => {
    if (state.editingMaintenanceId === null) return '';
    const maint = maintenanceData.find(m => m.id === state.editingMaintenanceId);
    if (!maint) return '';

    return `
    <div class="modal-overlay" id="maintenance-edit-modal-overlay">
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2>Bakım Kaydını Düzenle</h2>
                <button class="close-modal-btn" data-modal-id="maintenance-edit-modal"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form class="modal-form" id="maintenance-edit-form">
                <input type="hidden" name="maintenanceId" value="${maint.id}">
                <div class="form-group"><label>Araç</label><input type="text" value="${maint.vehiclePlate}" readonly></div>
                <div class="form-row"><div class="form-group"><label>Bakım Tarihi</label><input type="date" name="maintenanceDate" value="${maint.maintenanceDate}" required></div><div class="form-group"><label>Bakım KM</label><input type="number" name="maintenanceKm" value="${maint.maintenanceKm}" required></div></div>
                <div class="form-row"><div class="form-group"><label>Bakım Türü</label><input type="text" name="type" value="${maint.type}" required></div><div class="form-group"><label>Maliyet (₺)</label><input type="number" name="cost" value="${maint.cost}" required></div></div>
                <div class="form-group"><label>Açıklama</label><textarea name="description" rows="3">${maint.description}</textarea></div>
                <div class="form-row"><div class="form-group"><label>Sonraki Bakım KM</label><input type="number" name="nextMaintenanceKm" value="${maint.nextMaintenanceKm}" required></div><div class="form-group"><label>Sonraki Bakım Tarihi</label><input type="date" name="nextMaintenanceDate" value="${maint.nextMaintenanceDate}" required></div></div>
            </form>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-modal-id="maintenance-edit-modal">İptal</button>
                <button type="submit" form="maintenance-edit-form" class="btn btn-primary">Değişiklikleri Kaydet</button>
            </div>
        </div>
    </div>
    `;
};

export default MaintenanceEditModal;