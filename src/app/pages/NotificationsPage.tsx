import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectVehicles } from '../features/vehicles/vehiclesSlice';
import { selectMaintenance } from '../features/maintenance/maintenanceSlice';
import { selectActivities } from '../features/activities/activitiesSlice';
import { selectApp, openModal, setNotificationFilter, addReadNotification } from '../features/app/appSlice';
import { formatTimeAgo } from '../utils/utils';

// Alt Bileşen: NotificationCard
const NotificationCard: React.FC<{ notification: any }> = ({ notification }) => {
    const dispatch = useDispatch();
    const { readNotifications } = useSelector(selectApp);
    const isRead = readNotifications.includes(notification.id);

    const handleClick = () => {
        if (!isRead) {
            dispatch(addReadNotification(notification.id));
        }
        if (notification.type === 'reminder' && notification.vehicleIndex !== -1) {
            dispatch(openModal({ type: 'vehicle', entity: notification.vehicleIndex }));
        }
    };

    return (
        <div
            className={`notification-card ${notification.urgency} ${notification.isClickable ? 'clickable' : ''} ${isRead ? 'read' : ''}`}
            onClick={notification.isClickable ? handleClick : undefined}
        >
            <div className="notification-icon"><i className={`fa-solid ${notification.icon}`}></i></div>
            <div className="notification-content">
                <p className="notification-message" dangerouslySetInnerHTML={{ __html: notification.message }}></p>
                <span className="notification-time">{formatTimeAgo(new Date(notification.time))}</span>
            </div>
            {notification.type === 'reminder' && <div className="notification-extra">{notification.daysText}</div>}
        </div>
    );
};


// Ana Bileşen: NotificationsPage
const NotificationsPage: React.FC = () => {
    const dispatch = useDispatch();
    const vehicles = useSelector(selectVehicles);
    const maintenances = useSelector(selectMaintenance);
    const activities = useSelector(selectActivities);
    const { notificationFilter } = useSelector(selectApp);

    const allNotifications = useMemo(() => {
        const notifications: any[] = [];
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const daysUntil = (dateStr: string | null): number => {
            if (!dateStr) return Infinity;
            const targetDate = new Date(dateStr);
            targetDate.setHours(0, 0, 0, 0);
            return Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        };

        const getReminderText = (days: number) => {
            if (days < 0) return 'Geçti!';
            if (days === 0) return 'Bugün Son Gün!';
            return `Son ${days} gün`;
        };

        // Hatırlatmaları ekle
        if (notificationFilter !== 'activities') {
            vehicles.forEach((v, index) => {
                const insuranceDays = daysUntil(v.insuranceDate);
                if (insuranceDays >= 0 && insuranceDays <= 30) {
                    const time = new Date(v.insuranceDate!);
                    notifications.push({ id: time.getTime() + index, type: 'reminder', isClickable: true, urgency: insuranceDays <= 7 ? 'urgent' : 'warning', icon: 'fa-shield-halved', message: `<strong>${v.plate}</strong> plakalı aracın sigortası yaklaşıyor.`, time, daysText: getReminderText(insuranceDays), vehicleIndex: index });
                }
                const inspectionDays = daysUntil(v.inspectionDate);
                if (inspectionDays >= 0 && inspectionDays <= 30) {
                    const time = new Date(v.inspectionDate!);
                    notifications.push({ id: time.getTime() + index + 1000, type: 'reminder', isClickable: true, urgency: inspectionDays <= 7 ? 'urgent' : 'warning', icon: 'fa-clipboard-check', message: `<strong>${v.plate}</strong> plakalı aracın muayenesi yaklaşıyor.`, time, daysText: getReminderText(inspectionDays), vehicleIndex: index });
                }
            });
            maintenances.forEach((m, index) => {
                const maintenanceDays = daysUntil(m.nextMaintenanceDate);
                if (maintenanceDays >= 0 && maintenanceDays <= 30) {
                    const vehicleIndex = vehicles.findIndex(v => v.plate === m.vehiclePlate);
                    const time = new Date(m.nextMaintenanceDate);
                    notifications.push({ id: time.getTime() + index + 2000, type: 'reminder', isClickable: true, urgency: maintenanceDays <= 7 ? 'urgent' : 'warning', icon: 'fa-oil-can', message: `<strong>${m.vehiclePlate}</strong> plakalı aracın periyodik bakımı yaklaşıyor.`, time, daysText: getReminderText(maintenanceDays), vehicleIndex });
                }
            });
        }

        // Son aktiviteleri ekle
        if (notificationFilter !== 'reminders') {
            activities.forEach((activity, index) => {
                const time = new Date(activity.time);
                notifications.push({ id: time.getTime() + index + 3000, type: 'activity', isClickable: false, urgency: 'normal', icon: activity.icon, message: activity.message, time });
            });
        }

        return notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    }, [vehicles, maintenances, activities, notificationFilter]);

    return (
        <>
            <header className="page-header">
                <h1>Bildirimler</h1>
                <p>Uygulamadaki tüm önemli güncellemeler ve hatırlatmalar.</p>
            </header>
            <div className="page-actions">
                 <div className="notification-filters">
                    <button className={`filter-btn ${notificationFilter === 'all' ? 'active' : ''}`} onClick={() => dispatch(setNotificationFilter('all'))}>Tümü</button>
                    <button className={`filter-btn ${notificationFilter === 'reminders' ? 'active' : ''}`} onClick={() => dispatch(setNotificationFilter('reminders'))}>Hatırlatmalar</button>
                    <button className={`filter-btn ${notificationFilter === 'activities' ? 'active' : ''}`} onClick={() => dispatch(setNotificationFilter('activities'))}>Aktiviteler</button>
                </div>
            </div>
            <div className="notifications-container">
                {allNotifications.length > 0 ? (
                    allNotifications.map(n => <NotificationCard key={n.id} notification={n} />)
                ) : (
                    <p className="no-data-item">Gösterilecek bildirim yok.</p>
                )}
            </div>
        </>
    );
};

export default NotificationsPage;