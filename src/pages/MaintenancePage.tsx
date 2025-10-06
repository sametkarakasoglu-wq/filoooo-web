import type { Maintenance } from '../types';

interface MaintenancePageProps {
    state: any;
    maintenanceData: Maintenance[];
}

const MaintenancePage = ({ state, maintenanceData }: MaintenancePageProps): string => {
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('tr-TR');
    const formatKm = (km: number) => km.toLocaleString('tr-TR') + ' KM';

    return `
    <header class="page-header">
        ${state.searchTerm ? `<div class="filter-indicator">
            <i class="fa-solid fa-filter"></i> <span>Filtreleniyor: <strong>${state.searchTerm}</strong></span>
            <button id="clear-maintenance-filter" title="Filtreyi Temizle"><i class="fa-solid fa-xmark"></i></button>
        </div>` : ''}
        <h1>Bakım Geçmişi</h1>
        <p>Araçların bakım kayıtlarını yönetin.</p>
    </header>
    <div class="page-actions">
        <div class="search-bar">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="maintenance-search" placeholder="Plaka veya bakım tipi ara..." value="${state.searchTerm}">
        </div>
        <button class="btn btn-primary" id="add-maintenance-btn">
            <i class="fa-solid fa-oil-can"></i>
            Yeni Bakım Kaydı
        </button>
    </div>
    <div class="maintenance-list">
        ${maintenanceData
            .filter(m =>
                !state.searchTerm ||
                m.vehiclePlate.toLowerCase().includes(state.searchTerm.toLowerCase())
            ).map(maint => `
            <div class="maintenance-card" data-maintenance-id="${maint.id}">
                <div class="maintenance-card-header">
                    <h3>${maint.vehiclePlate}</h3>
                    <div class="action-icons">
                        <button class="action-btn btn-edit-maintenance" title="Düzenle"><i class="fa-solid fa-pencil"></i></button>
                        <button class="action-btn btn-delete-maintenance" title="Sil"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
                <div class="maintenance-card-body">
                    <div class="maintenance-section">
                        <h4>Yapılan Bakım</h4>
                        <div class="maintenance-detail"><strong>Tarih:</strong><span>${formatDate(maint.maintenanceDate)}</span></div>
                        <div class="maintenance-detail"><strong>Kilometre:</strong><span>${formatKm(maint.maintenanceKm)}</span></div>
                        <div class="maintenance-detail"><strong>Tür:</strong><span>${maint.type}</span></div>
                        <div class="maintenance-detail"><strong>Maliyet:</strong><span>₺${maint.cost.toLocaleString('tr-TR')}</span></div>
                        <p class="maintenance-description">${maint.description}</p>
                    </div>
                    <div class="maintenance-section next-due">
                        <h4>Sonraki Bakım</h4>
                        <div class="maintenance-detail">
                            <i class="fa-solid fa-road"></i>
                            <span>${formatKm(maint.nextMaintenanceKm)}</span>
                        </div>
                        <div class="maintenance-detail">
                            <i class="fa-solid fa-calendar-alt"></i>
                            <span>${formatDate(maint.nextMaintenanceDate)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('')}
        ${maintenanceData.length === 0 ? '<p class="no-data-item">Henüz bakım kaydı bulunmuyor.</p>' : ''}
    </div>
    `;
};

export default MaintenancePage;