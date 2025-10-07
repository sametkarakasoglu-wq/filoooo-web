import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectApp, closeModal } from '../features/app/appSlice';
import { selectRentals, completeRental } from '../features/rentals/rentalsSlice';
import { setVehicleStatusToAvailable } from '../features/vehicles/vehiclesSlice';
import { logActivity } from '../features/activities/activitiesSlice';
import { Vehicle } from '../types';
import { checkInFormSchema } from '../schemas';
import { z } from 'zod';

const CheckInModal: React.FC = () => {
    const dispatch = useDispatch();
    const { isCheckInModalOpen, selectedVehicleForAction } = useSelector(selectApp);
    const rentals = useSelector(selectRentals);

    const vehicle = selectedVehicleForAction as Vehicle | null;
    const activeRental = vehicle ? rentals.find(r => r.id === vehicle.activeRentalId) : null;

    const [formData, setFormData] = useState({
        returnDate: new Date().toISOString().split('T')[0],
        returnKm: '',
    });
    const [errors, setErrors] = useState<z.ZodError | null>(null);

    useEffect(() => {
        if (isCheckInModalOpen) {
            setFormData({
                returnDate: new Date().toISOString().split('T')[0],
                returnKm: vehicle?.km.replace(/[^0-9]/g, '') || '',
            });
            setErrors(null);
        }
    }, [isCheckInModalOpen, vehicle]);

    if (!isCheckInModalOpen || !vehicle || !activeRental) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = checkInFormSchema.safeParse({
            ...formData,
            rentalId: activeRental.id.toString(),
        });

        if (!result.success) {
            setErrors(result.error);
            return;
        }

        const { returnDate, returnKm: returnKmStr } = result.data;
        const returnKm = parseInt(returnKmStr);

        // Toplam maliyeti hesapla
        const startDate = new Date(activeRental.startDate);
        const endDate = new Date(returnDate);
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysRented = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
        const totalCost = activeRental.priceType === 'daily'
            ? daysRented * activeRental.price
            : (daysRented / 30) * activeRental.price;

        dispatch(completeRental({ rentalId: activeRental.id, returnDate, returnKm, totalCost }));
        dispatch(setVehicleStatusToAvailable({ vehiclePlate: vehicle.plate, returnKm }));
        dispatch(logActivity({ icon: 'fa-right-to-bracket', message: `<em>${vehicle.plate}</em> plakalı araç teslim alındı.` }));
        dispatch(closeModal({ type: 'checkIn' }));
    };

    const getError = (fieldName: string) => errors?.issues.find(issue => issue.path[0] === fieldName)?.message;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Araç Teslim Al: {vehicle.plate}</h2>
                    <button onClick={() => dispatch(closeModal({ type: 'checkIn' }))} className="close-modal-btn"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="returnDate">Teslim Tarihi</label>
                        <input type="date" id="returnDate" name="returnDate" value={formData.returnDate} onChange={handleChange} required />
                        {getError('returnDate') && <span className="error-message">{getError('returnDate')}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="returnKm">Dönüş Kilometresi</label>
                        <input type="text" id="returnKm" name="returnKm" value={formData.returnKm} onChange={handleChange} required />
                        {getError('returnKm') && <span className="error-message">{getError('returnKm')}</span>}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => dispatch(closeModal({ type: 'checkIn' }))}>İptal</button>
                        <button type="submit" className="btn btn-primary">Teslim Al</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckInModal;