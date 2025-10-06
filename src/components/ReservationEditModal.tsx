import type { Reservation, Vehicle, Customer } from '../types';

interface ReservationEditModalProps {
    state: any;
    reservationsData: Reservation[];
    vehiclesData: Vehicle[];
    customersData: Customer[];
}

const ReservationEditModal = ({ state, reservationsData, vehiclesData, customersData }: ReservationEditModalProps) => {
    if (state.editingReservationId === null) return '';
    const reservation = reservationsData.find(r => r.id === state.editingReservationId);
    if (!reservation) return '';

    return `
    <div class="modal-overlay" id="reservation-edit-modal-overlay">
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2>Rezervasyonu Düzenle</h2>
                <button class="close-modal-btn" data-modal-id="reservation-edit-modal"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form class="modal-form" id="reservation-edit-form">
                <input type="hidden" name="reservationId" value="${reservation.id}">
                <div class="form-group">
                    <label for="reservation-edit-vehicle-select">Araç</label>
                    <select name="vehiclePlate" id="reservation-edit-vehicle-select" required>
                        ${vehiclesData.map(v => `<option value="${v.plate}" ${reservation.vehiclePlate === v.plate ? 'selected' : ''}>${v.plate} - ${v.brand}</option>`).join('')}
                    </select>
                </div>

                 <div class="form-group">
                    <label for="reservation-edit-customer-select">Müşteri</label>
                    <select name="customerId" id="reservation-edit-customer-select" required>
                        ${customersData.map(c => `<option value="${c.id}" ${reservation.customerId === c.id ? 'selected' : ''}>${c.name} - ${c.phone}</option>`).join('')}
                    </select>
                </div>

                <div class="form-row">
                    <div class="form-group"><label for="res-edit-start-date">Başlangıç Tarihi</label><input type="date" id="res-edit-start-date" name="startDate" value="${reservation.startDate}" required></div>
                    <div class="form-group"><label for="res-edit-end-date">Bitiş Tarihi</label><input type="date" id="res-edit-end-date" name="endDate" value="${reservation.endDate}" required></div>
                </div>
                <div class="form-group"><label for="res-edit-delivery-location">Teslim Yeri</label><input type="text" id="res-edit-delivery-location" name="deliveryLocation" value="${reservation.deliveryLocation}" required></div>
                <div class="form-group"><label for="res-edit-notes">Notlar</label><textarea id="res-edit-notes" name="notes" rows="3" placeholder="Rezervasyon ile ilgili notlar...">${reservation.notes || ''}</textarea></div>
            </form>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-modal-id="reservation-edit-modal">İptal</button>
                <button type="submit" form="reservation-edit-form" class="btn btn-primary">Değişiklikleri Kaydet</button>
            </div>
        </div>
    </div>
    `;
};

export default ReservationEditModal;