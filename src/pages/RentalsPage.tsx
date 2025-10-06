import type { Customer, Rental } from '../types';
import { getStatusClass } from '../utils';

interface RentalsPageProps {
    state: any;
    customersData: Customer[];
    rentalsData: Rental[];
}

const RentalsPage = ({ state, customersData, rentalsData }: RentalsPageProps): string => {
    const getCustomerName = (customerId: number) => {
        const customer = customersData.find(c => c.id === customerId);
        return customer ? customer.name : 'Bilinmeyen Müşteri';
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '...';
        return new Date(dateString).toLocaleDateString('tr-TR');
    };

    return `
    <header class="page-header">
        <h1>Kiralama Geçmişi</h1>
        <p>Tüm aktif ve tamamlanmış kiralamaları görüntüleyin.</p>
    </header>
    <div class="page-actions">
        <div class="search-bar">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="rental-search" placeholder="Plaka veya müşteri adı ara..." value="${state.searchTerm}">
        </div>
    </div>
    <div class="rentals-list">
        ${rentalsData
            .map(rental => {
                const customerName = getCustomerName(rental.customerId);
                return { ...rental, customerName };
            })
            .filter(rental =>
                rental.vehiclePlate.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                rental.customerName.toLowerCase().includes(state.searchTerm.toLowerCase())
            )
            .map(rental => `
            <div class="rental-card" data-rental-id="${rental.id}" data-status="${rental.status}">
                <div class="rental-card-header">
                    <div class="rental-card-title">
                        <h3>${rental.vehiclePlate}</h3>
                        <span>- ${rental.customerName}</span>
                    </div>
                    <div class="status-badge ${getStatusClass(rental.status)}">
                        ${rental.status === 'active' ? 'Aktif' : 'Tamamlandı'}
                    </div>
                </div>
                <div class="rental-card-body">
                    <div class="rental-info-item">
                        <strong>Başlangıç:</strong>
                        <span>${formatDate(rental.startDate)}</span>
                    </div>
                    <div class="rental-info-item">
                        <strong>Bitiş:</strong>
                        <span>${formatDate(rental.endDate)}</span>
                    </div>
                    <div class="rental-info-item">
                        <strong>Başlangıç KM:</strong>
                        <span>${rental.startKm.toLocaleString('tr-TR')}</span>
                    </div>
                    <div class="rental-info-item">
                        <strong>Bitiş KM:</strong>
                        <span>${rental.endKm ? rental.endKm.toLocaleString('tr-TR') : '...'}</span>
                    </div>
                    <div class="rental-info-item">
                        <strong>Toplam Ücret:</strong>
                        <span>${rental.totalCost ? `₺${rental.totalCost.toLocaleString('tr-TR')}` : '...'}</span>
                    </div>
                </div>
                <div class="rental-card-footer">
                    <div class="document-buttons">
                        ${rental.contractFile ?
                            `<a href="${rental.contractFileUrl || '#'}" target="_blank" class="btn-icon" title="Sözleşmeyi Görüntüle"><i class="fa-solid fa-file-contract"></i></a>` :
                            `<button class="btn-icon btn-upload-rental-doc" title="Sözleşme Yükle"><i class="fa-solid fa-upload"></i></button>`
                        }
                        ${rental.invoiceFile ?
                            `<a href="${rental.invoiceFileUrl || '#'}" target="_blank" class="btn-icon" title="Faturayı Görüntüle"><i class="fa-solid fa-file-invoice-dollar"></i></a>` :
                            `<button class="btn-icon btn-upload-rental-doc" title="Fatura Yükle"><i class="fa-solid fa-upload"></i></button>`
                        }
                        <button class="btn-icon btn-print-summary" title="Özeti Yazdır/Kaydet"><i class="fa-solid fa-print"></i></button>
                    </div>
                    <div class="action-icons">
                        <button class="action-btn btn-edit-rental" title="Düzenle"><i class="fa-solid fa-pencil"></i></button>
                        <button class="action-btn btn-delete-rental" title="Sil"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            </div>
        `).join('')}
        ${rentalsData.length === 0 ? '<p class="no-data-item">Henüz kiralama kaydı bulunmuyor.</p>' : ''}
    </div>
    `;
};

export default RentalsPage;