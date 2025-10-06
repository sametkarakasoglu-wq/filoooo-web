import type { Rental, Customer } from '../types';

interface RentalEditModalProps {
    state: any;
    rentalsData: Rental[];
    customersData: Customer[];
}

const RentalEditModal = ({ state, rentalsData, customersData }: RentalEditModalProps) => {
    if (state.editingRentalId === null) return '';
    const rental = rentalsData.find(r => r.id === state.editingRentalId);
    if (!rental) return '';

    const customer = customersData.find(c => c.id === rental.customerId);

    return `
    <div class="modal-overlay" id="rental-edit-modal-overlay">
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2>Kiramayı Düzenle: ${rental.vehiclePlate}</h2>
                <button class="close-modal-btn" data-modal-id="rental-edit-modal"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form class="modal-form" id="rental-edit-form">
                <input type="hidden" name="rentalId" value="${rental.id}">
                <div class="customer-info-display" style="margin-bottom: 16px;">
                    <h4>Müşteri</h4>
                    <p><i class="fa-solid fa-user"></i> ${customer?.name || 'Bilinmiyor'}</p>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="edit-start-date">Başlangıç Tarihi</label>
                        <input type="date" id="edit-start-date" name="startDate" value="${rental.startDate}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-end-date">Bitiş Tarihi</label>
                        <input type="date" id="edit-end-date" name="endDate" value="${rental.endDate || ''}">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="edit-start-km">Başlangıç KM</label>
                        <input type="number" id="edit-start-km" name="startKm" value="${rental.startKm}">
                    </div>
                    <div class="form-group">
                        <label for="edit-end-km">Bitiş KM</label>
                        <input type="number" id="edit-end-km" name="endKm" value="${rental.endKm || ''}">
                    </div>
                </div>

                <div class="file-upload-group">
                    <label>Belge Yükleme</label>
                    <div class="file-input-wrapper">
                         <span><i class="fa-solid fa-file-contract"></i> Sözleşme</span>
                         <input type="file" name="contractFile" accept=".pdf,.jpg,.jpeg,.png">
                    </div>
                     <div class="file-input-wrapper">
                         <span><i class="fa-solid fa-file-invoice-dollar"></i> Fatura</span>
                         <input type="file" name="invoiceFile" accept=".pdf,.jpg,.jpeg,.png">
                    </div>
                </div>
            </form>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-modal-id="rental-edit-modal">İptal</button>
                <button type="submit" form="rental-edit-form" class="btn btn-primary">Değişiklikleri Kaydet</button>
            </div>
        </div>
    </div>
`};

export default RentalEditModal;