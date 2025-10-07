import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectVehicles, deleteVehicle } from '../features/vehicles/vehiclesSlice';
import { selectApp, setSearchTerm, openModal } from '../features/app/appSlice';
import { getStatusClass } from '../utils/utils';
import { Vehicle } from '../types';

const VehiclesPage: React.FC = () => {
    const dispatch = useDispatch();
    const { searchTerm, vehicleStatusFilter, filterExpiring, settings } = useSelector(selectApp);
    const vehicles = useSelector(selectVehicles);

    const daysUntil = (dateStr: string | null): number => {
        if (!dateStr) return Infinity;
        const today = new Date();
        const targetDate = new Date(dateStr);
        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);
        const diffTime = targetDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const reminderDays = settings.reminder_days || 30;

    const filteredVehicles = useMemo(() => {
        return vehicles
            .map((v, index) => ({ ...v, originalIndex: index })) // Keep original index
            .filter(v => {
                if (!filterExpiring) return true;
                const insuranceDays = daysUntil(v.insuranceDate);
                const inspectionDays = daysUntil(v.inspectionDate);
                return (insuranceDays >= 0 && insuranceDays <= reminderDays) || (inspectionDays >= 0 && inspectionDays <= reminderDays);
            })
            .filter(v => !vehicleStatusFilter || v.status === vehicleStatusFilter)
            .filter(v =>
                v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.brand.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [vehicles, searchTerm, vehicleStatusFilter, filterExpiring, reminderDays]);

    const handleDelete = (vehicle: Vehicle, index: number) => {
        if (confirm(`'${vehicle.plate}' plakalı aracı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            dispatch(deleteVehicle(index));
        }
    };

    return (
        <>
            <header className="page-header">
                <h1>Araç Yönetimi</h1>
                <p>Filodaki tüm araçları görüntüleyin ve yönetin.</p>
            </header>
            <div className="page-actions">
                <div className="search-bar">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        id="vehicle-search"
                        placeholder="Plaka veya marka ara..."
                        value={searchTerm}
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                    />
                </div>
                <button className={`btn btn-secondary ${filterExpiring ? 'active' : ''}`} id="filter-expiring-btn" title="Sigortası veya Muayenesi Yaklaşan Araçları Göster">
                    <i className="fa-solid fa-bell"></i>
                    Yaklaşanlar
                </button>
                <button className="btn btn-primary" onClick={() => dispatch(openModal({ type: 'vehicle' }))}>
                    <i className="fa-solid fa-plus"></i>
                    Yeni Araç Ekle
                </button>
            </div>
            <div className="vehicles-grid">
                {filteredVehicles.map(v => (
                    <div key={v.originalIndex} className="vehicle-card" data-status={v.status}>
                        <div className="card-header">
                            <h3>{v.plate}</h3>
                            <div className={`status-badge ${getStatusClass(v.status)}`}>{v.status}</div>
                        </div>
                        <div className="card-info">
                            <p>{v.brand}</p>
                            <span>{v.km} KM</span>
                        </div>
                        <div className="card-documents">
                            <h4>Belgeler</h4>
                            <div className="document-item">
                                <div className="document-info">
                                    <i className="fa-solid fa-shield-halved"></i>
                                    <div><span>Sigorta Bitiş</span><strong>{v.insuranceDate ? new Date(v.insuranceDate).toLocaleDateString('tr-TR') : 'Girilmemiş'}</strong></div>
                                </div>
                                {v.insuranceFile ?
                                    (v.insuranceFileUrl ? <a href={v.insuranceFileUrl} target="_blank" className="btn-view" title={v.insuranceFile}><i className="fa-solid fa-eye"></i> Görüntüle</a> : <button className="btn-upload" onClick={() => dispatch(openModal({ type: 'vehicle', entity: v.originalIndex }))} title="Dosyayı yeniden yüklemek için düzenleyin"><i className="fa-solid fa-upload"></i> Yeniden Yükle</button>) :
                                    <button className="btn-upload" onClick={() => dispatch(openModal({ type: 'vehicle', entity: v.originalIndex }))} title="Dosya yüklemek için düzenleyin"><i className="fa-solid fa-upload"></i> Yükle</button>}
                            </div>
                            <div className="document-item">
                                <div className="document-info">
                                    <i className="fa-solid fa-clipboard-check"></i>
                                    <div><span>Muayene Bitiş</span><strong>{v.inspectionDate ? new Date(v.inspectionDate).toLocaleDateString('tr-TR') : 'Girilmemiş'}</strong></div>
                                </div>
                                {v.inspectionFile ?
                                    (v.inspectionFileUrl ? <a href={v.inspectionFileUrl} target="_blank" className="btn-view" title={v.inspectionFile}><i className="fa-solid fa-eye"></i> Görüntüle</a> : <button className="btn-upload" onClick={() => dispatch(openModal({ type: 'vehicle', entity: v.originalIndex }))} title="Dosyayı yeniden yüklemek için düzenleyin"><i className="fa-solid fa-upload"></i> Yeniden Yükle</button>) :
                                    <button className="btn-upload" onClick={() => dispatch(openModal({ type: 'vehicle', entity: v.originalIndex }))} title="Dosya yüklemek için düzenleyin"><i className="fa-solid fa-upload"></i> Yükle</button>}
                            </div>
                            <div className="document-item">
                                <div className="document-info"><i className="fa-solid fa-id-card"></i><span>Ruhsat</span></div>
                                {v.licenseFile ?
                                    (v.licenseFileUrl ? <a href={v.licenseFileUrl} target="_blank" className="btn-view" title={v.licenseFile}><i className="fa-solid fa-eye"></i> Görüntüle</a> : <button className="btn-upload" onClick={() => dispatch(openModal({ type: 'vehicle', entity: v.originalIndex }))} title="Dosyayı yeniden yüklemek için düzenleyin"><i className="fa-solid fa-upload"></i> Yeniden Yükle</button>) :
                                    <button className="btn-upload" onClick={() => dispatch(openModal({ type: 'vehicle', entity: v.originalIndex }))} title="Dosya yüklemek için düzenleyin"><i className="fa-solid fa-upload"></i> Yükle</button>}
                            </div>
                        </div>
                        <div className="card-actions">
                            {v.status === 'Müsait' && <button className="btn" onClick={() => dispatch(openModal({ type: 'rental', entity: v }))}><i className="fa-solid fa-key"></i> Kirala</button>}
                            {v.status === 'Kirada' && <button className="btn" onClick={() => dispatch(openModal({ type: 'checkIn', entity: v }))}><i className="fa-solid fa-right-to-bracket"></i> Teslim Al</button>}
                            <div className="action-icons">
                               <button className="action-btn" title="Bakım Geçmişini Görüntüle"><i className="fa-solid fa-screwdriver-wrench"></i></button>
                               <button className="action-btn" onClick={() => dispatch(openModal({ type: 'vehicle', entity: v.originalIndex }))} title="Düzenle"><i className="fa-solid fa-pencil"></i></button>
                               <button className="action-btn" onClick={() => handleDelete(v, v.originalIndex)} title="Sil"><i className="fa-solid fa-trash-can"></i></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default VehiclesPage;