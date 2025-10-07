import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectApp, closeModal } from '../features/app/appSlice';
import { selectCustomers, addCustomer, updateCustomer } from '../features/customers/customersSlice';
import { Customer } from '../types';
import { customerFormSchema } from '../schemas';
import { z } from 'zod';

const CustomerModal: React.FC = () => {
    const dispatch = useDispatch();
    const { isCustomerModalOpen, editingCustomerIndex } = useSelector(selectApp);
    const customers = useSelector(selectCustomers);

    const isEditing = editingCustomerIndex !== null;
    const customerToEdit = isEditing ? customers[editingCustomerIndex] : null;

    const [formData, setFormData] = useState({
        name: '', tc: '', phone: '', email: '', licenseNumber: '', licenseDate: '', address: ''
    });
    const [errors, setErrors] = useState<z.ZodError | null>(null);

    useEffect(() => {
        if (isEditing && customerToEdit) {
            setFormData({
                name: customerToEdit.name,
                tc: customerToEdit.tc,
                phone: customerToEdit.phone,
                email: customerToEdit.email || '',
                licenseNumber: customerToEdit.licenseNumber || '',
                licenseDate: customerToEdit.licenseDate || '',
                address: customerToEdit.address || '',
            });
        } else {
            setFormData({ name: '', tc: '', phone: '', email: '', licenseNumber: '', licenseDate: '', address: '' });
        }
        setErrors(null);
    }, [isCustomerModalOpen, editingCustomerIndex, customerToEdit]);

    if (!isCustomerModalOpen) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = customerFormSchema.safeParse(formData);
        if (!result.success) {
            setErrors(result.error);
            return;
        }

        const customerData: Omit<Customer, 'id' | 'rentals' | 'idFile' | 'idFileUrl' | 'licenseFile' | 'licenseFileUrl'> = result.data;

        if (isEditing) {
            dispatch(updateCustomer({ customerIndex: editingCustomerIndex!, customerData }));
        } else {
            const newCustomer: Customer = {
                id: Date.now(),
                ...customerData,
                rentals: [],
                idFile: null, idFileUrl: null, licenseFile: null, licenseFileUrl: null,
            };
            dispatch(addCustomer(newCustomer));
        }

        dispatch(closeModal({ type: 'customer' }));
    };

    const getError = (fieldName: string) => errors?.issues.find(issue => issue.path[0] === fieldName)?.message;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isEditing ? 'Müşteriyi Düzenle' : 'Yeni Müşteri Ekle'}</h2>
                    <button onClick={() => dispatch(closeModal({ type: 'customer' }))} className="close-modal-btn"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="name">İsim Soyisim</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                        {getError('name') && <span className="error-message">{getError('name')}</span>}
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="tc">TC Kimlik No</label>
                            <input type="text" id="tc" name="tc" value={formData.tc} onChange={handleChange} required />
                            {getError('tc') && <span className="error-message">{getError('tc')}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Telefon</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                            {getError('phone') && <span className="error-message">{getError('phone')}</span>}
                        </div>
                    </div>
                    {/* Diğer alanlar buraya eklenecek */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => dispatch(closeModal({ type: 'customer' }))}>İptal</button>
                        <button type="submit" className="btn btn-primary">{isEditing ? 'Değişiklikleri Kaydet' : 'Müşteriyi Kaydet'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerModal;