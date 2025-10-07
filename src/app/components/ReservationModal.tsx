import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectApp, closeModal } from '../features/app/appSlice';
import { selectCustomers, addCustomer } from '../features/customers/customersSlice';
import { selectVehicles } from '../features/vehicles/vehiclesSlice';
import { addReservation } from '../features/reservations/reservationsSlice';
import { Customer, Reservation } from '../types';
import { reservationFormSchema } from '../schemas';
import { z } from 'zod';

const ReservationModal: React.FC = () => {
    const dispatch = useDispatch();
    const { isReservationModalOpen } = useSelector(selectApp);
    const customers = useSelector(selectCustomers);
    const vehicles = useSelector(selectVehicles);

    const [formData, setFormData] = useState({
        customerType: 'existing',
        customerId: '',
        newCustomerName: '',
        newCustomerPhone: '',
        vehiclePlate: '',
        startDate: '',
        endDate: '',
        deliveryLocation: '',
        notes: '',
    });
    const [errors, setErrors] = useState<z.ZodError | null>(null);

    useEffect(() => {
        if (isReservationModalOpen) {
            setFormData({
                customerType: 'existing', customerId: '', newCustomerName: '', newCustomerPhone: '',
                vehiclePlate: '', startDate: '', endDate: '', deliveryLocation: '', notes: '',
            });
            setErrors(null);
        }
    }, [isReservationModalOpen]);

    if (!isReservationModalOpen) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = reservationFormSchema.safeParse(formData);
        if (!result.success) {
            setErrors(result.error);
            return;
        }

        const { data } = result;
        let finalCustomerId: number;

        if (data.customerType === 'new') {
            const newCustomer: Customer = {
                id: Date.now(),
                name: data.newCustomerName!,
                phone: data.newCustomerPhone!,
                tc: '', email: '', address: '', licenseNumber: '', licenseDate: '',
                idFile: null, idFileUrl: null, licenseFile: null, licenseFileUrl: null, rentals: [],
            };
            dispatch(addCustomer(newCustomer));
            finalCustomerId = newCustomer.id;
        } else {
            finalCustomerId = parseInt(data.customerId!, 10);
        }

        const newReservation: Reservation = {
            id: Date.now(),
            vehiclePlate: data.vehiclePlate,
            customerId: finalCustomerId,
            startDate: data.startDate,
            endDate: data.endDate,
            deliveryLocation: data.deliveryLocation,
            notes: data.notes || null,
            status: 'active',
        };

        dispatch(addReservation(newReservation));
        dispatch(closeModal({ type: 'reservation' }));
    };

    const getError = (fieldName: string) => errors?.issues.find(issue => issue.path.includes(fieldName))?.message;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Yeni Rezervasyon Ekle</h2>
                    <button onClick={() => dispatch(closeModal({ type: 'reservation' }))} className="close-modal-btn"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit} noValidate>
                    {/* Form Alanları */}
                    <div className="form-group">
                        <label htmlFor="vehiclePlate">Araç Seç</label>
                        <select id="vehiclePlate" name="vehiclePlate" value={formData.vehiclePlate} onChange={handleChange} required>
                            <option value="" disabled>Lütfen bir araç seçin...</option>
                            {vehicles.map(v => <option key={v.plate} value={v.plate}>{v.brand} ({v.plate})</option>)}
                        </select>
                        {getError('vehiclePlate') && <span className="error-message">{getError('vehiclePlate')}</span>}
                    </div>
                    {/* Diğer form alanları (Müşteri seçimi, tarihler vb.) buraya eklenecek */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => dispatch(closeModal({ type: 'reservation' }))}>İptal</button>
                        <button type="submit" className="btn btn-primary">Rezervasyonu Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReservationModal;