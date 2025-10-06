import type { Vehicle } from '../types';

interface CheckInModalProps {
    state: any;
}

const CheckInModal = ({ state }: CheckInModalProps) => {
    const vehicle = state.selectedVehicleForAction as Vehicle;
    if (!vehicle || !vehicle.rentedBy) return '';
    const today = new Date().toISOString().split('T')[0];

    return `
    <div class="modal-overlay" id="check-in-modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Teslim Al: ${vehicle.plate}</h2>
                <button class="close-modal-btn" data-modal-id="check-in-modal"><i class="fa-solid fa-xmark"></i></button>
            </div>
             <form class="modal-form" id="check-in-form">
                <input type="hidden" name="rentalId" value="${vehicle.activeRentalId}">
                <div class="customer-info-display">
                    <h4>Mevcut Kiracı</h4>
                    <p><i class="fa-solid fa-user"></i> ${vehicle.rentedBy.name}</p>
                    <p><i class="fa-solid fa-phone"></i> ${vehicle.rentedBy.phone}</p>
                </div>
                <div class="form-row" style="margin-top: 16px;">
                    <div class="form-group">
                        <label for="return-date">Teslim Tarihi</label>
                        <input type="date" id="return-date" name="returnDate" value="${today}" required>
                    </div>
                    <div class="form-group">
                        <label for="return-km">Dönüş Kilometresi</label>
                        <input type="number" id="return-km" name="returnKm" placeholder="Örn: ${parseInt(vehicle.km.replace(/,/, '')) + 1000}" required>
                    </div>
                </div>
            </form>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-modal-id="check-in-modal">İptal</button>
                <button type="submit" form="check-in-form" class="btn btn-primary">Aracı Teslim Al</button>
            </div>
        </div>
    </div>
`};

export default CheckInModal;