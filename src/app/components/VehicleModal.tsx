import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectApp, closeModal } from '../features/app/appSlice';
import { selectVehicles, addVehicle, updateVehicle } from '../features/vehicles/vehiclesSlice';
import { Vehicle } from '../types';
import { vehicleFormSchema } from '../schemas';
import { z } from 'zod';

const VehicleModal: React.FC = () => {
    const dispatch = useDispatch();
    const { isVehicleModalOpen, editingVehicleIndex } = useSelector(selectApp);
    const vehicles = useSelector(selectVehicles);

    const isEditing = editingVehicleIndex !== null;
    const vehicleToEdit = isEditing ? vehicles[editingVehicleIndex] : null;

    const [formData, setFormData] = useState({
        plate: '',
        brand: '',
        model: '',
        km: '',
        status: 'Müsait',
        insuranceDate: '',
        inspectionDate: '',
    });
    const [errors, setErrors] = useState<z.ZodError | null>(null);

    useEffect(() => {
        if (isEditing && vehicleToEdit) {
            const [brand, ...modelParts] = vehicleToEdit.brand.split(' ');
            setFormData({
                plate: vehicleToEdit.plate,
                brand: brand || '',
                model: modelParts.join(' '),
                km: vehicleToEdit.km.replace(/[^0-9]/g, ''),
                status: vehicleToEdit.status,
                insuranceDate: vehicleToEdit.insuranceDate || '',
                inspectionDate: vehicleToEdit.inspectionDate || '',
            });
        } else {
            setFormData({
                plate: '', brand: '', model: '', km: '', status: 'Müsait', insuranceDate: '', inspectionDate: ''
            });
        }
        setErrors(null);
    }, [isVehicleModalOpen, editingVehicleIndex, vehicleToEdit]);

    if (!isVehicleModalOpen) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = vehicleFormSchema.safeParse(formData);

        if (!result.success) {
            setErrors(result.error);
            return;
        }

        const vehicleData: Omit<Vehicle, 'rentedBy' | 'activeRentalId' | 'insuranceFile' | 'inspectionFile' | 'licenseFile' | 'insuranceFileUrl' | 'inspectionFileUrl' | 'licenseFileUrl'> = {
            plate: result.data.plate,
            brand: `${result.data.brand} ${result.data.model}`,
            km: parseInt(result.data.km).toLocaleString('tr-TR'),
            status: result.data.status as any,
            insuranceDate: result.data.insuranceDate || null,
            inspectionDate: result.data.inspectionDate || null,
        };

        if (isEditing) {
            dispatch(updateVehicle({ vehicleIndex: editingVehicleIndex!, vehicleData }));
        } else {
            dispatch(addVehicle(vehicleData as Vehicle));
        }

        dispatch(closeModal({ type: 'vehicle' }));
    };

    const getError = (fieldName: string) => errors?.issues.find(issue => issue.path[0] === fieldName)?.message;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isEditing ? 'Aracı Düzenle' : 'Yeni Araç Ekle'}</h2>
                    <button onClick={() => dispatch(closeModal({ type: 'vehicle' }))} className="close-modal-btn"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit} noValidate>
                    {/* Form Alanları */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="plate">Plaka</label>
                            <input type="text" id="plate" name="plate" value={formData.plate} onChange={handleChange} required readOnly={isEditing} />
                            {getError('plate') && <span className="error-message">{getError('plate')}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="km">Kilometre</label>
                            <input type="text" id="km" name="km" value={formData.km} onChange={handleChange} required />
                            {getError('km') && <span className="error-message">{getError('km')}</span>}
                        </div>
                    </div>
                     <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="brand">Marka</label>
                            <input type="text" id="brand" name="brand" value={formData.brand} onChange={handleChange} required />
                            {getError('brand') && <span className="error-message">{getError('brand')}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="model">Model</label>
                            <input type="text" id="model" name="model" value={formData.model} onChange={handleChange} required />
                            {getError('model') && <span className="error-message">{getError('model')}</span>}
                        </div>
                    </div>
                    {/* Diğer form alanları buraya eklenecek */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => dispatch(closeModal({ type: 'vehicle' }))}>İptal</button>
                        <button type="submit" className="btn btn-primary">{isEditing ? 'Değişiklikleri Kaydet' : 'Aracı Kaydet'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VehicleModal;