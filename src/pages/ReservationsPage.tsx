import type { Reservation, Customer, Vehicle } from '../types';
import { getStatusClass } from '../utils';

interface ReservationsPageProps {
    state: any;
    reservationsData: Reservation[];
    customersData: Customer[];
    vehiclesData: Vehicle[];
}

const ReservationsPage = ({ state, reservationsData, customersData, vehiclesData }: ReservationsPageProps): string => {
    const getCustomerName = (customerId: number) => {
        const customer = customersData.find(c => c.id === customerId);
        return customer ? customer.name : 'Bilinmeyen Müşteri';
    };
    const getVehicleBrand = (plate: string) => {
        const vehicle = vehiclesData.find(v => v.plate === plate);
        return vehicle ? vehicle.brand : 'Bilinmeyen Araç';
    }
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('tr-TR');

    return `
    <header class="page-header">
        <h1>Rezervasyon Yönetimi</h1>
        <p>Gelecek ve geçmiş tüm rezervasyonları görüntüleyin.</p>
    </header>
    <div class="page-actions">
        <div class="search-bar">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="reservation-search" placeholder="Plaka veya müşteri adı ara..." value="${state.searchTerm}">
        </div>
        <button class="btn btn-primary" id="add-reservation-btn">
            <i class="fa-solid fa-calendar-plus"></i>
            Yeni Rezervasyon Ekle
        </button>
    </div>
    <div class="reservations-list">
        ${reservationsData.map(res => `
            <div class="reservation-card" data-reservation-id="${res.id}">
                <div class="reservation-card-header">
                    <div class="reservation-vehicle">
                        <i class="fa-solid fa-car"></i>
                        <div>
                            <strong>${res.vehiclePlate}</strong>
                            <span>${getVehicleBrand(res.vehiclePlate)}</span>
                        </div>
                    </div>
                    <div class="status-badge ${getStatusClass(res.status)}">${res.status}</div>
                </div>
                <div class="reservation-card-body">
                    <div class="reservation-customer">
                        <i class="fa-solid fa-user"></i>
                        <span>${getCustomerName(res.customerId)}</span>
                    </div>
                    <div class="reservation-details">
                        <div class="detail-item">
                            <i class="fa-solid fa-calendar-arrow-down"></i>
                            <span>${formatDate(res.startDate)}</span>
                        </div>
                        <i class="fa-solid fa-arrow-right-long"></i>
                        <div class="detail-item">
                            <i class="fa-solid fa-calendar-arrow-up"></i>
                            <span>${formatDate(res.endDate)}</span>
                        </div>
                    </div>
                </div>
                <div class="reservation-card-footer">
                    <div class="delivery-location">
                        <i class="fa-solid fa-map-location-dot"></i>
                        <span>Teslim Yeri: <strong>${res.deliveryLocation}</strong></span>
                    </div>
                    ${res.notes ? `<div class="reservation-notes" data-tooltip="${res.notes}"><i class="fa-solid fa-comment-dots"></i> Not Var</div>` : ''}
                </div>
                <div class="card-actions">
                    <div class="action-icons">
                        <button class="action-btn btn-edit-reservation" title="Düzenle"><i class="fa-solid fa-pencil"></i></button>
                        <button class="action-btn btn-delete-reservation" title="Sil"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>
    `;
};

export default ReservationsPage;