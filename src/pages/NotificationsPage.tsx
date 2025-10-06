import type { Vehicle, Maintenance, Activity } from '../types';
import { formatTimeAgo } from '../utils';

interface NotificationsPageProps {
    state: any;
    vehiclesData: Vehicle[];
    maintenanceData: Maintenance[];
    activitiesData: Activity[];
}

const NotificationsPage = ({ state, vehiclesData, maintenanceData, activitiesData }: NotificationsPageProps): string => {
    const allNotifications: any[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const daysUntil = (dateStr: string | null): number => {
        if (!dateStr) return Infinity;
        const targetDate = new Date(dateStr);
        targetDate.setHours(0, 0, 0, 0);
        const diffTime = targetDate.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getReminderText = (days: number) => {
        if (days < 0) return 'Geçti!';
        if (days === 0) return 'Bugün Son Gün!';
        if (days === 1) return 'Yarın Son Gün!';
        return `Son ${days} gün`;
    };

    // 1. Hatırlatmaları ekle
    vehiclesData.forEach((v, index) => {
        const insuranceDays = daysUntil(v.insuranceDate);
        if (insuranceDays >= 0 && insuranceDays <= 30) {
            allNotifications.push({ type: 'reminder', urgency: insuranceDays <= 7 ? 'urgent' : 'warning', icon: 'fa-shield-halved', message: `<strong>${v.plate}</strong> plakalı aracın sigortası yaklaşıyor.`, time: new Date(v.insuranceDate), daysText: getReminderText(insuranceDays), vehicleIndex: index });
        }
        const inspectionDays = daysUntil(v.inspectionDate);
        if (inspectionDays >= 0 && inspectionDays <= 30) {
            allNotifications.push({ type: 'reminder', urgency: inspectionDays <= 7 ? 'urgent' : 'warning', icon: 'fa-clipboard-check', message: `<strong>${v.plate}</strong> plakalı aracın muayenesi yaklaşıyor.`, time: new Date(v.inspectionDate), daysText: getReminderText(inspectionDays), vehicleIndex: index });
        }
    });
    maintenanceData.forEach(m => {
        const maintenanceDays = daysUntil(m.nextMaintenanceDate);
        if (maintenanceDays >= 0 && maintenanceDays <= 30) {
            const vehicleIndex = vehiclesData.findIndex(v => v.plate === m.vehiclePlate);
            allNotifications.push({ type: 'reminder', urgency: maintenanceDays <= 7 ? 'urgent' : 'warning', icon: 'fa-oil-can', message: `<strong>${m.vehiclePlate}</strong> plakalı aracın periyodik bakımı yaklaşıyor.`, time: new Date(m.nextMaintenanceDate), daysText: getReminderText(maintenanceDays), vehicleIndex });
        }
    });

    // 2. Son aktiviteleri ekle
    activitiesData.forEach(activity => {
        allNotifications.push({ type: 'activity', urgency: 'normal', icon: activity.icon, message: activity.message, time: activity.time });
    });

    // 3. Hepsini tarihe göre sırala
    allNotifications.sort((a, b) => b.time.getTime() - a.time.getTime());

    const renderNotificationCard = (notification: any) => {
        const timeAgo = formatTimeAgo(notification.time);
        const isClickable = notification.type === 'reminder' && notification.vehicleIndex !== undefined && notification.vehicleIndex !== null;
        return `
            <div class="notification-card ${notification.urgency} ${isClickable ? 'clickable' : ''}"
                 data-notification-id="${notification.time.getTime()}"
                 ${isClickable ? `data-vehicle-index="${notification.vehicleIndex}"` : ''}>
                <div class="notification-icon">
                    <i class="fa-solid ${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <p class="notification-message">${notification.message}</p>
                    <span class="notification-time">${timeAgo}</span>
                </div>
                ${notification.type === 'reminder' ? `<div class="notification-extra">${notification.daysText}</div>` : ''}
            </div>
        `;
    };

    return `
        <header class="page-header">
        <h1>Bildirimler</h1>
        <p>Uygulamadaki tüm önemli güncellemeler ve hatırlatmalar.</p>
        </header>
        <div class="notifications-container">
            ${allNotifications.length > 0 ? allNotifications.map(renderNotificationCard).join('') : '<p class="no-data-item">Gösterilecek bildirim yok.</p>'}
        </div>
    `;
};

export default NotificationsPage;