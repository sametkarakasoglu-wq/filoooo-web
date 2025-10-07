import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectRentals, deleteRental } from '../features/rentals/rentalsSlice';
import { selectCustomers } from '../features/customers/customersSlice';
import { selectApp, setSearchTerm, openModal } from '../features/app/appSlice';
import { Rental } from '../types';
import { getStatusClass } from '../utils/utils';

// Alt Bileşen: RentalCard
const RentalCard: React.FC<{ rental: Rental & { customerName: string } }> = ({ rental }) => {
    const dispatch = useDispatch();

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '...';
        return new Date(dateString).toLocaleDateString('tr-TR');
    };

    const handleDelete = () => {
        if (confirm(`Bu kiralama kaydını silmek istediğinizden emin misiniz?`)) {
            dispatch(deleteRental(rental.id));
        }
    };

    const handlePrint = () => {
        // TODO: PDF oluşturma servisini çağır
        alert("PDF oluşturma özelliği henüz yeniden tasarlanmadı.");
    };

    return (
        <div className="rental-card" data-status={rental.status}>
            <div className="rental-card-header">
                <div className="rental-card-title">
                    <h3>{rental.vehiclePlate}</h3>
                    <span>- {rental.customerName}</span>
                </div>
                <div className={`status-badge ${getStatusClass(rental.status)}`}>
                    {rental.status === 'active' ? 'Aktif' : 'Tamamlandı'}
                </div>
            </div>
            <div className="rental-card-body">
                <div className="rental-info-item"><strong>Başlangıç:</strong><span>{formatDate(rental.startDate)}</span></div>
                <div className="rental-info-item"><strong>Bitiş:</strong><span>{formatDate(rental.endDate)}</span></div>
                <div className="rental-info-item"><strong>Başlangıç KM:</strong><span>{rental.startKm.toLocaleString('tr-TR')}</span></div>
                <div className="rental-info-item"><strong>Bitiş KM:</strong><span>{rental.endKm ? rental.endKm.toLocaleString('tr-TR') : '...'}</span></div>
                <div className="rental-info-item"><strong>Toplam Ücret:</strong><span>{rental.totalCost ? `₺${rental.totalCost.toLocaleString('tr-TR')}` : '...'}</span></div>
            </div>
            <div className="rental-card-footer">
                <div className="document-buttons">
                    {rental.contractFile ?
                        <a href={rental.contractFileUrl || '#'} target="_blank" className="btn-icon" title="Sözleşmeyi Görüntüle"><i className="fa-solid fa-file-contract"></i></a> :
                        <button className="btn-icon" onClick={() => dispatch(openModal({ type: 'rentalEdit', entity: rental.id }))} title="Sözleşme Yükle"><i className="fa-solid fa-upload"></i></button>
                    }
                    {rental.invoiceFile ?
                        <a href={rental.invoiceFileUrl || '#'} target="_blank" className="btn-icon" title="Faturayı Görüntüle"><i className="fa-solid fa-file-invoice-dollar"></i></a> :
                        <button className="btn-icon" onClick={() => dispatch(openModal({ type: 'rentalEdit', entity: rental.id }))} title="Fatura Yükle"><i className="fa-solid fa-upload"></i></button>
                    }
                    <button className="btn-icon" onClick={handlePrint} title="Özeti Yazdır/Kaydet"><i className="fa-solid fa-print"></i></button>
                </div>
                <div className="action-icons">
                    <button className="action-btn" onClick={() => dispatch(openModal({ type: 'rentalEdit', entity: rental.id }))} title="Düzenle"><i className="fa-solid fa-pencil"></i></button>
                    <button className="action-btn" onClick={handleDelete} title="Sil"><i className="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        </div>
    );
};

// Ana Bileşen: RentalsPage
const RentalsPage: React.FC = () => {
    const dispatch = useDispatch();
    const { searchTerm } = useSelector(selectApp);
    const rentals = useSelector(selectRentals);
    const customers = useSelector(selectCustomers);

    const customerMap = useMemo(() => {
        return new Map(customers.map(c => [c.id, c.name]));
    }, [customers]);

    const filteredRentals = useMemo(() => {
        return rentals
            .map(rental => ({
                ...rental,
                customerName: customerMap.get(rental.customerId) || 'Bilinmeyen Müşteri'
            }))
            .filter(rental =>
                rental.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rental.customerName.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [rentals, searchTerm, customerMap]);

    return (
        <>
            <header className="page-header">
                <h1>Kiralama Geçmişi</h1>
                <p>Tüm aktif ve tamamlanmış kiralamaları görüntüleyin.</p>
            </header>
            <div className="page-actions">
                <div className="search-bar">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        id="rental-search"
                        placeholder="Plaka veya müşteri adı ara..."
                        value={searchTerm}
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                    />
                </div>
            </div>
            <div className="rentals-list">
                {filteredRentals.length > 0 ? (
                    filteredRentals.map(rental => <RentalCard key={rental.id} rental={rental} />)
                ) : (
                    <p className="no-data-item">Henüz kiralama kaydı bulunmuyor.</p>
                )}
            </div>
        </>
    );
};

export default RentalsPage;