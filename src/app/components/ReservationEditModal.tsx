import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectApp, closeModal } from '../features/app/appSlice';
import { selectReservations, updateReservation } from '../features/reservations/reservationsSlice';
import { selectCustomers } from '../features/customers/customersSlice';
import { selectVehicles } from '../features/vehicles/vehiclesSlice';
import { Reservation } from '../types';
// TODO: Add Zod validation for reservation edit form

const ReservationEditModal: React.FC = () => {
    const dispatch = useDispatch();
    const { isReservationEditModalOpen, editingReservationId } = useSelector(selectApp);
    const reservations = useSelector(selectReservations);
    const customers = useSelector(selectCustomers);
    const vehicles = useSelector(selectVehicles);

    const reservationToEdit = reservations.find(r => r.id === editingReservationId);

    const [formData, setFormData] = useState({
        vehiclePlate: '',
        customerId: '',
        startDate: '',
        endDate: '',
        deliveryLocation: '',
        notes: '',
    });

    useEffect(() => {
        if (isReservationEditModalOpen && reservationToEdit) {
            setFormData({
                vehiclePlate: reservationToEdit.vehiclePlate,
                customerId: reservationToEdit.customerId.toString(),
                startDate: reservationToEdit.startDate,
                endDate: reservationToEdit.endDate,
                deliveryLocation: reservationToEdit.deliveryLocation,
                notes: reservationToEdit.notes || '',
            });
        }
    }, [isReservationEditModalOpen, reservationToEdit]);

    if (!isReservationEditModalOpen || !reservationToEdit) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add validation here
        const updatedData: Partial<Reservation> = {
            vehiclePlate: formData.vehiclePlate,
            customerId: parseInt(formData.customerId),
            startDate: formData.startDate,
            endDate: formData.endDate,
            deliveryLocation: formData.deliveryLocation,
            notes: formData.notes,
        };
        dispatch(updateReservation({ id: reservationToEdit.id, ...updatedData }));
        dispatch(closeModal({ type: 'reservationEdit' }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Rezervasyonu Düzenle</h2>
                    <button onClick={() => dispatch(closeModal({ type: 'reservationEdit' }))} className="close-modal-btn"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit}>
                    {/* Form Fields */}
                    <div className="form-group">
                        <label htmlFor="vehiclePlate">Araç</label>
                        <select name="vehiclePlate" value={formData.vehiclePlate} onChange={handleChange}>
                            {vehicles.map(v => <option key={v.plate} value={v.plate}>{v.brand} ({v.plate})</option>)}
                        </select>
                    </div>
                     <div className="form-group">
                        <label htmlFor="customerId">Müşteri</label>
                        <select name="customerId" value={formData.customerId} onChange={handleChange}>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    {/* Other fields... */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => dispatch(closeModal({ type: 'reservationEdit' }))}>İptal</button>
                        <button type="submit" className="btn btn-primary">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReservationEditModal;