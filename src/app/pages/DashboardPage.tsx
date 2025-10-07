import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectVehicles } from '../features/vehicles/vehiclesSlice';
import { selectCustomers } from '../features/customers/customersSlice';
import { selectRentals } from '../features/rentals/rentalsSlice';
import { selectMaintenance } from '../features/maintenance/maintenanceSlice';
import { selectActivities } from '../features/activities/activitiesSlice';
import { selectApp, setActivePage, openModal, ModalType } from '../features/app/appSlice';
import { formatTimeAgo } from '../utils/utils';

const DashboardPage: React.FC = () => {
    const dispatch = useDispatch();

    // Verileri Redux store'dan al
    const vehicles = useSelector(selectVehicles);
    const customers = useSelector(selectCustomers);
    const rentals = useSelector(selectRentals);
    const maintenances = useSelector(selectMaintenance);
    const activities = useSelector(selectActivities);
    const { settings } = useSelector(selectApp);

    // İstatistikleri ve verileri hesapla
    const stats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const totalVehicles = vehicles.length;
        const activeRentals = vehicles.filter(v => v.status === 'Kirada').length;
        const maintenanceVehicles = vehicles.filter(v => v.status === 'Bakımda').length;
        const monthlyIncome = rentals
            .filter(r => {
                if (!r.endDate) return false;
                const endDate = new Date(r.endDate);
                return endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear;
            })
            .reduce((sum, r) => sum + (r.totalCost || 0), 0);

        return {
            totalVehicles,
            activeRentals,
            maintenanceVehicles,
            monthlyIncome,
        };
    }, [vehicles, rentals]);

    const allStatCards = [
        { key: 'db_metric_total', id: 'vehicles', label: 'Toplam Araç', value: stats.totalVehicles, icon: 'fa-car', color: 'blue' },
        { key: 'db_metric_rented', id: 'rentals', label: 'Aktif Kiralama', value: stats.activeRentals, icon: 'fa-key', color: 'orange' },
        { key: 'db_metric_maintenance', id: 'maintenance', label: 'Bakımdaki Araçlar', value: stats.maintenanceVehicles, icon: 'fa-screwdriver-wrench', color: 'purple' },
        { key: 'db_metric_income', id: 'invoices', label: 'Bu Ayki Gelir', value: `₺${stats.monthlyIncome.toLocaleString('tr-TR')}`, icon: 'fa-wallet', color: 'red' },
    ];

    const statCardsData = allStatCards.filter(card => settings[card.key as keyof typeof settings] !== false);

    const distributionData = useMemo(() => [
        { label: 'Müsait Araçlar', status: 'Müsait', count: vehicles.filter(v => v.status === 'Müsait').length, colorClass: 'available', icon: 'fa-check-circle' },
        { label: 'Kiradaki Araçlar', status: 'Kirada', count: stats.activeRentals, colorClass: 'rented', icon: 'fa-key' },
        { label: 'Bakımdaki Araçlar', status: 'Bakımda', count: stats.maintenanceVehicles, colorClass: 'maintenance', icon: 'fa-screwdriver-wrench' },
    ], [vehicles, stats.activeRentals, stats.maintenanceVehicles]);

    const quickAccessItems: { id: ModalType, icon: string, text: string }[] = [
        { id: 'vehicle', icon: 'fa-solid fa-car-side', text: 'Araç Ekle' },
        { id: 'customer', icon: 'fa-solid fa-user-plus', text: 'Müşteri Ekle' },
        { id: 'rental', icon: 'fa-solid fa-file-signature', text: 'Kiralama Başlat' },
        { id: 'maintenance', icon: 'fa-solid fa-oil-can', text: 'Bakım Kaydı' },
    ];

    const upcomingReminders = useMemo(() => {
        const daysUntil = (dateStr: string | null): number => {
            if (!dateStr) return Infinity;
            const today = new Date();
            const targetDate = new Date(dateStr);
            today.setHours(0, 0, 0, 0);
            targetDate.setHours(0, 0, 0, 0);
            const diffTime = targetDate.getTime() - today.getTime();
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        };
        const reminders: any[] = [];
        vehicles.forEach(v => {
            const insuranceDays = daysUntil(v.insuranceDate);
            if (insuranceDays >= 0 && insuranceDays <= 30) {
                reminders.push({ type: 'Sigorta', vehiclePlate: v.plate, days: insuranceDays });
            }
            const inspectionDays = daysUntil(v.inspectionDate);
            if (inspectionDays >= 0 && inspectionDays <= 30) {
                reminders.push({ type: 'Muayene', vehiclePlate: v.plate, days: inspectionDays });
            }
        });
        maintenances.forEach(m => {
            const maintenanceDays = daysUntil(m.nextMaintenanceDate);
            if (maintenanceDays >= 0 && maintenanceDays <= 30) {
                reminders.push({ type: 'Bakım', vehiclePlate: m.vehiclePlate, days: maintenanceDays });
            }
        });
        return reminders.sort((a, b) => a.days - b.days);
    }, [vehicles, maintenances]);

    const getReminderUrgency = (days: number) => days <= 7 ? 'urgent' : (days <= 15 ? 'warning' : 'normal');
    const getReminderText = (days: number) => days < 0 ? 'Geçti!' : (days === 0 ? 'Bugün Son Gün!' : `Son ${days} gün`);
    const getReminderIcon = (type: string) => ({ 'Sigorta': 'fa-shield-halved', 'Muayene': 'fa-clipboard-check', 'Bakım': 'fa-oil-can' }[type] || 'fa-bell');

    return (
        <>
            <header className="page-header">
                <h1>Ana Gösterge Paneli</h1>
                <p>{new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </header>
            <section className="stats-grid">
                {statCardsData.map((stat) => (
                    <div key={stat.id} className="stat-card" onClick={() => dispatch(setActivePage(stat.id))}>
                        <div className={`icon-wrapper ${stat.color}`}>
                            <i className={`fa-solid ${stat.icon}`}></i>
                        </div>
                        <div className="info">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </section>
            <div className="dashboard-grid">
                <section className="reminders-panel">
                    <h3>Yaklaşan Hatırlatmalar ({upcomingReminders.length})</h3>
                    <ul className="reminders-list">
                        {upcomingReminders.length > 0 ? upcomingReminders.slice(0, 4).map((reminder, i) => (
                            <li key={i} className={`reminder-item ${getReminderUrgency(reminder.days)}`}>
                                <div className="reminder-icon"><i className={`fa-solid ${getReminderIcon(reminder.type)}`}></i></div>
                                <div className="reminder-info"><strong>{reminder.vehiclePlate}</strong><span>{reminder.type} Bitiş Tarihi</span></div>
                                <div className="reminder-days"><span>{getReminderText(reminder.days)}</span></div>
                            </li>
                        )) : <li className="no-data-item">Yaklaşan hatırlatma bulunmuyor.</li>}
                    </ul>
                </section>
                <section className="quick-access-panel">
                    <h3>Hızlı İşlemler</h3>
                    <div className="quick-access-buttons">
                        {quickAccessItems.map(item => (
                            <button key={item.id} className="quick-access-btn" data-tooltip={item.text} onClick={() => dispatch(openModal({ type: item.id }))}>
                                <i className={item.icon}></i>
                            </button>
                        ))}
                    </div>
                </section>
                <section className="recent-activities-panel">
                    <h3>Son Yapılan İşlemler</h3>
                    <ul className="activity-list">
                        {activities.map((activity, i) => (
                            <li key={i} className="activity-item">
                                <div className="activity-icon"><i className={`fa-solid ${activity.icon}`}></i></div>
                                <div className="activity-details">
                                    <p dangerouslySetInnerHTML={{ __html: activity.message }}></p>
                                    <span>{formatTimeAgo(new Date(activity.time))}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
                <section className="vehicle-distribution-panel">
                    <h3>Filo Durum Dağılımı</h3>
                    <ul className="distribution-list-reimagined">
                        {distributionData.map(item => (
                            <li key={item.status} className={`distribution-item-reimagined dist-item-${item.colorClass}`} onClick={() => dispatch(setActivePage('vehicles'))}>
                                <div className="dist-item-icon"><i className={`fa-solid ${item.icon}`}></i></div>
                                <span className="dist-item-label">{item.label}</span>
                                <span className="dist-item-count">{item.count}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </>
    );
};

export default DashboardPage;