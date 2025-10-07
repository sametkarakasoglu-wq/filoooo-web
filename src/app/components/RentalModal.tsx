import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectApp, closeModal, setRentalFormCustomerType } from '../features/app/appSlice';
import { selectCustomers, addCustomer } from '../features/customers/customersSlice';
import { addRental } from '../features/rentals/rentalsSlice';
import { setVehicleStatusToRented } from '../features/vehicles/vehiclesSlice';
import { logActivity } from '../features/activities/activitiesSlice';
import { Customer, Rental, Vehicle } from '../types';
import { rentalFormSchema } from '../schemas';
import { z } from 'zod';

const RentalModal: React.FC = () => {
    const dispatch = useDispatch();
    const { isRentalModalOpen, selectedVehicleForAction, rentalFormCustomerType } = useSelector(selectApp);
    const customers = useSelector(selectCustomers);

    const vehicle = selectedVehicleForAction as Vehicle | null;

    const [formData, setFormData] = useState({
        customerType: rentalFormCustomerType,
        customerId: '',
        newCustomerName: '',
        newCustomerTc: '',
        newCustomerPhone: '',
        newCustomerEmail: '',
        startDate: new Date().toISOString().split('T')[0],
        startKm: vehicle?.km.replace(/[^0-9]/g, '') || '',
        price: '',
        priceType: 'daily',
    });
    const [errors, setErrors] = useState<z.ZodError | null>(null);

    useEffect(() => {
        if (isRentalModalOpen) {
            setFormData(prev => ({
                ...prev,
                customerType: 'existing',
                customerId: '',
                newCustomerName: '',
                newCustomerTc: '',
                newCustomerPhone: '',
                newCustomerEmail: '',
                startDate: new Date().toISOString().split('T')[0],
                startKm: vehicle?.km.replace(/[^0-g]/g, '') || '',
            }));
            setErrors(null);
        }
    }, [isRentalModalOpen, vehicle]);

    if (!isRentalModalOpen || !vehicle) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'customerType') {
            dispatch(setRentalFormCustomerType(value as 'existing' | 'new'));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToValidate = {
            ...formData,
            vehiclePlate: vehicle.plate,
        };
        const result = rentalFormSchema.safeParse(dataToValidate);

        if (!result.success) {
            setErrors(result.error);
            return;
        }

        const { data } = result;
        let finalCustomerId: number;
        let customerName: string;

        if (data.customerType === 'new') {
            const newCustomer: Customer = {
                id: Date.now(),
                name: data.newCustomerName!,
                tc: data.newCustomerTc!,
                phone: data.newCustomerPhone!,
                email: data.newCustomerEmail || '',
                address: '', licenseNumber: '', licenseDate: '',
                idFile: null, idFileUrl: null, licenseFile: null, licenseFileUrl: null,
                rentals: [],
            };
            dispatch(addCustomer(newCustomer));
            finalCustomerId = newCustomer.id;
            customerName = newCustomer.name;
        } else {
            finalCustomerId = parseInt(data.customerId!, 10);
            customerName = customers.find(c => c.id === finalCustomerId)?.name || 'Bilinmeyen';
        }

        const newRental: Rental = {
            id: Date.now(),
            vehiclePlate: vehicle.plate,
            customerId: finalCustomerId,
            startDate: data.startDate,
            startKm: parseInt(data.startKm.replace(/[,.]/g, '')),
            price: parseFloat(data.price),
            priceType: data.priceType as 'daily' | 'monthly',
            status: 'active',
            endDate: null, endKm: null, totalCost: null,
            contractFile: null, contractFileUrl: null, invoiceFile: null, invoiceFileUrl: null,
        };

        dispatch(addRental(newRental));
        dispatch(setVehicleStatusToRented({ vehiclePlate: vehicle.plate, customerName, customerPhone: data.newCustomerPhone || '', rentalId: newRental.id }));
        dispatch(logActivity({ icon: 'fa-file-signature', message: `<strong>${customerName}</strong>, <em>${vehicle.plate}</em> plakalı aracı kiraladı.` }));
        dispatch(closeModal({ type: 'rental' }));
    };

    const getError = (fieldName: string) => errors?.issues.find(issue => issue.path[0] === fieldName)?.message;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Kiralama Başlat: {vehicle.plate}</h2>
                    <button onClick={() => dispatch(closeModal({ type: 'rental' }))} className="close-modal-btn"><i className="fa-solid fa-xmark"></i></button>
                </div>
                <form className="modal-form" onSubmit={handleSubmit} noValidate>
                    {/* Customer Type Toggle */}
                    <div className="form-group">
                        <label>Müşteri Tipi</label>
                        <div className="radio-group">
                            <label><input type="radio" name="customerType" value="existing" checked={formData.customerType === 'existing'} onChange={handleChange} /> Mevcut Müşteri</label>
                            <label><input type="radio" name="customerType" value="new" checked={formData.customerType === 'new'} onChange={handleChange} /> Yeni Müşteri</label>
                        </div>
                    </div>

                    {/* Existing Customer */}
                    {formData.customerType === 'existing' && (
                        <div className="form-group">
                            <label htmlFor="customerId">Müşteri Seç</label>
                            <select id="customerId" name="customerId" value={formData.customerId} onChange={handleChange} required>
                                <option value="" disabled>Lütfen bir müşteri seçin...</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.tc})</option>)}
                            </select>
                            {getError('customerId') && <span className="error-message">{getError('customerId')}</span>}
                        </div>
                    )}

                    {/* New Customer Fields */}
                    {formData.customerType === 'new' && (
                        <div id="new-customer-fields">
                             <div className="form-group">
                                <label htmlFor="newCustomerName">Yeni Müşteri Adı</label>
                                <input type="text" id="newCustomerName" name="newCustomerName" value={formData.newCustomerName} onChange={handleChange} required />
                                {getError('newCustomerName') && <span className="error-message">{getError('newCustomerName')}</span>}
                            </div>
                            {/* Diğer yeni müşteri alanları */}
                        </div>
                    )}

                    {/* Diğer Kiralama Alanları */}

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => dispatch(closeModal({ type: 'rental' }))}>İptal</button>
                        <button type="submit" className="btn btn-primary">Kiralamayı Başlat</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RentalModal;