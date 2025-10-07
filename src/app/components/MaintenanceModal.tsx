import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectApp, closeModal } from '../features/app/appSlice';
import { selectVehicles } from '../features/vehicles/vehiclesSlice';
import { addMaintenance } from '../features/maintenance/maintenanceSlice';
import { logActivity } from '../features/activities/activitiesSlice';
import { Maintenance } from '../types';
import { maintenanceFormSchema } from '../schemas';
import { z } from 'zod';

const MaintenanceModal: React.FC = () => {
    const dispatch = useDispatch();
    const { isMaintenanceModalOpen } = useSelector(selectApp);
    const vehicles = useSelector(selectVehicles);

    const [formData, setFormData] = useState({
        vehiclePlate: '',
        maintenanceDate: new Date().toISOString().split('T')[0],
        maintenanceKm: '',
        type: 'Genel Bakım',
        cost: '',
        description: '',
        nextMaintenanceKm: '',
        nextMaintenanceDate: '',
    });
    const [errors, setErrors] = useState<z.ZodError | null>(null);

    useEffect(() => {
        if (isMaintenanceModalOpen) {
            // Reset form on open
            setFormData({
                vehiclePlate: '',
                maintenanceDate: new Date().toISOString().split('T')[0],
                maintenanceKm: '',
                type: 'Genel Bakım',
                cost: '',
                description: '',
                nextMaintenanceKm: '',
                nextMaintenanceDate: '',
            });
            setErrors(null);
        }
    }, [isMaintenanceModalOpen]);

    const handleKmChange = (km: string) => {
        const currentKm = parseInt(km.replace(/[^0-9]/g, '')) || 0;
        const nextKm = currentKm + 15000;
        setFormData(prev => ({
            ...prev,
            maintenanceKm: km,
            nextMaintenanceKm: nextKm.toString(),
        }));
    };

    const handleDateChange = (date: string) => {
        const nextDate = new Date(date);
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        setFormData(prev => ({
            ...prev,
            maintenanceDate: date,
            nextMaintenanceDate: nextDate.toISOString().split('T')[0],
        }));
    };

    if (!isMaintenanceModalOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = maintenanceFormSchema.safeParse(formData);
        if (!result.success) {
            setErrors(result.error);
            return;
        }

        const data = result.data;
        const newMaintenance: Maintenance = {
            id: Date.now(),
            vehiclePlate: data.vehiclePlate,
            maintenanceDate: data.maintenanceDate,
            maintenanceKm: parseInt(data.maintenanceKm),
            type: data.type,
            cost: parseFloat(data.cost),
            description: data.description || '',
            nextMaintenanceKm: parseInt(data.nextMaintenanceKm),
            nextMaintenanceDate: data.nextMaintenanceDate,
        };

        dispatch(addMaintenance(newMaintenance));
        dispatch(logActivity({ icon: 'fa-oil-can', message: `<em>${newMaintenance.vehiclePlate}</em> plakalı araca bakım kaydı girildi.` }));
        dispatch(closeModal({ type: 'maintenance' }));
    };

    const getError = (fieldName: string) => errors?.issues.find(issue => issue.path[0] === fieldName)?.message;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Yeni Bakım Kaydı</h2>
                    <button onClick={() => dispatch(closeModal({ type: 'maintenance' }))} className="close-modal-btn"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="vehiclePlate">Araç</label>
                        <select name="vehiclePlate" value={formData.vehiclePlate} onChange={(e) => setFormData({...formData, vehiclePlate: e.target.value})} required>
                            <option value="" disabled>Araç Seçiniz...</option>
                            {vehicles.map(v => <option key={v.plate} value={v.plate}>{v.brand} ({v.plate})</option>)}
                        </select>
                        {getError('vehiclePlate') && <span className="error-message">{getError('vehiclePlate')}</span>}
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                             <label htmlFor="maintenanceDate">Bakım Tarihi</label>
                             <input type="date" name="maintenanceDate" value={formData.maintenanceDate} onChange={(e) => handleDateChange(e.target.value)} required />
                             {getError('maintenanceDate') && <span className="error-message">{getError('maintenanceDate')}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="maintenanceKm">Bakım Kilometresi</label>
                            <input type="text" name="maintenanceKm" value={formData.maintenanceKm} onChange={(e) => handleKmChange(e.target.value)} required />
                            {getError('maintenanceKm') && <span className="error-message">{getError('maintenanceKm')}</span>}
                        </div>
                    </div>
                    {/* Other fields... */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => dispatch(closeModal({ type: 'maintenance' }))}>İptal</button>
                        <button type="submit" className="btn btn-primary">Kaydı Ekle</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaintenanceModal;