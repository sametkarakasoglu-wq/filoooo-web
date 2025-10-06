import type { Vehicle, Customer } from '../types';

interface ReservationModalProps {
    vehiclesData: Vehicle[];
    customersData: Customer[];
}

const ReservationModal = ({ vehiclesData, customersData }: ReservationModalProps) => {
    const today = new Date().toISOString().split('T')[0];

    return `
    <div class="modal-overlay" id="reservation-modal-overlay">
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2>Yeni Rezervasyon</h2>
                <button class="close-modal-btn" data-modal-id="reservation-modal"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form class="modal-form" id="reservation-form">
                <div class="form-group">
                    <label for="reservation-vehicle-select">Araç</label>
                    <select name="vehiclePlate" id="reservation-vehicle-select" required>
                        <option value="">Araç Seçiniz...</option>
                        ${vehiclesData.map(v => `<option value="${v.plate}">${v.plate} - ${v.brand}</option>`).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label>Müşteri</label>
                    <div class="segmented-control">
                        <input type="radio" id="res-customer-type-existing" name="customerType" value="existing" checked>
                        <label for="res-customer-type-existing">Mevcut Müşteri</label>
                        <input type="radio" id="res-customer-type-new" name="customerType" value="new">
                        <label for="res-customer-type-new">Yeni Müşteri</label>
                    </div>
                </div>

                <div class="form-group" id="res-existing-customer-section">
                    <select name="customerId" id="res-customer-id-select" required>
                        <option value="">Müşteri Seçiniz...</option>
                        ${customersData.map(c => `<option value="${c.id}">${c.name} - ${c.phone}</option>`).join('')}
                    </select>
                </div>

                <div id="res-new-customer-section" style="display: none;">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="res-new-customer-name">Ad Soyad</label>
                            <input type="text" id="res-new-customer-name" name="newCustomerName">
                        </div>
                        <div class="form-group">
                            <label for="res-new-customer-phone">Telefon</label>
                            <input type="tel" id="res-new-customer-phone" name="newCustomerPhone">
                        </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group"><label for="res-start-date">Başlangıç Tarihi</label><input type="date" id="res-start-date" name="startDate" value="${today}" required></div>
                    <div class="form-group"><label for="res-end-date">Bitiş Tarihi</label><input type="date" id="res-end-date" name="endDate" required></div>
                </div>
                <div class="form-group"><label for="res-delivery-location">Teslim Yeri</label><input type="text" id="res-delivery-location" name="deliveryLocation" placeholder="Örn: Havaalanı Gelen Yolcu" required></div>
                <div class="form-group"><label for="res-notes">Notlar</label><textarea id="res-notes" name="notes" rows="3" placeholder="Rezervasyon ile ilgili notlar..."></textarea></div>
            </form>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-modal-id="reservation-modal">İptal</button>
                <button type="submit" form="reservation-form" class="btn btn-primary">Rezervasyonu Kaydet</button>
            </div>
        </div>
    </div>
    `;
};

export default ReservationModal;