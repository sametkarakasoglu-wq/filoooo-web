import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectApp, closeModal } from '../features/app/appSlice';
import { selectMaintenance, updateMaintenance } from '../features/maintenance/maintenanceSlice';
import { Maintenance } from '../types';
// TODO: Add Zod validation for maintenance edit form

const MaintenanceEditModal: React.FC = () => {
    const dispatch = useDispatch();
    const { isMaintenanceEditModalOpen, editingMaintenanceId } = useSelector(selectApp);
    const maintenances = useSelector(selectMaintenance);

    const maintenanceToEdit = maintenances.find(m => m.id === editingMaintenanceId);

    const [formData, setFormData] = useState({
        vehiclePlate: '',
        maintenanceDate: '',
        maintenanceKm: '',
        type: '',
        cost: '',
        description: '',
        nextMaintenanceKm: '',
        nextMaintenanceDate: '',
    });

    useEffect(() => {
        if (isMaintenanceEditModalOpen && maintenanceToEdit) {
            setFormData({
                vehiclePlate: maintenanceToEdit.vehiclePlate,
                maintenanceDate: maintenanceToEdit.maintenanceDate,
                maintenanceKm: maintenanceToEdit.maintenanceKm.toString(),
                type: maintenanceToEdit.type,
                cost: maintenanceToEdit.cost.toString(),
                description: maintenanceToEdit.description,
                nextMaintenanceKm: maintenanceToEdit.nextMaintenanceKm.toString(),
                nextMaintenanceDate: maintenanceToEdit.nextMaintenanceDate,
            });
        }
    }, [isMaintenanceEditModalOpen, maintenanceToEdit]);

    if (!isMaintenanceEditModalOpen || !maintenanceToEdit) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add validation here
        const updatedData: Partial<Maintenance> = {
            ...formData,
            maintenanceKm: parseInt(formData.maintenanceKm),
            cost: parseFloat(formData.cost),
            nextMaintenanceKm: parseInt(formData.nextMaintenanceKm),
        };
        dispatch(updateMaintenance({ id: maintenanceToEdit.id, ...updatedData }));
        dispatch(closeModal({ type: 'maintenanceEdit' }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Bakım Kaydını Düzenle</h2>
                    <button onClick={() => dispatch(closeModal({ type: 'maintenanceEdit' }))} className="close-modal-btn"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit}>
                    {/* Form Fields */}
                    <div className="form-group">
                        <label htmlFor="vehiclePlate">Araç Plakası</label>
                        <input type="text" id="vehiclePlate" name="vehiclePlate" value={formData.vehiclePlate} readOnly />
                    </div>
                    {/* Other fields... */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => dispatch(closeModal({ type: 'maintenanceEdit' }))}>İptal</button>
                        <button type="submit" className="btn btn-primary">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaintenanceEditModal;