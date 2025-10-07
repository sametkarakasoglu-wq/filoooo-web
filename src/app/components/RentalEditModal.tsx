import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectApp, closeModal } from '../features/app/appSlice';
import { selectRentals, updateRental } from '../features/rentals/rentalsSlice';
import { Rental } from '../types';

const RentalEditModal: React.FC = () => {
    const dispatch = useDispatch();
    const { isRentalEditModalOpen, editingRentalId } = useSelector(selectApp);
    const rentals = useSelector(selectRentals);

    const rentalToEdit = rentals.find(r => r.id === editingRentalId);

    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        startKm: '',
        endKm: '',
    });

    useEffect(() => {
        if (isRentalEditModalOpen && rentalToEdit) {
            setFormData({
                startDate: rentalToEdit.startDate,
                endDate: rentalToEdit.endDate || '',
                startKm: rentalToEdit.startKm.toString(),
                endKm: rentalToEdit.endKm?.toString() || '',
            });
        }
    }, [isRentalEditModalOpen, rentalToEdit]);

    if (!isRentalEditModalOpen || !rentalToEdit) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add Zod validation for rental edit form
        const updatedData: Partial<Rental> = {
            startDate: formData.startDate,
            endDate: formData.endDate || null,
            startKm: parseInt(formData.startKm),
            endKm: formData.endKm ? parseInt(formData.endKm) : null,
        };
        dispatch(updateRental({ id: rentalToEdit.id, ...updatedData }));
        dispatch(closeModal({ type: 'rentalEdit' }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Kiralama Kaydını Düzenle</h2>
                    <button onClick={() => dispatch(closeModal({ type: 'rentalEdit' }))} className="close-modal-btn"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit}>
                    {/* Form Fields */}
                    <div className="form-group">
                        <label htmlFor="startDate">Başlangıç Tarihi</label>
                        <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="endDate">Bitiş Tarihi</label>
                        <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} />
                    </div>
                    {/* Other fields... */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => dispatch(closeModal({ type: 'rentalEdit' }))}>İptal</button>
                        <button type="submit" className="btn btn-primary">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RentalEditModal;