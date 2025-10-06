import type { Customer } from '../types';

interface CustomersPageProps {
    state: any;
    customersData: Customer[];
}

const CustomersPage = ({ state, customersData }: CustomersPageProps): string => {
    return `
    <header class="page-header">
        <h1>Müşteri Yönetimi</h1>
        <p>Tüm müşterilerinizi görüntüleyin ve yönetin.</p>
    </header>
    <div class="page-actions">
        <div class="search-bar">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="customer-search" placeholder="Müşteri adı, TC veya telefon ara..." value="${state.searchTerm}">
        </div>
        <button class="btn btn-primary" id="add-customer-btn">
            <i class="fa-solid fa-user-plus"></i>
            Yeni Müşteri Ekle
        </button>
    </div>
    <div class="customer-list">
        ${customersData
            .map((c, index) => ({ ...c, originalIndex: index }))
            .filter(c =>
                c.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                c.tc.includes(state.searchTerm) ||
                c.phone.includes(state.searchTerm)
            ).map((customer) => {
                const totalRentals = customer.rentals.length;
                const hasActiveRental = customer.rentals.some(r => r.status === 'Aktif');
                const initials = customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                return `
            <div class="customer-accordion" data-customer-index="${customer.originalIndex}">
                <button class="accordion-header">
                    <div class="customer-card-top">
                        <div class="customer-avatar">${initials}</div>
                        <div class="customer-summary">
                            <span class="customer-name">${customer.name}</span>
                            <span class="customer-phone">${customer.phone}</span>
                        </div>
                        <i class="fa-solid fa-chevron-down accordion-arrow"></i>
                    </div>
                    <div class="customer-card-stats">
                        <div class="stat-item">
                            <i class="fa-solid fa-file-contract"></i>
                            <span>${totalRentals} Kiralama</span>
                        </div>
                        <div class="stat-item ${hasActiveRental ? 'active-rental' : 'no-active-rental'}">
                            <i class="fa-solid ${hasActiveRental ? 'fa-key' : 'fa-check'}"></i>
                            <span>${hasActiveRental ? 'Aktif Kiralaması Var' : 'Aktif Kiralaması Yok'}</span>
                        </div>
                    </div>
                </button>
                <div class="accordion-content">
                    <div class="customer-details-grid">
                        <div class="detail-item"><strong>TC Kimlik No:</strong><span>${customer.tc}</span></div>
                        <div class="detail-item"><strong>Email:</strong><span>${customer.email || '-'}</span></div>
                        <div class="detail-item"><strong>Ehliyet No:</strong><span>${customer.licenseNumber || '-'}</span></div>
                        <div class="detail-item"><strong>Ehliyet Tarihi:</strong><span>${customer.licenseDate || '-'}</span></div>
                        <div class="detail-item full-width"><strong>Adres:</strong><span>${customer.address || '-'}</span></div>
                    </div>

                    <div class="accordion-section">
                        <div class="accordion-section-header">
                            <h4>Belgeler</h4>
                        </div>
                        <div class="card-documents">
                            <div class="document-item">
                                <div class="document-info"><i class="fa-solid fa-id-card"></i><span>Kimlik</span></div>
                                ${customer.idFile ?
                                    `<a href="${customer.idFileUrl || '#'}" target="_blank" class="btn-view" title="${customer.idFile}"><i class="fa-solid fa-eye"></i> Görüntüle</a>` :
                                    `<button class="btn-upload btn-edit-customer"><i class="fa-solid fa-upload"></i> Yükle</button>`}
                            </div>
                            <div class="document-item">
                                <div class="document-info"><i class="fa-solid fa-id-card-clip"></i><span>Ehliyet</span></div>
                                ${customer.licenseFile ?
                                    `<a href="${customer.licenseFileUrl || '#'}" target="_blank" class="btn-view" title="${customer.licenseFile}"><i class="fa-solid fa-eye"></i> Görüntüle</a>` :
                                    `<button class="btn-upload btn-edit-customer"><i class="fa-solid fa-upload"></i> Yükle</button>`}
                            </div>
                        </div>
                    </div>

                    <div class="accordion-section">
                        <div class="accordion-section-header">
                            <h4>Kiralama Geçmişi</h4>
                        </div>
                        ${customer.rentals.length > 0 ? `
                            <table class="rental-history-table">
                                <thead>
                                    <tr>
                                        <th>Plaka</th>
                                        <th>Tarih Aralığı</th>
                                        <th>Durum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${customer.rentals.map(rental => `
                                        <tr>
                                            <td>${rental.plate}</td>
                                            <td>${rental.date}</td>
                                            <td><span class="status-badge ${rental.status === 'Tamamlandı' ? 'available' : 'rented'}">${rental.status}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : '<p class="no-history">Bu müşterinin kiralama geçmişi bulunmuyor.</p>'}
                    </div>
                    <div class="accordion-section accordion-footer-actions">
                        <button class="btn btn-secondary btn-edit-customer">
                            <i class="fa-solid fa-user-pen"></i> Müşteriyi Düzenle
                        </button>
                        <button class="btn btn-danger btn-delete-customer">
                            <i class="fa-solid fa-user-slash"></i> Müşteriyi Sil
                        </button>
                    </div>
                </div>
            </div>
        `}).join('')}
    </div>
    `;
};

export default CustomersPage;