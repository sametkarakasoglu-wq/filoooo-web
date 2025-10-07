import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectMaintenance, deleteMaintenance } from '../features/maintenance/maintenanceSlice';
import { selectApp, setSearchTerm, openModal } from '../features/app/appSlice';
import { Maintenance } from '../types';

// Alt Bileşen: MaintenanceCard
const MaintenanceCard: React.FC<{ maintenance: Maintenance }> = ({ maintenance }) => {
    const dispatch = useDispatch();
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('tr-TR');
    const formatKm = (km: number) => km.toLocaleString('tr-TR') + ' KM';

    const handleDelete = () => {
        if (confirm(`Bu bakım kaydını silmek istediğinizden emin misiniz?`)) {
            dispatch(deleteMaintenance(maintenance.id));
        }
    };

    return (
        <div className="maintenance-card" data-maintenance-id={maintenance.id}>
            <div className="maintenance-card-header">
                <h3>{maintenance.vehiclePlate}</h3>
                <div className="action-icons">
                    <button className="action-btn" onClick={() => dispatch(openModal({ type: 'maintenanceEdit', entity: maintenance.id }))} title="Düzenle"><i className="fa-solid fa-pencil"></i></button>
                    <button className="action-btn" onClick={handleDelete} title="Sil"><i className="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
            <div className="maintenance-card-body">
                <div className="maintenance-section">
                    <h4>Yapılan Bakım</h4>
                    <div className="maintenance-detail"><strong>Tarih:</strong><span>{formatDate(maintenance.maintenanceDate)}</span></div>
                    <div className="maintenance-detail"><strong>Kilometre:</strong><span>{formatKm(maintenance.maintenanceKm)}</span></div>
                    <div className="maintenance-detail"><strong>Tür:</strong><span>{maintenance.type}</span></div>
                    <div className="maintenance-detail"><strong>Maliyet:</strong><span>₺{maintenance.cost.toLocaleString('tr-TR')}</span></div>
                    <p className="maintenance-description">{maintenance.description}</p>
                </div>
                <div className="maintenance-section next-due">
                    <h4>Sonraki Bakım</h4>
                    <div className="maintenance-detail"><i className="fa-solid fa-road"></i><span>{formatKm(maintenance.nextMaintenanceKm)}</span></div>
                    <div className="maintenance-detail"><i className="fa-solid fa-calendar-alt"></i><span>{formatDate(maintenance.nextMaintenanceDate)}</span></div>
                </div>
            </div>
        </div>
    );
};

// Ana Bileşen: MaintenancePage
const MaintenancePage: React.FC = () => {
    const dispatch = useDispatch();
    const { searchTerm } = useSelector(selectApp);
    const maintenances = useSelector(selectMaintenance);

    const filteredMaintenances = useMemo(() => {
        return maintenances.filter(m =>
            !searchTerm ||
            m.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [maintenances, searchTerm]);

    return (
        <>
            <header className="page-header">
                {searchTerm && (
                    <div className="filter-indicator">
                        <i className="fa-solid fa-filter"></i>
                        <span>Filtreleniyor: <strong>{searchTerm}</strong></span>
                        <button onClick={() => dispatch(setSearchTerm(''))} title="Filtreyi Temizle">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                )}
                <h1>Bakım Geçmişi</h1>
                <p>Araçların bakım kayıtlarını yönetin.</p>
            </header>
            <div className="page-actions">
                <div className="search-bar">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        id="maintenance-search"
                        placeholder="Plaka veya bakım tipi ara..."
                        value={searchTerm}
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                    />
                </div>
                <button className="btn btn-primary" onClick={() => dispatch(openModal({ type: 'maintenance' }))}>
                    <i className="fa-solid fa-oil-can"></i>
                    Yeni Bakım Kaydı
                </button>
            </div>
            <div className="maintenance-list">
                {filteredMaintenances.length > 0 ? (
                    filteredMaintenances.map(maint => <MaintenanceCard key={maint.id} maintenance={maint} />)
                ) : (
                    <p className="no-data-item">Henüz bakım kaydı bulunmuyor.</p>
                )}
            </div>
        </>
    );
};

export default MaintenancePage;