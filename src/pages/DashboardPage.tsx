import type { Vehicle, Customer, Rental, Reservation, Maintenance, Activity } from '../types';
import { formatTimeAgo } from '../utils';

// Define props for the DashboardPage component
interface DashboardPageProps {
    state: any;
    vehiclesData: Vehicle[];
    customersData: Customer[];
    rentalsData: Rental[];
    maintenanceData: Maintenance[];
    activitiesData: Activity[];
    quickAccessItems: { id: string; icon: string; text: string; className: string; }[];
}

const DashboardPage = ({
    state,
    vehiclesData,
    customersData,
    rentalsData,
    maintenanceData,
    activitiesData,
    quickAccessItems
}: DashboardPageProps) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const daysUntil = (dateStr: string | null): number => {
        if (!dateStr) return Infinity;
        const today = new Date();
        const targetDate = new Date(dateStr);
        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);
        const diffTime = targetDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Calculate dynamic stats
    const totalVehicles = vehiclesData.length;
    const activeRentals = vehiclesData.filter(v => v.status === 'Kirada').length;
    const totalCustomers = customersData.length;
    const maintenanceVehicles = vehiclesData.filter(v => v.status === 'Bakımda').length;
    const monthlyIncome = rentalsData
        .filter(r => {
            if (!r.endDate) return false;
            const endDate = new Date(r.endDate);
            return endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear;
        })
        .reduce((sum, r) => sum + (r.totalCost || 0), 0);

    const allStatCards = [
        { key: 'db_metric_total', id: 'vehicles', label: 'Toplam Araç', value: totalVehicles, icon: 'fa-car', color: 'blue' },
        { key: 'db_metric_rented', id: 'rentals', label: 'Aktif Kiralama', value: activeRentals, icon: 'fa-key', color: 'orange' },
        { key: 'db_metric_maintenance', id: 'maintenance', label: 'Bakımdaki Araçlar', value: maintenanceVehicles, icon: 'fa-screwdriver-wrench', color: 'purple' },
        { key: 'db_metric_income', id: 'invoices', label: 'Bu Ayki Gelir', value: `₺${monthlyIncome.toLocaleString('tr-TR')}`, icon: 'fa-wallet', color: 'red' },
    ];

    // Filter stat cards based on settings
    const statCardsData = allStatCards.filter(card => {
        const settingsKey = card.key as keyof typeof state.settings;
        return state.settings[settingsKey] !== false;
    });

    // Vehicle distribution data
    const availableVehiclesCount = vehiclesData.filter(v => v.status === 'Müsait').length;
    const distributionData = [
        { label: 'Müsait Araçlar', status: 'Müsait', count: availableVehiclesCount, colorClass: 'available', icon: 'fa-check-circle' },
        { label: 'Kiradaki Araçlar', status: 'Kirada', count: activeRentals, colorClass: 'rented', icon: 'fa-key' },
        { label: 'Bakımdaki Araçlar', status: 'Bakımda', count: maintenanceVehicles, colorClass: 'maintenance', icon: 'fa-screwdriver-wrench' },
    ];

    // Calculate upcoming reminders
    const upcomingReminders: any[] = [];
    vehiclesData.forEach(v => {
        const insuranceDays = daysUntil(v.insuranceDate);
        if (insuranceDays >= 0 && insuranceDays <= 30) {
            upcomingReminders.push({ type: 'Sigorta', vehiclePlate: v.plate, days: insuranceDays, date: v.insuranceDate });
        }
        const inspectionDays = daysUntil(v.inspectionDate);
        if (inspectionDays >= 0 && inspectionDays <= 30) {
            upcomingReminders.push({ type: 'Muayene', vehiclePlate: v.plate, days: inspectionDays, date: v.inspectionDate });
        }
    });
    maintenanceData.forEach(m => {
        const maintenanceDays = daysUntil(m.nextMaintenanceDate);
        if (maintenanceDays >= 0 && maintenanceDays <= 30) {
            const latestMaint = maintenanceData
                .filter(mx => mx.vehiclePlate === m.vehiclePlate)
                .sort((a, b) => new Date(b.maintenanceDate).getTime() - new Date(a.maintenanceDate).getTime())[0];
            if (m.id === latestMaint.id) {
                upcomingReminders.push({ type: 'Bakım', vehiclePlate: m.vehiclePlate, days: maintenanceDays, date: m.nextMaintenanceDate });
            }
        }
    });

    upcomingReminders.sort((a, b) => a.days - b.days);

    const getReminderUrgency = (days: number) => {
        if (days <= 7) return 'urgent';
        if (days <= 15) return 'warning';
        return 'normal';
    };

    const getReminderText = (days: number) => {
        if (days < 0) return 'Geçti!';
        if (days === 0) return 'Bugün Son Gün!';
        if (days === 1) return 'Yarın Son Gün!';
        return `Son ${days} gün`;
    };

    const getReminderIcon = (type: string) => {
        if (type === 'Sigorta') return 'fa-shield-halved';
        if (type === 'Muayene') return 'fa-clipboard-check';
        if (type === 'Bakım') return 'fa-oil-can';
        return 'fa-bell';
    };

    return `
      <header class="page-header">
        <h1>Ana Gösterge Paneli</h1>
        <p>${new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>
      <section class="stats-grid">
        ${statCardsData.map((stat) => `
          <div class="stat-card" data-page-id="${stat.id}">
            <div class="icon-wrapper ${stat.color}">
              <i class="fa-solid ${stat.icon}"></i>
            </div>
            <div class="info">
              <h3>${stat.value}</h3>
              <p>${stat.label}</p>
            </div>
          </div>
        `).join('')}
      </section>
      <div class="dashboard-grid">
    <section class="reminders-panel">
        <h3>Yaklaşan Hatırlatmalar (${upcomingReminders.length})</h3>
        <ul class="reminders-list">
            ${upcomingReminders.slice(0, 4).map(reminder => `
                <li class="reminder-item ${getReminderUrgency(reminder.days)}">
                    <div class="reminder-icon">
                        <i class="fa-solid ${getReminderIcon(reminder.type)}"></i>
                    </div>
                    <div class="reminder-info">
                        <strong>${reminder.vehiclePlate}</strong>
                        <span>${reminder.type} Bitiş Tarihi</span>
                    </div>
                    <div class="reminder-days">
                        <span>${getReminderText(reminder.days)}</span>
                    </div>
                </li>
            `).join('')}
            ${upcomingReminders.length === 0 ? '<li class="no-data-item">Yaklaşan hatırlatma bulunmuyor.</li>' : ''}
        </ul>
    </section>
    <section class="quick-access-panel">
      <h3>Hızlı İşlemler</h3>
      <div class="quick-access-buttons">
        ${quickAccessItems.map(item => `
          <button class="quick-access-btn ${item.className}" data-tooltip="${item.text}" data-page-id="${item.id}">
            <i class="${item.icon}"></i>
          </button>
        `).join('')}
      </div>
    </section>
    <section class="recent-activities-panel">
      <h3>Son Yapılan İşlemler</h3>
      <ul class="activity-list">
          ${activitiesData.map(activity => `
              <li class="activity-item">
                  <div class="activity-icon">
                      <i class="fa-solid ${activity.icon}"></i>
                  </div>
                  <div class="activity-details">
                      <p>${activity.message}</p>
                      <span>${formatTimeAgo(activity.time)}</span>
                  </div>
              </li>
          `).join('')}
      </ul>
    </section>
    <section class="vehicle-distribution-panel">
      <h3>Filo Durum Dağılımı</h3>
      <ul class="distribution-list-reimagined">
        ${distributionData.map(item => `
          <li class="distribution-item-reimagined dist-item-${item.colorClass}" data-status-filter="${item.status}">
            <div class="dist-item-icon">
              <i class="fa-solid ${item.icon}"></i>
            </div>
            <span class="dist-item-label">${item.label}</span>
            <span class="dist-item-count">${item.count}</span>
          </li>
        `).join('')}
      </ul>
    </section>
      </div>
    `;
};

export default DashboardPage;