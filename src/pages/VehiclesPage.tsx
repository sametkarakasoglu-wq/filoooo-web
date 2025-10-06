import type { Vehicle } from '../types';
import { getStatusClass } from '../utils';

interface VehiclesPageProps {
    state: any;
    vehiclesData: Vehicle[];
}

const VehiclesPage = ({ state, vehiclesData }: VehiclesPageProps): string => {
    const daysUntil = (dateStr: string | null): number => {
        if (!dateStr) return Infinity;
        const today = new Date();
        const targetDate = new Date(dateStr);
        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);
        const diffTime = targetDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const reminderDays = state.settings.reminder_days || 30;

    return `
    <header class="page-header">
        <h1>Araç Yönetimi</h1>
        <p>Filodaki tüm araçları görüntüleyin ve yönetin.</p>
    </header>
    <div class="page-actions">
        <div class="search-bar">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="vehicle-search" placeholder="Plaka veya marka ara..." value="${state.searchTerm}">
        </div>
        <button class="btn btn-secondary ${state.filterExpiring ? 'active' : ''}" id="filter-expiring-btn" title="Sigortası veya Muayenesi Yaklaşan Araçları Göster">
            <i class="fa-solid fa-bell"></i>
            Yaklaşanlar
        </button>
        <button class="btn btn-primary" id="add-vehicle-btn">
            <i class="fa-solid fa-plus"></i>
            Yeni Araç Ekle
        </button>
    </div>
    <div class="vehicles-grid">
        ${vehiclesData
            .map((v, index) => ({ ...v, originalIndex: index })) // Keep original index
            .filter(v => {
                if (!state.filterExpiring) return true;
                const insuranceDays = daysUntil(v.insuranceDate);
                const inspectionDays = daysUntil(v.inspectionDate);
                return (insuranceDays >= 0 && insuranceDays <= reminderDays) || (inspectionDays >= 0 && inspectionDays <= reminderDays);
            })
            .filter(v =>
                !state.vehicleStatusFilter || // If no filter, show all
                v.status === state.vehicleStatusFilter
            )
            .filter(v =>
                v.plate.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                v.brand.toLowerCase().includes(state.searchTerm.toLowerCase())
            )
            .map(v => `
            <div class="vehicle-card" data-vehicle-index="${v.originalIndex}" data-status="${v.status}">
                <div class="card-header">
                    <h3>${v.plate}</h3>
                    <div class="status-badge ${getStatusClass(v.status)}">${v.status}</div>
                </div>
                <div class="card-info">
                    <p>${v.brand}</p>
                    <span>${v.km} KM</span>
                </div>
                <div class="card-documents">
                    <h4>Belgeler</h4>
                     <div class="document-item">
                        <div class="document-info">
                            <i class="fa-solid fa-shield-halved"></i>
                            <div><span>Sigorta Bitiş</span><strong>${v.insuranceDate ? new Date(v.insuranceDate).toLocaleDateString('tr-TR') : 'Girilmemiş'}</strong></div>
                        </div>
                        ${v.insuranceFile ?
                            (v.insuranceFileUrl ? `<a href="${v.insuranceFileUrl}" target="_blank" class="btn-view" title="${v.insuranceFile}"><i class="fa-solid fa-eye"></i> Görüntüle</a>` : `<button class="btn-upload btn-edit-vehicle" title="Dosyayı yeniden yüklemek için düzenleyin"><i class="fa-solid fa-upload"></i> Yeniden Yükle</button>`) :
                            `<button class="btn-upload btn-edit-vehicle" title="Dosya yüklemek için düzenleyin"><i class="fa-solid fa-upload"></i> Yükle</button>`}
                    </div>
                    <div class="document-item">
                        <div class="document-info">
                            <i class="fa-solid fa-clipboard-check"></i>
                            <div><span>Muayene Bitiş</span><strong>${v.inspectionDate ? new Date(v.inspectionDate).toLocaleDateString('tr-TR') : 'Girilmemiş'}</strong></div>
                        </div>
                         ${v.inspectionFile ?
                            (v.inspectionFileUrl ? `<a href="${v.inspectionFileUrl}" target="_blank" class="btn-view" title="${v.inspectionFile}"><i class="fa-solid fa-eye"></i> Görüntüle</a>` : `<button class="btn-upload btn-edit-vehicle" title="Dosyayı yeniden yüklemek için düzenleyin"><i class="fa-solid fa-upload"></i> Yeniden Yükle</button>`) :
                            `<button class="btn-upload btn-edit-vehicle" title="Dosya yüklemek için düzenleyin"><i class="fa-solid fa-upload"></i> Yükle</button>`}
                    </div>
                    <div class="document-item">
                        <div class="document-info"><i class="fa-solid fa-id-card"></i><span>Ruhsat</span></div>
                         ${v.licenseFile ?
                            (v.licenseFileUrl ? `<a href="${v.licenseFileUrl}" target="_blank" class="btn-view" title="${v.licenseFile}"><i class="fa-solid fa-eye"></i> Görüntüle</a>` : `<button class="btn-upload btn-edit-vehicle" title="Dosyayı yeniden yüklemek için düzenleyin"><i class="fa-solid fa-upload"></i> Yeniden Yükle</button>`) :
                            `<button class="btn-upload btn-edit-vehicle" title="Dosya yüklemek için düzenleyin"><i class="fa-solid fa-upload"></i> Yükle</button>`}
                    </div>
                </div>
                <div class="card-actions">
                    ${v.status === 'Müsait' ? `<button class="btn btn-rent"><i class="fa-solid fa-key"></i> Kirala</button>` : ''}
                    ${v.status === 'Kirada' ? `<button class="btn btn-check-in"><i class="fa-solid fa-right-to-bracket"></i> Teslim Al</button>` : ''}
                    <div class="action-icons">
                       <button class="action-btn btn-view-maintenance" title="Bakım Geçmişini Görüntüle"><i class="fa-solid fa-screwdriver-wrench"></i></button>
                       <button class="action-btn btn-edit-vehicle" title="Düzenle"><i class="fa-solid fa-pencil"></i></button>
                       <button class="action-btn btn-delete-vehicle" title="Sil"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>
    `;
};

export default VehiclesPage;