import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCustomers, deleteCustomer } from '../features/customers/customersSlice';
import { selectApp, setSearchTerm, openModal } from '../features/app/appSlice';
import { Customer } from '../types';
import { getStatusClass } from '../utils/utils';

// Alt Bileşen: CustomerAccordion
const CustomerAccordion: React.FC<{ customer: Customer & { originalIndex: number } }> = ({ customer }) => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);

    const totalRentals = customer.rentals?.length || 0;
    const hasActiveRental = customer.rentals?.some(r => r.status === 'active') || false;
    const initials = customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const handleDelete = () => {
        if (confirm(`'${customer.name}' adlı müşteriyi silmek istediğinizden emin misiniz?`)) {
            dispatch(deleteCustomer(customer.originalIndex));
        }
    };

    return (
        <div className={`customer-accordion ${isOpen ? 'active' : ''}`}>
            <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="customer-card-top">
                    <div className="customer-avatar">{initials}</div>
                    <div className="customer-summary">
                        <span className="customer-name">{customer.name}</span>
                        <span className="customer-phone">{customer.phone}</span>
                    </div>
                    <i className={`fa-solid fa-chevron-down accordion-arrow ${isOpen ? 'open' : ''}`}></i>
                </div>
                <div className="customer-card-stats">
                    <div className="stat-item">
                        <i className="fa-solid fa-file-contract"></i>
                        <span>{totalRentals} Kiralama</span>
                    </div>
                    <div className={`stat-item ${hasActiveRental ? 'active-rental' : 'no-active-rental'}`}>
                        <i className={`fa-solid ${hasActiveRental ? 'fa-key' : 'fa-check'}`}></i>
                        <span>{hasActiveRental ? 'Aktif Kiralaması Var' : 'Aktif Kiralaması Yok'}</span>
                    </div>
                </div>
            </button>
            <div className="accordion-content" style={{ maxHeight: isOpen ? '1000px' : '0' }}>
                 <div className="customer-details-grid">
                    <div className="detail-item"><strong>TC Kimlik No:</strong><span>{customer.tc}</span></div>
                    <div className="detail-item"><strong>Email:</strong><span>{customer.email || '-'}</span></div>
                    <div className="detail-item"><strong>Ehliyet No:</strong><span>{customer.licenseNumber || '-'}</span></div>
                    <div className="detail-item"><strong>Ehliyet Tarihi:</strong><span>{customer.licenseDate || '-'}</span></div>
                    <div className="detail-item full-width"><strong>Adres:</strong><span>{customer.address || '-'}</span></div>
                </div>
                {/* Diğer bölümler buraya eklenebilir (Belgeler, Kiralama Geçmişi) */}
                 <div className="accordion-section accordion-footer-actions">
                    <button className="btn btn-secondary" onClick={() => dispatch(openModal({ type: 'customer', entity: customer.originalIndex }))}>
                        <i className="fa-solid fa-user-pen"></i> Müşteriyi Düzenle
                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>
                        <i className="fa-solid fa-user-slash"></i> Müşteriyi Sil
                    </button>
                </div>
            </div>
        </div>
    );
};


// Ana Bileşen: CustomersPage
const CustomersPage: React.FC = () => {
    const dispatch = useDispatch();
    const { searchTerm } = useSelector(selectApp);
    const customers = useSelector(selectCustomers);

    const filteredCustomers = useMemo(() => {
        return customers
            .map((c, index) => ({ ...c, originalIndex: index }))
            .filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.tc.includes(searchTerm) ||
                c.phone.includes(searchTerm)
            );
    }, [customers, searchTerm]);

    return (
        <>
            <header className="page-header">
                <h1>Müşteri Yönetimi</h1>
                <p>Tüm müşterilerinizi görüntüleyin ve yönetin.</p>
            </header>
            <div className="page-actions">
                <div className="search-bar">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        id="customer-search"
                        placeholder="Müşteri adı, TC veya telefon ara..."
                        value={searchTerm}
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                    />
                </div>
                <button className="btn btn-primary" onClick={() => dispatch(openModal({ type: 'customer' }))}>
                    <i className="fa-solid fa-user-plus"></i>
                    Yeni Müşteri Ekle
                </button>
            </div>
            <div className="customer-list">
                {filteredCustomers.map((customer) => (
                    <CustomerAccordion key={customer.originalIndex} customer={customer} />
                ))}
            </div>
        </>
    );
};

export default CustomersPage;