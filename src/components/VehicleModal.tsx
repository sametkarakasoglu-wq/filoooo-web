import type { Vehicle } from '../types';

interface VehicleModalProps {
    state: any;
    vehiclesData: Vehicle[];
}

const VehicleModal = ({ state, vehiclesData }: VehicleModalProps) => {
    const isEditing = state.editingVehicleIndex !== null;
    const vehicle = isEditing ? vehiclesData[state.editingVehicleIndex] : null;
    const modelParts = vehicle?.brand.split(' ') || ['', ''];
    const brand = modelParts[0];
    const model = modelParts.slice(1).join(' ');

    return `
    <div class="modal-overlay" id="vehicle-modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2>${isEditing ? 'Aracı Düzenle' : 'Yeni Araç Ekle'}</h2>
                <button class="close-modal-btn" data-modal-id="vehicle-modal"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form class="modal-form" id="vehicle-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="plate">Plaka</label>
                        <input type="text" id="plate" name="plate" placeholder="34 ABC 123" value="${vehicle?.plate || ''}" required ${isEditing ? 'readonly' : ''}>
                    </div>
                    <div class="form-group">
                        <label for="km">Kilometre</label>
                        <input type="number" id="km" name="km" placeholder="Örn: 85000" value="${vehicle?.km.replace(/[^0-9]/g, '') || ''}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="brand">Marka</label>
                        <input type="text" id="brand" name="brand" placeholder="Ford" value="${brand || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="model">Model</label>
                        <input type="text" id="model" name="model" placeholder="Focus" value="${model || ''}" required>
                    </div>
                </div>
                 <div class="form-group">
                    <label for="status">Durum</label>
                    <select id="status" name="status" value="${vehicle?.status || 'Müsait'}">
                        <option value="Müsait" ${vehicle?.status === 'Müsait' ? 'selected' : ''}>Müsait</option>
                        <option value="Kirada" ${vehicle?.status === 'Kirada' ? 'selected' : ''}>Kirada</option>
                        <option value="Bakımda" ${vehicle?.status === 'Bakımda' ? 'selected' : ''}>Bakımda</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="insuranceDate">Sigorta Bitiş Tarihi</label>
                        <input type="date" id="insuranceDate" name="insuranceDate" value="${vehicle?.insuranceDate || ''}">
                    </div>
                    <div class="form-group">
                        <label for="inspectionDate">Muayene Bitiş Tarihi</label>
                        <input type="date" id="inspectionDate" name="inspectionDate" value="${vehicle?.inspectionDate || ''}">
                    </div>
                </div>
                <div class="file-upload-group">
                    <label>Belge Yükleme</label>
                    <div class="file-input-wrapper">
                         <span><i class="fa-solid fa-shield-halved"></i> Sigorta</span>
                         <input type="file" id="insuranceFile" name="insuranceFile" accept=".pdf,.jpg,.jpeg,.png">
                    </div>
                     <div class="file-input-wrapper">
                         <span><i class="fa-solid fa-clipboard-check"></i> Muayene</span>
                         <input type="file" id="inspectionFile" name="inspectionFile" accept=".pdf,.jpg,.jpeg,.png">
                    </div>
                     <div class="file-input-wrapper">
                         <span><i class="fa-solid fa-id-card"></i> Ruhsat</span>
                         <input type="file" id="licenseFile" name="licenseFile" accept=".pdf,.jpg,.jpeg,.png">
                    </div>
                </div>
            </form>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-modal-id="vehicle-modal">İptal</button>
                <button type="submit" form="vehicle-form" class="btn btn-primary">${isEditing ? 'Değişiklikleri Kaydet' : 'Aracı Kaydet'}</button>
            </div>
        </div>
    </div>
`};

export default VehicleModal;