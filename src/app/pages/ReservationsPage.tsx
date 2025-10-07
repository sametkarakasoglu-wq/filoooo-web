import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectReservations, deleteReservation } from '../features/reservations/reservationsSlice';
import { selectCustomers } from '../features/customers/customersSlice';
import { selectVehicles } from '../features/vehicles/vehiclesSlice';
import { selectApp, setSearchTerm, openModal } from '../features/app/appSlice';
import { Reservation } from '../types';
import { getStatusClass } from '../utils/utils';

// Alt Bileşen: ReservationCard
const ReservationCard: React.FC<{ reservation: Reservation & { customerName: string; vehicleBrand: string } }> = ({ reservation }) => {
    const dispatch = useDispatch();
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('tr-TR');

    const handleDelete = () => {
        if (confirm(`Bu rezervasyon kaydını silmek istediğinizden emin misiniz?`)) {
            dispatch(deleteReservation(reservation.id));
        }
    };

    return (
        <div className="reservation-card" data-reservation-id={reservation.id}>
            <div className="reservation-card-header">
                <div className="reservation-vehicle">
                    <i className="fa-solid fa-car"></i>
                    <div>
                        <strong>{reservation.vehiclePlate}</strong>
                        <span>{reservation.vehicleBrand}</span>
                    </div>
                </div>
                <div className={`status-badge ${getStatusClass(reservation.status)}`}>{reservation.status}</div>
            </div>
            <div className="reservation-card-body">
                <div className="reservation-customer">
                    <i className="fa-solid fa-user"></i>
                    <span>{reservation.customerName}</span>
                </div>
                <div className="reservation-details">
                    <div className="detail-item"><i className="fa-solid fa-calendar-arrow-down"></i><span>{formatDate(reservation.startDate)}</span></div>
                    <i className="fa-solid fa-arrow-right-long"></i>
                    <div className="detail-item"><i className="fa-solid fa-calendar-arrow-up"></i><span>{formatDate(reservation.endDate)}</span></div>
                </div>
            </div>
            <div className="reservation-card-footer">
                <div className="delivery-location">
                    <i className="fa-solid fa-map-location-dot"></i>
                    <span>Teslim Yeri: <strong>{reservation.deliveryLocation}</strong></span>
                </div>
                {reservation.notes && <div className="reservation-notes" data-tooltip={reservation.notes}><i className="fa-solid fa-comment-dots"></i> Not Var</div>}
            </div>
            <div className="card-actions">
                <div className="action-icons">
                    <button className="action-btn" onClick={() => dispatch(openModal({ type: 'reservationEdit', entity: reservation.id }))} title="Düzenle"><i className="fa-solid fa-pencil"></i></button>
                    <button className="action-btn" onClick={handleDelete} title="Sil"><i className="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        </div>
    );
};

// Ana Bileşen: ReservationsPage
const ReservationsPage: React.FC = () => {
    const dispatch = useDispatch();
    const { searchTerm } = useSelector(selectApp);
    const reservations = useSelector(selectReservations);
    const customers = useSelector(selectCustomers);
    const vehicles = useSelector(selectVehicles);

    const customerMap = useMemo(() => new Map(customers.map(c => [c.id, c.name])), [customers]);
    const vehicleMap = useMemo(() => new Map(vehicles.map(v => [v.plate, v.brand])), [vehicles]);

    const filteredReservations = useMemo(() => {
        return reservations
            .map(res => ({
                ...res,
                customerName: customerMap.get(res.customerId) || 'Bilinmeyen Müşteri',
                vehicleBrand: vehicleMap.get(res.vehiclePlate) || 'Bilinmeyen Araç'
            }))
            .filter(res =>
                res.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                res.customerName.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [reservations, searchTerm, customerMap, vehicleMap]);

    return (
        <>
            <header className="page-header">
                <h1>Rezervasyon Yönetimi</h1>
                <p>Gelecek ve geçmiş tüm rezervasyonları görüntüleyin.</p>
            </header>
            <div className="page-actions">
                <div className="search-bar">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        id="reservation-search"
                        placeholder="Plaka veya müşteri adı ara..."
                        value={searchTerm}
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                    />
                </div>
                <button className="btn btn-primary" onClick={() => dispatch(openModal({ type: 'reservation' }))}>
                    <i className="fa-solid fa-calendar-plus"></i>
                    Yeni Rezervasyon Ekle
                </button>
            </div>
            <div className="reservations-list">
                {filteredReservations.map(res => <ReservationCard key={res.id} reservation={res} />)}
            </div>
        </>
    );
};

export default ReservationsPage;