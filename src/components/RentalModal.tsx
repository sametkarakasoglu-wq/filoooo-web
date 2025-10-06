import type { Vehicle, Customer } from '../types';

interface RentalModalProps {
    state: any;
    vehiclesData: Vehicle[];
    customersData: Customer[];
}

const RentalModal = ({ state, vehiclesData, customersData }: RentalModalProps) => {
    const vehicle = state.selectedVehicleForAction as Vehicle;
    if (!vehicle) return '';

    const today = vehicle.preselectedStartDate || new Date().toISOString().split('T')[0];
    const preselectedCustomerId = vehicle.preselectedCustomerId || null;

    return `
    <div class="modal-overlay" id="rental-modal-overlay">
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2>Kiralama Başlat: ${vehicle.plate}</h2>
                <button class="close-modal-btn" data-modal-id="rental-modal"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form class="modal-form" id="rental-form">
                <input type="hidden" name="vehiclePlate" value="${vehicle.plate}">

                <!-- Customer Selection -->
                <div class="form-group">
                    <label>Müşteri</label>
                    <div class="segmented-control">
                        <input type="radio" id="customer-type-existing" name="customerType" value="existing" ${state.rentalFormCustomerType === 'existing' ? 'checked' : ''}>
                        <label for="customer-type-existing">Mevcut Müşteri</label>

                        <input type="radio" id="customer-type-new" name="customerType" value="new" ${state.rentalFormCustomerType === 'new' ? 'checked' : ''}>
                        <label for="customer-type-new">Yeni Müşteri</label>
                    </div>
                </div>

                <!-- Existing Customer Dropdown -->
                <div class="form-group" id="existing-customer-section" style="display: flex;">
                    <select name="customerId" id="customer-id-select">
                        <option value="">Müşteri Seçiniz...</option>
                        ${customersData.map(c => `<option value="${c.id}" ${c.id === preselectedCustomerId ? 'selected' : ''}>${c.name} - ${c.phone}</option>`).join('')}
                    </select>
                </div>

                <!-- New Customer Fields -->
                <div id="new-customer-section" style="display: none;">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="new-customer-name">Ad Soyad</label>
                            <input type="text" id="new-customer-name" name="newCustomerName">
                        </div>
                        <div class="form-group">
                            <label for="new-customer-tc">TC Kimlik No</label>
                            <input type="text" id="new-customer-tc" name="newCustomerTc">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="new-customer-phone">Telefon</label>
                            <input type="tel" id="new-customer-phone" name="newCustomerPhone">
                        </div>
                        <div class="form-group">
                            <label for="new-customer-email">Email</label>
                            <input type="email" id="new-customer-email" name="newCustomerEmail">
                        </div>
                    </div>
                </div>

                <!-- Rental Details -->
                <div class="form-row">
                    <div class="form-group">
                        <label for="rental-price">Ücret</label>
                        <input type="number" id="rental-price" name="price" placeholder="Örn: 1500" required>
                    </div>
                    <div class="form-group">
                        <label>Ücret Tipi</label>
                        <div class="segmented-control">
                            <input type="radio" id="price-type-daily" name="priceType" value="daily" checked>
                            <label for="price-type-daily">Günlük</label>
                            <input type="radio" id="price-type-monthly" name="priceType" value="monthly">
                            <label for="price-type-monthly">Aylık</label>
                        </div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="start-date">Kiralama Tarihi</label>
                        <input type="date" id="start-date" name="startDate" value="${today}" required>
                    </div>
                    <div class="form-group">
                        <label for="start-km">Başlangıç Kilometresi</label>
                        <input type="number" id="start-km" name="startKm" value="${vehicle.km.replace(/,/, '')}">
                    </div>
                </div>
            </form>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-modal-id="rental-modal">İptal</button>
                <button type="submit" form="rental-form" class="btn btn-primary">Kiralamayı Onayla</button>
            </div>
        </div>
    </div>
`};

export default RentalModal;