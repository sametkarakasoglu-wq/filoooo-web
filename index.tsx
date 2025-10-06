/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Activity, Vehicle, Customer, Rental, Reservation, Maintenance } from './src/types';
import { vehiclesData } from './src/data/vehicles';
import { customersData } from './src/data/customers';
import { rentalsData } from './src/data/rentals';
import { reservationsData } from './src/data/reservations';
import { maintenanceData } from './src/data/maintenance';
import DashboardPage from './src/pages/DashboardPage';
import VehiclesPage from './src/pages/VehiclesPage';
import CustomersPage from './src/pages/CustomersPage';
import RentalsPage from './src/pages/RentalsPage';
import ReservationsPage from './src/pages/ReservationsPage';
import MaintenancePage from './src/pages/MaintenancePage';
import NotificationsPage from './src/pages/NotificationsPage';
import SettingsPage from './src/pages/SettingsPage';
import VehicleModal from './src/components/VehicleModal';
import CustomerModal from './src/components/CustomerModal';
import RentalModal from './src/components/RentalModal';
import CheckInModal from './src/components/CheckInModal';
import ReservationModal from './src/components/ReservationModal';
import ReservationEditModal from './src/components/ReservationEditModal';
import RentalEditModal from './src/components/RentalEditModal';
import MaintenanceModal from './src/components/MaintenanceModal';
import MaintenanceEditModal from './src/components/MaintenanceEditModal';

// Simple pseudo-ReactDOM render function
function render(element: string, container: HTMLElement | null) {
  if (container) {
    container.innerHTML = element;
    // Add event listeners after rendering
    attachEventListeners();
  }
}
// State management
let state = {
    activePage: 'dashboard',
    isVehicleModalOpen: false,
    isRentalModalOpen: false,
    isCustomerModalOpen: false,
    isCheckInModalOpen: false,
    isReservationModalOpen: false,
    isMaintenanceModalOpen: false,
    isRentalEditModalOpen: false,
    isReservationEditModalOpen: false,
    isMaintenanceEditModalOpen: false,
    editingVehicleIndex: null as number | null,
    editingReservationId: null as number | null,
    editingMaintenanceId: null as number | null,
    editingCustomerIndex: null as number | null,
    editingRentalId: null as number | null,
    selectedVehicleForAction: null as any | null,
    theme: 'light' as 'light' | 'dark', // For theme switching
    vehicleStatusFilter: null as string | null, // For dashboard filtering
    searchTerm: '', // For search functionality
    filterExpiring: false, // For vehicle page expiring filter
    rentalFormCustomerType: 'existing' as 'existing' | 'new', // For the rental modal
    notificationFilter: 'all' as 'all' | 'reminders' | 'activities', // For notifications page
    readNotifications: [] as number[], // Array of timestamps for read notifications
    settings: {
        // Dashboard
        db_metric_total: true,
        db_metric_rented: true,
        db_metric_maintenance: true,
        db_metric_income: true,
        // Vehicle & Reminders
        reminder_days: 30,
        vehicle_btn_rent: true,
        vehicle_btn_checkin: true,
        vehicle_btn_edit: true,
        // Notifications
        notif_type_insurance: true,
        notif_type_inspection: true,
        notif_type_activity: true,
    }
};

// State update function
function setState(newState: Partial<typeof state>) {
  state = { ...state, ...newState };
  saveDataToLocalStorage(); // ÖNCE veriyi kaydet. Bu, eklenti çakışmalarını önler.
  renderApp();
}

// Verileri localStorage'a kaydetme fonksiyonu
function saveDataToLocalStorage() {
  try {
    const appData = {
      vehiclesData,
      customersData,
      rentalsData,
      reservationsData,
      maintenanceData,
      activitiesData,
      theme: state.theme,
      readNotifications: state.readNotifications,
      settings: state.settings,
    };
    localStorage.setItem('rehberOtomotivData', JSON.stringify(appData));
  } catch (error) {
    console.error("!!! HATA: Veri localStorage'a kaydedilirken bir sorun oluştu:", error);
  }
}

// Navigation function
function navigateTo(pageId: string) {
  setState({ 
    activePage: pageId, 
    searchTerm: '', 
    vehicleStatusFilter: null,
    filterExpiring: false, // Reset expiring filter on page change
  });
}

// Data for navigation links
const navItems = [
  { id: 'dashboard', icon: 'fa-solid fa-chart-pie', text: 'Gösterge Paneli' },
  { id: 'vehicles', icon: 'fa-solid fa-car', text: 'Araçlar' },
  { id: 'customers', icon: 'fa-solid fa-users', text: 'Müşteriler' },
  { id: 'rentals', icon: 'fa-solid fa-file-contract', text: 'Kiralamalar' },
  { id: 'reservations', icon: 'fa-solid fa-calendar-days', text: 'Rezervasyonlar' },
  { id: 'maintenance', icon: 'fa-solid fa-screwdriver-wrench', text: 'Bakım' },
  { id: 'notifications', icon: 'fa-solid fa-bell', text: 'Bildirimler' },
  { id: 'settings', icon: 'fa-solid fa-gear', text: 'Ayarlar' },
];

// Data for quick access buttons
const quickAccessItems = [
    { id: 'vehicles', icon: 'fa-solid fa-car-side', text: 'Araç Ekle', className: 'btn-add-vehicle' },
    { id: 'customers', icon: 'fa-solid fa-user-plus', text: 'Müşteri Ekle', className: 'btn-add-customer' },
    { id: 'rentals', icon: 'fa-solid fa-file-signature', text: 'Kiralama Başlat', className: 'btn-start-rental' },
    { id: 'maintenance', icon: 'fa-solid fa-oil-can', text: 'Bakım Kaydı', className: 'btn-add-maintenance' },
];

// Data for recent activities (will be populated dynamically)
let activitiesData: Activity[] = [];

function logActivity(icon: string, message: string) {
    activitiesData.unshift({ icon, message, time: new Date() }); // Store as Date object
    if (activitiesData.length > 10) activitiesData.pop(); // Keep the list size manageable
}

// Data for vehicles - Updated with file info and rentedBy

// Data for customers
// Data for rentals
// Data for Reservations
// Data for Maintenance











const PlaceholderPage = (pageName: string, icon: string): string => {
    return `
    <div class="placeholder-page">
        <i class="fa-solid ${icon}"></i>
        <h1>${pageName}</h1>
        <p>Bu sayfa yapım aşamasındadır. Çok yakında...</p>
    </div>
    `;
};












const App = () => {
  let pageContent: string = '';

  switch (state.activePage) {
    case 'dashboard':
      pageContent = DashboardPage({
        state,
        vehiclesData,
        customersData,
        rentalsData,
        maintenanceData,
        activitiesData,
        quickAccessItems,
      });
      break;
    case 'vehicles':
      pageContent = VehiclesPage({ state, vehiclesData });
      break;
    case 'customers':
      pageContent = CustomersPage({ state, customersData });
      break;
    case 'rentals':
      pageContent = RentalsPage({ state, customersData, rentalsData });
      break;
    case 'reservations':
      pageContent = ReservationsPage({ state, reservationsData, customersData, vehiclesData });
      break;
    case 'maintenance':
      pageContent = MaintenancePage({ state, maintenanceData });
      break;
    case 'notifications':
      pageContent = NotificationsPage({
        state,
        vehiclesData,
        maintenanceData,
        activitiesData,
      });
      break;
    case 'settings':
      pageContent = SettingsPage({ state });
      break;
    default:
      pageContent = DashboardPage();
  }

  return `
    <nav class="sidebar">
      <div class="sidebar-header">
        <img src="https://storage.googleapis.com/genai-web-experiments/logo-horizontal.png" alt="Rehber Otomotiv Logo" class="sidebar-logo" />
      </div>
      <ul class="nav-menu">
        ${navItems.map(item => `
          <li>
            <a href="#" class="nav-link ${state.activePage === item.id ? 'active' : ''}" data-page-id="${item.id}">
              <i class="${item.icon}"></i>
              <span>${item.text}</span>
            </a>
          </li>
        `).join('')}
      </ul>
    </nav>
    <main class="main-content">
      ${pageContent}
    </main>
      ${state.isVehicleModalOpen ? VehicleModal({ state, vehiclesData }) : ''}
      ${state.isRentalModalOpen ? RentalModal({ state, vehiclesData, customersData }) : ''}
      ${state.isCustomerModalOpen ? CustomerModal({ state, customersData }) : ''}
      ${state.isCheckInModalOpen ? CheckInModal({ state }) : ''}
      ${state.isReservationModalOpen ? ReservationModal({ vehiclesData, customersData }) : ''}
      ${state.isMaintenanceModalOpen ? MaintenanceModal({ vehiclesData }) : ''}
      ${state.isMaintenanceEditModalOpen ? MaintenanceEditModal({ state, maintenanceData }) : ''}
      ${state.isRentalEditModalOpen ? RentalEditModal({ state, rentalsData, customersData }) : ''}
      ${state.isReservationEditModalOpen ? ReservationEditModal({ state, reservationsData, vehiclesData, customersData }) : ''}
  `;
};

function renderApp() {
  try {
    // console.log('Rendering app...');
    const root = document.getElementById('root');
    document.body.className = state.theme; // Apply theme on every render
    render(App(), root);
    // console.log('App rendered successfully.');
  } catch (error) {
    console.error('!!! HATA: renderApp fonksiyonunda bir sorun oluştu:', error);
    const root = document.getElementById('root');
    if (root) {
        root.innerHTML = `<div style="padding: 20px; text-align: center; color: red;"><h1>Uygulama Çizilirken Kritik Bir Hata Oluştu</h1><p>Lütfen konsolu (F12) kontrol edin.</p><pre>${error.message}</pre></div>`;
    }
  }
}

function attachEventListeners() {
    try {
        // console.log('Attaching event listeners...');
    // Theme switcher
    document.getElementById('theme-toggle')?.addEventListener('change', (e) => {
        const isChecked = (e.target as HTMLInputElement).checked;
        const newTheme = isChecked ? 'dark' : 'light';
        document.body.className = newTheme; // Apply theme to body
        setState({ theme: newTheme });
    });

    // Settings Page Accordion
    document.querySelectorAll('.settings-accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const accordion = header.closest('.settings-accordion');
            accordion.classList.toggle('active');
            const content = accordion.querySelector('.settings-accordion-content') as HTMLElement;
            if (accordion.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });

    // Settings Page Controls
    document.querySelectorAll('[data-setting-key]').forEach(el => {
        el.addEventListener('change', (e) => {
            const key = (e.target as HTMLElement).dataset.settingKey;
            const value = (e.target as HTMLInputElement).type === 'checkbox' ? (e.target as HTMLInputElement).checked : (e.target as HTMLInputElement).value;
            setState({ settings: { ...state.settings, [key]: value } });
            saveDataToLocalStorage(); // Ayar değiştiğinde kaydet
        });
    });

    // Settings Page - Backup and Restore
    document.getElementById('btn-export-data')?.addEventListener('click', () => {
        const dataToExport = {
            vehiclesData,
            customersData,
            rentalsData,
            reservationsData,
            maintenanceData,
            activitiesData,
            theme: state.theme,
            readNotifications: state.readNotifications,
            settings: state.settings,
        };
        const dataStr = JSON.stringify(dataToExport, null, 2); // Pretty print JSON
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rehber-otomotiv-yedek-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    const importFileInput = document.getElementById('import-file-input') as HTMLInputElement;
    document.getElementById('btn-import-data')?.addEventListener('click', () => {
        importFileInput.click();
    });

    importFileInput?.addEventListener('change', (event) => {
        const file = (event.target as HTMLInputElement).files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result as string);
                    let dataToLoad: any = {};

                    if (importedData.vehiclesData) {
                        // Eğer bizim kendi yedek dosyamız ise, olduğu gibi al.
                        console.log("Standart yedek dosyası tespit edildi.");
                        dataToLoad = importedData;
                    } else if (importedData.vehicles || importedData.rentals || importedData.maintenance) {
                        console.log("Harici format tespit edildi, veriler dönüştürülüyor...");

                        // 1. Müşterileri Kiralamalardan Çıkar
                        let tempCustomersData = JSON.parse(JSON.stringify(customersData)); // Deep copy to avoid issues
                        let nextCustomerId = Math.max(0, ...tempCustomersData.map(c => c.id)) + 1;

                        if (importedData.rentals && Array.isArray(importedData.rentals)) {
                            importedData.rentals.forEach(rental => {
                                const customerName = rental.customer?.trim();
                                if (customerName && !tempCustomersData.some(c => c.name.toLowerCase() === customerName.toLowerCase())) {
                                    const newCustomer: Customer = {
                                        id: nextCustomerId++,
                                        name: customerName,
                                        tc: '', phone: '', email: '', address: '', licenseNumber: '', licenseDate: '',
                                        idFile: null, idFileUrl: null, licenseFile: null, licenseFileUrl: null,
                                        rentals: []
                                    };
                                    tempCustomersData.push(newCustomer);
                                }
                            });
                            dataToLoad.customersData = tempCustomersData;
                        } else {
                            // Eğer kiralama verisi yoksa, mevcut müşterileri koru
                            dataToLoad.customersData = tempCustomersData;
                        }

                        // 2. Araçları Dönüştür
                        if (importedData.vehicles && Array.isArray(importedData.vehicles)) {
                            const convertedVehicles = importedData.vehicles.map(v => {
                                const getFileName = (path) => path ? path.split('\\').pop().split('/').pop() : null;
                                return {
                                    plate: v.plate,
                                    brand: `${v.brand || ''} ${v.model || ''}`.trim(),
                                    km: (v.km || 0).toLocaleString('tr-TR'),
                                    status: 'Müsait', // Başlangıçta hepsini Müsait yap, sonra kiralamalara göre güncelleyeceğiz.
                                    insuranceDate: v.insurance || null, 
                                    inspectionDate: v.inspection || null,
                                    insuranceFile: v.gorseller ? getFileName(v.gorseller.sigorta) : null,
                                    inspectionFile: v.gorseller ? getFileName(v.gorseller.muayene) : null,
                                    licenseFile: v.gorseller ? getFileName(v.gorseller.ruhsat) : null,
                                    insuranceFileUrl: null, // Local paths cannot be used
                                    inspectionFileUrl: null,
                                    licenseFileUrl: null,
                                };
                            });
                            dataToLoad.vehiclesData = convertedVehicles;
                        }

                        // 3. Kiralamaları Dönüştür
                        if (importedData.rentals && Array.isArray(importedData.rentals)) {
                             const convertedRentals = importedData.rentals.map(r => {
                                const customer = tempCustomersData.find(c => c.name.toLowerCase() === r.customer?.toLowerCase());
                                const isActive = r.endDate === "" || !r.endDate;
                                return {
                                    id: Date.now() + Math.random(), // Use a more robust ID
                                    vehiclePlate: r.plate,
                                    customerId: customer ? customer.id : 0,
                                    startDate: r.startDate,
                                    endDate: isActive ? null : r.endDate,
                                    startKm: r.startKm || 0,
                                    endKm: isActive ? null : r.endKm,
                                    price: r.rate || 0,
                                    priceType: r.per === 'Aylık' ? 'monthly' : 'daily',
                                    totalCost: null, // Needs calculation on check-in
                                    contractFile: r.contract ? r.contract.split('\\').pop() : null,
                                    invoiceFile: r.invoice ? r.invoice.split('\\').pop() : null,
                                    contractFileUrl: null,
                                    invoiceFileUrl: null,
                                    status: isActive ? 'active' : 'completed',
                                };
                            });
                            dataToLoad.rentalsData = convertedRentals.filter(r => r.customerId !== 0);

                            // 3.5. Araç Durumlarını Kiralamalara Göre Güncelle
                            if (dataToLoad.vehiclesData) {
                                dataToLoad.vehiclesData.forEach(vehicle => {
                                    const activeRental = dataToLoad.rentalsData.find(rental => 
                                        rental.vehiclePlate === vehicle.plate && rental.status === 'active'
                                    );
                                    if (activeRental) {
                                        vehicle.status = 'Kirada';
                                        // İsteğe bağlı: Kiracı bilgisini de ekleyebiliriz
                                    }
                                });
                            }
                        }

                        // 4. Bakımları Dönüştür
                        if (importedData.maintenance && Array.isArray(importedData.maintenance)) {
                            dataToLoad.maintenanceData = importedData.maintenance.map(m => {
                                const maintenanceKm = m.km || 0;
                                const nextDate = new Date(m.date);
                                nextDate.setFullYear(nextDate.getFullYear() + 1);
                                return {
                                    id: Date.now() + Math.random(),
                                    vehiclePlate: m.plate,
                                    maintenanceDate: m.date,
                                    maintenanceKm: maintenanceKm,
                                    type: m.type || 'Genel Bakım',
                                    cost: m.cost || 0,
                                    description: m.note || '',
                                    nextMaintenanceKm: maintenanceKm + 15000,
                                    nextMaintenanceDate: nextDate.toISOString().split('T')[0],
                                };
                            });
                        }

                        // 5. Rezervasyonları ve Ayarları Dönüştür (varsa)
                        if (importedData.reservations) {
                            dataToLoad.reservationsData = importedData.reservations; // Assuming format is compatible
                        }
                        if (importedData.settings) {
                            dataToLoad.settings = importedData.settings;
                        }

                    } else {
                        throw new Error("Dosya beklenen formatta değil. 'vehicles', 'rentals', 'maintenance' veya 'vehiclesData' anahtarı bulunamadı.");
                    }
                    
                    if (confirm('Veriler içe aktarılacak. Bu işlem, dosyadaki verileri mevcut verilerinizin üzerine yazacaktır. Onaylıyor musunuz?')) {
                        // Mevcut verileri al
                        const currentData = JSON.parse(localStorage.getItem('rehberOtomotivData') || '{}');
                        
                        // İçe aktarılan veriyi mevcut verinin üzerine "birleştir".
                        // Bu sayede sadece içe aktarılan dosyada olan alanlar güncellenir.
                        const mergedData = {
                            ...currentData,
                            ...dataToLoad 
                        };
                        
                        localStorage.setItem('rehberOtomotivData', JSON.stringify(mergedData));
                        localStorage.setItem('showImportSuccessToast', 'true'); // Başarı mesajı için işaret bırak
                        // Kaydetme fonksiyonunu burada çağırmıyoruz, çünkü zaten localStorage'a yazdık.
                        window.location.reload(); // Sayfayı yeniden yükleyerek en temiz şekilde verileri almasını sağla
                    }
                } catch (err) {
                    alert(`Hata: ${err.message}. Lütfen doğru formatta bir JSON dosyası seçtiğinizden emin olun.`);
                    console.error("Veri içe aktarılırken hata:", err);
                }
            };
            reader.readAsText(file);
        }
    });

    // Notification filter buttons
    document.querySelectorAll('.notification-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = (btn as HTMLElement).dataset.filter as any;
            setState({ notificationFilter: filter });
        });
    });

    // Notification card click (for reminders)
    document.querySelectorAll('.notification-card[data-vehicle-index]').forEach(card => {
        const vehicleIndexStr = (card as HTMLElement).dataset.vehicleIndex;
        const notificationId = parseInt((card as HTMLElement).dataset.notificationId, 10);

        const clickHandler = () => {
            // Mark as read logic
            if (!state.readNotifications.includes(notificationId)) {
                const newReadNotifications = [...state.readNotifications, notificationId];
                setState({ readNotifications: newReadNotifications }); // Update state properly
                saveDataToLocalStorage(); // Save the change
                card.classList.add('read'); // Update UI immediately
            }

            // Navigate to vehicle details by opening the modal if it's a reminder
            if (vehicleIndexStr && vehicleIndexStr !== "") {
                const vehicleIndex = parseInt(vehicleIndexStr, 10);
                setState({ activePage: 'vehicles', editingVehicleIndex: vehicleIndex, isVehicleModalOpen: true });
            }
        };
        card.addEventListener('click', clickHandler);
    });

    // Navigation
    document.querySelectorAll('.nav-link, .stat-card, .quick-access-btn').forEach(el => {
        const pageId = (el as HTMLElement).dataset.pageId;
        // Special handling for quick access buttons that open modals instead of navigating
        if (pageId === 'vehicles' && el.classList.contains('btn-add-vehicle')) return;
        if (pageId === 'customers' && el.classList.contains('btn-add-customer')) return;
        if (pageId === 'rentals' && el.classList.contains('btn-start-rental')) return;
        if (pageId === 'maintenance' && el.classList.contains('btn-add-maintenance')) return;

        if (pageId) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo(pageId);
            });
        }
    });
    
    // Quick access buttons on dashboard
    document.querySelector('.btn-add-vehicle')?.addEventListener('click', () => openModal('vehicle'));
    document.querySelector('.btn-add-customer')?.addEventListener('click', () => openModal('customer'));
    // For now, other quick access buttons navigate to their pages, which is handled above.

    
    // Rent button on dashboard available vehicles list
    document.querySelectorAll('.btn-rent-small').forEach(btn => {
        const plate = (btn as HTMLElement).dataset.vehiclePlate;
        const vehicleIndex = vehiclesData.findIndex(v => v.plate === plate);
        if (vehicleIndex > -1) {
            btn.addEventListener('click', () => openModal('rental', vehicleIndex));
        }
    });

    const openModal = (modalType: 'vehicle' | 'rental' | 'check-in' | 'customer' | 'rental-edit' | 'reservation' | 'maintenance' | 'reservation-edit' | 'maintenance-edit', entityIndex?: number | string) => {
        const newState: Partial<typeof state> = { 
            editingVehicleIndex: null, 
            editingCustomerIndex: null,
            editingRentalId: null,
            editingReservationId: null,
            editingMaintenanceId: null,
        };

        if (modalType === 'vehicle') {
            newState.isVehicleModalOpen = true;
            if (typeof entityIndex === 'number') newState.editingVehicleIndex = entityIndex;
        }
        if (modalType === 'rental') {
            newState.isRentalModalOpen = true;
            newState.rentalFormCustomerType = 'existing'; // Reset to default
            if (typeof entityIndex === 'number') newState.selectedVehicleForAction = vehiclesData[entityIndex];
        }
        if (modalType === 'check-in') {
            newState.isCheckInModalOpen = true;
            if (typeof entityIndex === 'number') newState.selectedVehicleForAction = vehiclesData[entityIndex];
        }
        if (modalType === 'customer') {
            newState.isCustomerModalOpen = true;
            if (typeof entityIndex === 'number') newState.editingCustomerIndex = entityIndex;
        }
        if (modalType === 'rental-edit') {
            newState.isRentalEditModalOpen = true;
            if (entityIndex !== undefined) newState.editingRentalId = parseInt(String(entityIndex), 10); // String'i sayıya çevir.
        }
        if (modalType === 'reservation') {
            newState.isReservationModalOpen = true;
        }
        if (modalType === 'maintenance') {
            newState.isMaintenanceModalOpen = true;
        }
        if (modalType === 'maintenance-edit') {
            newState.isMaintenanceEditModalOpen = true;
            if (entityIndex !== undefined) newState.editingMaintenanceId = parseInt(String(entityIndex), 10); // String'i sayıya çevir.
        }
        if (modalType === 'reservation-edit') {
            newState.isReservationEditModalOpen = true;
            if (entityIndex !== undefined) newState.editingReservationId = parseInt(String(entityIndex), 10); // String'i sayıya çevir.
        }
        
        setState(newState);
    };

    const closeModal = (modalType: 'vehicle' | 'rental' | 'check-in' | 'customer' | 'rental-edit' | 'reservation' | 'maintenance' | 'reservation-edit' | 'maintenance-edit') => {
        const newState: Partial<typeof state> = { 
            selectedVehicleForAction: null, 
            editingVehicleIndex: null,
            editingCustomerIndex: null,
            editingRentalId: null,
            editingReservationId: null,
            editingMaintenanceId: null,
        };
        switch(modalType) {
            case 'vehicle': newState.isVehicleModalOpen = false; break;
            case 'rental': newState.isRentalModalOpen = false; break;
            case 'check-in': newState.isCheckInModalOpen = false; break;
            case 'customer': newState.isCustomerModalOpen = false; break;
            case 'rental-edit': newState.isRentalEditModalOpen = false; break;
            case 'reservation': newState.isReservationModalOpen = false; break;
            case 'maintenance': newState.isMaintenanceModalOpen = false; break;
            case 'maintenance-edit': newState.isMaintenanceEditModalOpen = false; break;
            case 'reservation-edit': newState.isReservationEditModalOpen = false; break;
        }
        setState(newState);
    };

    // Open vehicle modal
    document.getElementById('add-vehicle-btn')?.addEventListener('click', () => openModal('vehicle'));
    document.getElementById('add-customer-btn')?.addEventListener('click', () => openModal('customer'));
    // Open reservation/maintenance modals
    document.getElementById('add-reservation-btn')?.addEventListener('click', () => openModal('reservation'));
    document.getElementById('add-maintenance-btn')?.addEventListener('click', () => openModal('maintenance'));


    // Open rental/check-in modals
    document.querySelectorAll('.btn-rent').forEach(btn => {
        const card = btn.closest('.vehicle-card') as HTMLElement;
        const vehicleIndex = parseInt(card.dataset.vehicleIndex, 10);
        btn.addEventListener('click', () => openModal('rental', vehicleIndex));
    });
    
    document.querySelectorAll('.btn-check-in').forEach(btn => {
        const card = btn.closest('.vehicle-card') as HTMLElement;
        const vehicleIndex = parseInt(card.dataset.vehicleIndex, 10);
        btn.addEventListener('click', () => openModal('check-in', vehicleIndex));
    });

    // Edit/Delete vehicle buttons
    document.querySelectorAll('.btn-edit-vehicle').forEach(btn => {
        const card = btn.closest('.vehicle-card') as HTMLElement;
        const vehicleIndex = parseInt(card.dataset.vehicleIndex, 10);
        btn.addEventListener('click', () => openModal('vehicle', vehicleIndex));
    });

    document.querySelectorAll('.btn-delete-vehicle').forEach(btn => {
        const card = btn.closest('.vehicle-card') as HTMLElement;
        const vehicleIndex = parseInt(card.dataset.vehicleIndex, 10);
        btn.addEventListener('click', () => {
            const vehicle = vehiclesData[vehicleIndex];
            if (confirm(`'${vehicle.plate}' plakalı aracı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
                vehiclesData.splice(vehicleIndex, 1);
                setState({}); // Trigger re-render and save which also calls saveDataToLocalStorage
            }
        });
    });

    // Edit/Delete customer buttons
    document.querySelectorAll('.btn-edit-customer').forEach(btn => {
        const accordion = btn.closest('.customer-accordion') as HTMLElement;
        const customerIndex = parseInt(accordion.dataset.customerIndex, 10);
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent accordion from opening/closing
            openModal('customer', customerIndex);
        });
    });

    document.querySelectorAll('.btn-delete-customer').forEach(btn => {
        const accordion = btn.closest('.customer-accordion') as HTMLElement;
        const customerIndex = parseInt(accordion.dataset.customerIndex, 10);
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const customer = customersData[customerIndex];
            if (confirm(`'${customer.name}' adlı müşteriyi silmek istediğinizden emin misiniz?`)) {
                customersData.splice(customerIndex, 1);
                setState({}); // Trigger re-render and save
            }
        });
    });

    // View Maintenance History button on vehicle card
    document.querySelectorAll('.btn-view-maintenance').forEach(btn => {
        const card = btn.closest('.vehicle-card') as HTMLElement;
        const vehicleIndex = parseInt(card.dataset.vehicleIndex, 10);
        const vehicle = vehiclesData[vehicleIndex];
        if (vehicle) {
            btn.addEventListener('click', () => {
                setState({ activePage: 'maintenance', searchTerm: vehicle.plate });
            });
        }
    });

    // --- RENTAL CARD BUTTONS (Event Delegation) ---
    const rentalsList = document.querySelector('.rentals-list');
    if (rentalsList) {
        rentalsList.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const card = target.closest('.rental-card') as HTMLElement;
            if (!card) return;

            const rentalId = card.dataset.rentalId;
            if (!rentalId) return;

            // Find the specific button that was clicked
            const deleteButton = target.closest('.btn-delete-rental');
            const editButton = target.closest('.btn-edit-rental');
            const uploadButton = target.closest('.btn-upload-rental-doc');
            const printButton = target.closest('.btn-print-summary');

            if (deleteButton) {
                if (confirm(`Bu kiralama kaydını silmek istediğinizden emin misiniz?`)) {
                    const rentalIndex = rentalsData.findIndex(r => r.id === parseInt(rentalId, 10));
                    if (rentalIndex > -1) {
                        rentalsData.splice(rentalIndex, 1);
                        setState({}); // Trigger re-render and save
                    }
                }
            } else if (editButton || uploadButton) {
                openModal('rental-edit', rentalId);
            } else if (printButton) {
                const rental = rentalsData.find(r => r.id === parseInt(rentalId, 10));
                if (rental) {
                    generateRentalSummaryPDF(rental);
                } else {
                    console.error('Yazdırmak için kiralama bulunamadı:', rentalId);
                }
            }
        });
    }
    // --- END RENTAL CARD BUTTONS ---

    // Dashboard -> Vehicle Page filtering
    document.querySelectorAll('.distribution-item-reimagined').forEach(item => {
        const statusFilter = (item as HTMLElement).dataset.statusFilter;
        if (statusFilter) {
            item.addEventListener('click', () => {
                setState({ activePage: 'vehicles', vehicleStatusFilter: statusFilter, searchTerm: '' });
            });
        }
    });

    // Edit/Delete reservation buttons
    document.querySelectorAll('.btn-edit-reservation').forEach(btn => {
        const card = btn.closest('.reservation-card') as HTMLElement;
        const reservationId = card.dataset.reservationId;
        btn.addEventListener('click', () => openModal('reservation-edit', reservationId));
    });

    document.querySelectorAll('.btn-delete-reservation').forEach(btn => {
        const card = btn.closest('.reservation-card') as HTMLElement;
        const reservationId = parseInt(card.dataset.reservationId, 10);
        btn.addEventListener('click', () => {
            if (confirm(`Bu rezervasyon kaydını silmek istediğinizden emin misiniz?`)) {
                const resIndex = reservationsData.findIndex(r => r.id === reservationId);
                if (resIndex > -1) {
                    reservationsData.splice(resIndex, 1);
                    setState({}); // Trigger re-render and save
                }
            }
        });
    });

    // Edit/Delete maintenance buttons
    document.querySelectorAll('.btn-edit-maintenance').forEach(btn => {
        const card = btn.closest('.maintenance-card') as HTMLElement;
        const maintenanceId = card.dataset.maintenanceId;
        btn.addEventListener('click', () => openModal('maintenance-edit', maintenanceId));
    });

    document.querySelectorAll('.btn-delete-maintenance').forEach(btn => {
        const card = btn.closest('.maintenance-card') as HTMLElement;
        const maintenanceId = parseInt(card.dataset.maintenanceId, 10);
        btn.addEventListener('click', () => {
            if (confirm(`Bu bakım kaydını silmek istediğinizden emin misiniz?`)) {
                const maintIndex = maintenanceData.findIndex(m => m.id === maintenanceId);
                if (maintIndex > -1) {
                    maintenanceData.splice(maintIndex, 1);
                    setState({}); // Trigger re-render and save
                }
            }
        });
    });

    document.getElementById('vehicle-form')?.addEventListener('submit', handleVehicleFormSubmit);
    document.getElementById('customer-form')?.addEventListener('submit', handleCustomerFormSubmit);
    document.getElementById('rental-form')?.addEventListener('submit', handleRentalFormSubmit);
    document.getElementById('check-in-form')?.addEventListener('submit', handleCheckInFormSubmit);
    document.getElementById('rental-edit-form')?.addEventListener('submit', handleRentalEditFormSubmit);
    document.getElementById('reservation-form')?.addEventListener('submit', handleReservationFormSubmit);
    document.getElementById('reservation-edit-form')?.addEventListener('submit', handleReservationEditFormSubmit);
    document.getElementById('maintenance-form')?.addEventListener('submit', handleMaintenanceFormSubmit);
    document.getElementById('maintenance-edit-form')?.addEventListener('submit', handleMaintenanceEditFormSubmit);

    // Close modal listeners for buttons with data-modal-id
    document.querySelectorAll('.close-modal-btn, .modal-footer .btn-secondary').forEach(btn => {
        const modalIdWithSuffix = (btn as HTMLElement).dataset.modalId;
        if (modalIdWithSuffix) {
            const modalId = modalIdWithSuffix.replace('-modal', '');
            btn.addEventListener('click', () => closeModal(modalId as any));
        }
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) {
                const modalId = overlay.id.replace('-modal-overlay', '');
                closeModal(modalId as any);
            }
        });
    });

    // Customer Accordion
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const content = accordionItem.querySelector('.accordion-content') as HTMLElement;
            const arrow = header.querySelector('.accordion-arrow');
            
            accordionItem.classList.toggle('active');
            if (accordionItem.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 40 + "px"; // Add padding
                if(arrow) (arrow as HTMLElement).style.transform = 'rotate(180deg)';
            } else {
                content.style.maxHeight = null;
                if(arrow) (arrow as HTMLElement).style.transform = 'rotate(0deg)';
            }
        });
    });

    // Search functionality
    const handleSearch = (e: Event) => {
        const searchTerm = (e.target as HTMLInputElement).value;
        setState({ searchTerm });
    };
    document.getElementById('vehicle-search')?.addEventListener('input', handleSearch);
    document.getElementById('customer-search')?.addEventListener('input', handleSearch);
    document.getElementById('rental-search')?.addEventListener('input', handleSearch);
    document.getElementById('reservation-search')?.addEventListener('input', handleSearch);
    document.getElementById('maintenance-search')?.addEventListener('input', handleSearch);

    // Clear Maintenance Filter Button
    document.getElementById('clear-maintenance-filter')?.addEventListener('click', () => {
        setState({ searchTerm: '' });
    });

    // Vehicle Page Expiring Filter Button
    document.getElementById('filter-expiring-btn')?.addEventListener('click', () => {
        setState({ filterExpiring: !state.filterExpiring });
    });

    // Rental Modal Customer Type Toggle
    document.querySelectorAll('input[name="customerType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const value = (e.target as HTMLInputElement).value;
            
            // Toggle required attributes to fix form submission
            const customerSelect = document.getElementById('customer-id-select') as HTMLSelectElement;
            const newCustomerName = document.getElementById('new-customer-name') as HTMLInputElement;
            const newCustomerTc = document.getElementById('new-customer-tc') as HTMLInputElement;
            const newCustomerPhone = document.getElementById('new-customer-phone') as HTMLInputElement;

            if (value === 'new') {
                customerSelect.required = false;
                newCustomerName.required = true;
                newCustomerTc.required = true;
                newCustomerPhone.required = true;
            } else {
                customerSelect.required = true;
                newCustomerName.required = false;
                newCustomerTc.required = false;
                newCustomerPhone.required = false;
            }

            setState({ rentalFormCustomerType: value as 'existing' | 'new' });
        });
    });

    // Reservation Modal Customer Type Toggle
    document.querySelectorAll('input[name="customerType"][id^="res-"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const value = (e.target as HTMLInputElement).value;
            const existingSection = document.getElementById('res-existing-customer-section');
            const newSection = document.getElementById('res-new-customer-section');
            const customerSelect = document.getElementById('res-customer-id-select') as HTMLSelectElement;
            const newName = document.getElementById('res-new-customer-name') as HTMLInputElement;
            const newPhone = document.getElementById('res-new-customer-phone') as HTMLInputElement;

            existingSection.style.display = value === 'existing' ? 'flex' : 'none';
            newSection.style.display = value === 'new' ? 'block' : 'none';
            customerSelect.required = value === 'existing';
            newName.required = value === 'new';
            newPhone.required = value === 'new';
        });
    });

    // Auto-calculate next maintenance date/km
    const maintenanceKmInput = document.getElementById('maintenance-km') as HTMLInputElement;
    const maintenanceDateInput = document.getElementById('maintenance-date') as HTMLInputElement;
    const nextKmInput = document.getElementById('next-maintenance-km') as HTMLInputElement;
    const nextDateInput = document.getElementById('next-maintenance-date') as HTMLInputElement;

    const updateNextMaintenance = () => {
        if (maintenanceKmInput && nextKmInput) {
            nextKmInput.value = (parseInt(maintenanceKmInput.value || '0') + 15000).toString();
        }
        if (maintenanceDateInput && nextDateInput && maintenanceDateInput.value) {
            const nextDate = new Date(maintenanceDateInput.value);
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            nextDateInput.value = nextDate.toISOString().split('T')[0];
        }
    };

    maintenanceKmInput?.addEventListener('input', updateNextMaintenance);
    maintenanceDateInput?.addEventListener('input', updateNextMaintenance);
    // console.log('Event listeners attached successfully.');
    } catch (error) {
        console.error('!!! HATA: attachEventListeners fonksiyonunda bir sorun oluştu:', error);
    }
}

function handleVehicleFormSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
    const insuranceFile = formData.get('insuranceFile') as File;
    const inspectionFile = formData.get('inspectionFile') as File;
    const licenseFile = formData.get('licenseFile') as File;

    const vehicleDataUpdate: any = {
        plate: formData.get('plate') as string,
        brand: `${formData.get('brand')} ${formData.get('model')}`,
        km: (formData.get('km') as string || '').replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        status: formData.get('status') as string,
        insuranceDate: formData.get('insuranceDate') as string,
        inspectionDate: formData.get('inspectionDate') as string,
    };

    if (state.editingVehicleIndex !== null) {
        // Editing existing vehicle
        const originalVehicle = vehiclesData[state.editingVehicleIndex];

        // Handle file updates: only update if a new file is selected
        if (insuranceFile && insuranceFile.size > 0) {
            if (originalVehicle.insuranceFileUrl) URL.revokeObjectURL(originalVehicle.insuranceFileUrl);
            vehicleDataUpdate.insuranceFile = insuranceFile.name;
            vehicleDataUpdate.insuranceFileUrl = URL.createObjectURL(insuranceFile);
        }
        if (inspectionFile && inspectionFile.size > 0) {
            if (originalVehicle.inspectionFileUrl) URL.revokeObjectURL(originalVehicle.inspectionFileUrl);
            vehicleDataUpdate.inspectionFile = inspectionFile.name;
            vehicleDataUpdate.inspectionFileUrl = URL.createObjectURL(inspectionFile);
        }
        if (licenseFile && licenseFile.size > 0) {
            if (originalVehicle.licenseFileUrl) URL.revokeObjectURL(originalVehicle.licenseFileUrl);
            vehicleDataUpdate.licenseFile = licenseFile.name;
            vehicleDataUpdate.licenseFileUrl = URL.createObjectURL(licenseFile);
        }

        vehiclesData[state.editingVehicleIndex] = { ...originalVehicle, ...vehicleDataUpdate };
    } else {
        // Adding new vehicle
        if (insuranceFile && insuranceFile.size > 0) {
            vehicleDataUpdate.insuranceFile = insuranceFile.name;
            vehicleDataUpdate.insuranceFileUrl = URL.createObjectURL(insuranceFile);
        }
        if (inspectionFile && inspectionFile.size > 0) {
            vehicleDataUpdate.inspectionFile = inspectionFile.name;
            vehicleDataUpdate.inspectionFileUrl = URL.createObjectURL(inspectionFile);
        }
        if (licenseFile && licenseFile.size > 0) {
            vehicleDataUpdate.licenseFile = licenseFile.name;
            vehicleDataUpdate.licenseFileUrl = URL.createObjectURL(licenseFile);
        }
        logActivity('fa-car-side', `<strong>${vehicleDataUpdate.plate}</strong> plakalı yeni araç filoya eklendi.`);
        vehiclesData.unshift(vehicleDataUpdate); // Add to the beginning of the array
    }

    setState({
        isVehicleModalOpen: false,
        editingVehicleIndex: null,
    });
    } catch(error) {
        console.error("!!! HATA: handleVehicleFormSubmit içinde:", error);
    }
}

function handleCustomerFormSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
    const idFile = formData.get('idFile') as File;
    const licenseFile = formData.get('licenseFile') as File;

    const customerDataUpdate: any = {
        name: formData.get('name') as string,
        tc: formData.get('tc') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        licenseNumber: formData.get('licenseNumber') as string,
        licenseDate: formData.get('licenseDate') as string,
        address: formData.get('address') as string,
    };

    if (state.editingCustomerIndex !== null) {
        // Editing existing customer
        const originalCustomer = customersData[state.editingCustomerIndex];
        if (idFile && idFile.size > 0) {
            if (originalCustomer.idFileUrl) URL.revokeObjectURL(originalCustomer.idFileUrl);
            customerDataUpdate.idFile = idFile.name;
            customerDataUpdate.idFileUrl = URL.createObjectURL(idFile);
        }
        if (licenseFile && licenseFile.size > 0) {
            if (originalCustomer.licenseFileUrl) URL.revokeObjectURL(originalCustomer.licenseFileUrl);
            customerDataUpdate.licenseFile = licenseFile.name;
            customerDataUpdate.licenseFileUrl = URL.createObjectURL(licenseFile);
        }
        customersData[state.editingCustomerIndex] = { ...originalCustomer, ...customerDataUpdate };
    } else {
        // Adding new customer
        if (idFile && idFile.size > 0) {
            customerDataUpdate.idFile = idFile.name;
            customerDataUpdate.idFileUrl = URL.createObjectURL(idFile);
        }
        if (licenseFile && licenseFile.size > 0) {
            customerDataUpdate.licenseFile = licenseFile.name;
            customerDataUpdate.licenseFileUrl = URL.createObjectURL(licenseFile);
        }
        const newCustomer: Customer = {
            id: Date.now(),
            rentals: [],
            ...customerDataUpdate
        };
        logActivity('fa-user-plus', `<strong>${newCustomer.name}</strong> adında yeni müşteri kaydedildi.`);
        customersData.unshift(newCustomer);
    }

    setState({
        isCustomerModalOpen: false,
        editingCustomerIndex: null,
    });
    } catch(error) {
        console.error("!!! HATA: handleCustomerFormSubmit içinde:", error);
    }
}

function handleRentalEditFormSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const rentalId = parseInt(formData.get('rentalId') as string, 10);

    try {
    const rentalIndex = rentalsData.findIndex(r => r.id === rentalId);
    if (rentalIndex === -1) return;

    const originalRental = rentalsData[rentalIndex];
    const contractFile = formData.get('contractFile') as File;
    const invoiceFile = formData.get('invoiceFile') as File;

    const rentalDataUpdate: any = {
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string || null,
        startKm: parseInt(formData.get('startKm') as string, 10),
        endKm: formData.get('endKm') ? parseInt(formData.get('endKm') as string, 10) : null,
    };

    if (contractFile && contractFile.size > 0) {
        if (originalRental.contractFileUrl) URL.revokeObjectURL(originalRental.contractFileUrl);
        rentalDataUpdate.contractFile = contractFile.name;
        rentalDataUpdate.contractFileUrl = URL.createObjectURL(contractFile);
    }
    if (invoiceFile && invoiceFile.size > 0) {
        if (originalRental.invoiceFileUrl) URL.revokeObjectURL(originalRental.invoiceFileUrl);
        rentalDataUpdate.invoiceFile = invoiceFile.name;
        rentalDataUpdate.invoiceFileUrl = URL.createObjectURL(invoiceFile);
    }

    rentalsData[rentalIndex] = { ...originalRental, ...rentalDataUpdate };
    setState({ isRentalEditModalOpen: false, editingRentalId: null });
    } catch(error) {
        console.error("!!! HATA: handleRentalEditFormSubmit içinde:", error);
    }
}

function handleReservationEditFormSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const reservationId = parseInt(formData.get('reservationId') as string, 10);

    try {
    const resIndex = reservationsData.findIndex(r => r.id === reservationId);
    if (resIndex === -1) return;

    const originalReservation = reservationsData[resIndex];

    const updatedReservation: Reservation = {
        ...originalReservation,
        vehiclePlate: formData.get('vehiclePlate') as string,
        customerId: parseInt(formData.get('customerId') as string, 10),
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string,
        deliveryLocation: formData.get('deliveryLocation') as string,
        notes: formData.get('notes') as string || null,
    };

    reservationsData[resIndex] = updatedReservation;
    setState({ isReservationEditModalOpen: false, editingReservationId: null });
    } catch(error) {
        console.error("!!! HATA: handleReservationEditFormSubmit içinde:", error);
    }
}

function handleReservationFormSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
    let customerId: number;
    const customerType = formData.get('customerType');

    if (customerType === 'new') {
        const newCustomer: Customer = {
            id: Date.now(),
            name: formData.get('newCustomerName') as string,
            phone: formData.get('newCustomerPhone') as string,
            tc: '', email: '', address: '', licenseNumber: '', licenseDate: '',
            idFile: null, idFileUrl: null, licenseFile: null, licenseFileUrl: null,
            rentals: [],
        };
        customersData.unshift(newCustomer);
        customerId = newCustomer.id;
    } else {
        customerId = parseInt(formData.get('customerId') as string, 10);
        if (!customersData.some(c => c.id === customerId)) {
            alert('Lütfen geçerli bir müşteri seçin.');
            return;
        }
    }

    const vehiclePlate = formData.get('vehiclePlate') as string;
    if (!vehiclesData.some(v => v.plate === vehiclePlate)) {
        alert('Lütfen geçerli bir araç seçin.');
        return;
    }

    const newReservation: Reservation = {
        id: Date.now(),
        vehiclePlate: vehiclePlate,
        customerId: customerId,
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string,
        deliveryLocation: formData.get('deliveryLocation') as string,
        notes: formData.get('notes') as string || null,
        status: 'active',
    };

    reservationsData.unshift(newReservation);
    setState({ isReservationModalOpen: false });
    } catch(error) {
        console.error("!!! HATA: handleReservationFormSubmit içinde:", error);
    }
}

function handleRentalFormSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
    let customerId: number;
    let customerName: string;
    let customerPhone: string;

    const customerType = formData.get('customerType');

    if (customerType === 'new') {
        // Create and add new customer
        const newCustomer: Customer = {
            id: Date.now(), // Simple unique ID
            name: formData.get('newCustomerName') as string,
            tc: formData.get('newCustomerTc') as string,
            phone: formData.get('newCustomerPhone') as string,
            email: formData.get('newCustomerEmail') as string,
            address: '',
            licenseNumber: '',
            licenseDate: '',
            idFile: null, idFileUrl: null,
            licenseFile: null, licenseFileUrl: null,
            rentals: [],
        };
        customersData.unshift(newCustomer);
        customerId = newCustomer.id;
        customerName = newCustomer.name;
        customerPhone = newCustomer.phone;
    } else {
        // Get existing customer
        customerId = parseInt(formData.get('customerId') as string, 10);
        const customer = customersData.find(c => c.id === customerId);
        if (!customer) {
            alert('Lütfen geçerli bir müşteri seçin.');
            return;
        }
        customerName = customer.name;
        customerPhone = customer.phone;
    }

    // Create new rental record
    const newRental: Rental = {
        id: Date.now(),
        vehiclePlate: formData.get('vehiclePlate') as string,
        customerId: customerId,
        startDate: formData.get('startDate') as string,
        endDate: null,
        startKm: parseInt((formData.get('startKm') as string).replace(/,/, ''), 10),
        endKm: null,
        price: parseFloat(formData.get('price') as string),
        priceType: formData.get('priceType') as 'daily' | 'monthly',
        totalCost: null,
        contractFile: null, contractFileUrl: null,
        invoiceFile: null, invoiceFileUrl: null,
        status: 'active',
    };
    rentalsData.unshift(newRental);

    // Update vehicle status
    const vehicleIndex = vehiclesData.findIndex(v => v.plate === newRental.vehiclePlate);
    if (vehicleIndex > -1) {
        vehiclesData[vehicleIndex].status = 'Kirada';
        vehiclesData[vehicleIndex].rentedBy = { name: customerName, phone: customerPhone };
        vehiclesData[vehicleIndex].activeRentalId = newRental.id;
        logActivity('fa-file-signature', `<strong>${customerName}</strong>, <em>${newRental.vehiclePlate}</em> plakalı aracı kiraladı.`);
    }

    // Close modal and re-render
    setState({ isRentalModalOpen: false });
    } catch(error) {
        console.error("!!! HATA: handleRentalFormSubmit içinde:", error);
    }
}

function handleCheckInFormSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
    const rentalId = parseInt(formData.get('rentalId') as string, 10);
    const returnDate = formData.get('returnDate') as string;
    const returnKm = parseInt(formData.get('returnKm') as string, 10);

    // Find and update rental
    const rentalIndex = rentalsData.findIndex(r => r.id === rentalId);
    if (rentalIndex === -1) {
        alert('Hata: Kiralama kaydı bulunamadı.');
        return;
    }
    const rental = rentalsData[rentalIndex];
    rental.endDate = returnDate;
    rental.endKm = returnKm;
    rental.status = 'completed';

    // Calculate total cost
    const startDate = new Date(rental.startDate);
    const endDate = new Date(returnDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysRented = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24))); // Min 1 day
    
    if (rental.priceType === 'daily') {
        rental.totalCost = daysRented * rental.price;
    } else { // monthly
        const monthsRented = daysRented / 30;
        rental.totalCost = monthsRented * rental.price;
    }

    // Find and update vehicle
    const vehicleIndex = vehiclesData.findIndex(v => v.plate === rental.vehiclePlate);
    if (vehicleIndex > -1) {
        vehiclesData[vehicleIndex].status = 'Müsait';
        vehiclesData[vehicleIndex].km = returnKm.toLocaleString('tr-TR');
        delete vehiclesData[vehicleIndex].rentedBy;
        delete vehiclesData[vehicleIndex].activeRentalId;
        const customer = customersData.find(c => c.id === rental.customerId);
        if (customer) {
            logActivity('fa-right-to-bracket', `<em>${rental.vehiclePlate}</em> plakalı araç <strong>${customer.name}</strong>'dan teslim alındı.`);
        }
    }

    // Close modal and re-render
    setState({ isCheckInModalOpen: false });
    } catch(error) {
        console.error("!!! HATA: handleCheckInFormSubmit içinde:", error);
    }
}

function handleMaintenanceFormSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
    const newMaintenance: Maintenance = {
        id: Date.now(),
        vehiclePlate: formData.get('vehiclePlate') as string,
        maintenanceDate: formData.get('maintenanceDate') as string,
        maintenanceKm: parseInt(formData.get('maintenanceKm') as string, 10),
        type: formData.get('type') as string,
        cost: parseFloat(formData.get('cost') as string),
        description: formData.get('description') as string,
        nextMaintenanceKm: parseInt(formData.get('nextMaintenanceKm') as string, 10),
        nextMaintenanceDate: formData.get('nextMaintenanceDate') as string,
    };

    maintenanceData.unshift(newMaintenance);
    logActivity('fa-oil-can', `<em>${newMaintenance.vehiclePlate}</em> plakalı araca bakım kaydı girildi.`);
    setState({ isMaintenanceModalOpen: false });
    } catch(error) {
        console.error("!!! HATA: handleMaintenanceFormSubmit içinde:", error);
    }
}

function handleMaintenanceEditFormSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const maintenanceId = parseInt(formData.get('maintenanceId') as string, 10);

    try {
    const maintIndex = maintenanceData.findIndex(m => m.id === maintenanceId);
    if (maintIndex === -1) return;

    const originalMaintenance = maintenanceData[maintIndex];

    const updatedMaintenance: Maintenance = {
        ...originalMaintenance,
        vehiclePlate: formData.get('vehiclePlate') as string,
        maintenanceDate: formData.get('maintenanceDate') as string,
        maintenanceKm: parseInt(formData.get('maintenanceKm') as string, 10),
        type: formData.get('type') as string,
        cost: parseFloat(formData.get('cost') as string),
        description: formData.get('description') as string,
        nextMaintenanceKm: parseInt(formData.get('nextMaintenanceKm') as string, 10),
        nextMaintenanceDate: formData.get('nextMaintenanceDate') as string,
    };

    maintenanceData[maintIndex] = updatedMaintenance;
    setState({ isMaintenanceEditModalOpen: false, editingMaintenanceId: null });
    } catch(error) {
        console.error("!!! HATA: handleMaintenanceEditFormSubmit içinde:", error);
    }
}

function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " yıl önce";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " ay önce";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " gün önce";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " saat önce";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " dakika önce";
    return "az önce";
}


function generateRentalSummaryPDF(rental: Rental) {
  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF();

  const customer = customersData.find(c => c.id === rental.customerId);
  const vehicle = vehiclesData.find(v => v.plate === rental.vehiclePlate);

  const formatDate = (dateStr: string | null) => dateStr ? new Date(dateStr).toLocaleDateString('tr-TR') : 'Belirtilmemiş';
  const formatKm = (km: number | null) => km ? km.toLocaleString('tr-TR') + ' km' : 'N/A';
  const formatCost = (cost: number | null) => cost ? `₺${cost.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Hesaplanmadı';

  // Renkler
  const primaryColor = '#1e293b'; // Koyu Mavi/Siyah
  const secondaryColor = '#64748b'; // Gri
  const accentColor = '#3b82f6'; // Mavi
  const backgroundColor = '#f8fafc'; // Çok açık gri

  // Logo (Base64 formatında)
  const logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABFSURBVHhe7cExAQAAAMKg9U9tCF8gAAAAAAAAAAAAAAB+DwN2AAGAACQAAAAAAAAAAAAAALAbAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAAAAALAZAAYAAZAAAAAAAAAAAA-';

  // Üst Bilgi
  doc.addImage(logo, 'PNG', 14, 12, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(primaryColor);
  doc.text('Rehber Otomotiv', 48, 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(secondaryColor);
  doc.text('Filo Kiralama ve Yönetim Çözümleri', 48, 28);

  doc.setFontSize(10);
  doc.text(`Kayıt No: ${rental.id}`, 200, 18, { align: 'right' });
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 200, 24, { align: 'right' });

  // Başlık
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text('Kiralama Özeti', 105, 50, { align: 'center' });

  let y = 65;

  // Helper to draw a section
  const drawSection = (title: string, data: { label: string, value: string }[], icon: string) => {
    doc.setFillColor(backgroundColor);
    doc.roundedRect(14, y - 5, 182, (data.length * 8) + 15, 3, 3, 'F');

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentColor);
    doc.text(title, 25, y + 2);
    doc.setFontSize(16);
    doc.text(icon, 185, y + 2, { align: 'center' });

    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    data.forEach(item => {
      doc.setTextColor(secondaryColor);
      doc.text(item.label, 20, y);
      doc.setTextColor(primaryColor);
      doc.setFont('helvetica', 'bold');
      doc.text(item.value, 65, y);
      doc.setFont('helvetica', 'normal');
      y += 8;
    });
    y += 10; // Add space after section
  };

  // Müşteri Bilgileri
  drawSection('Müşteri Bilgileri', [
    { label: 'Ad Soyad:', value: customer?.name || 'N/A' },
    { label: 'TC Kimlik No:', value: customer?.tc || 'N/A' },
    { label: 'Telefon:', value: customer?.phone || 'N/A' },
    { label: 'E-posta:', value: customer?.email || 'N/A' },
  ], '👤');

  // Araç Bilgileri
  drawSection('Araç Bilgileri', [
    { label: 'Plaka:', value: rental.vehiclePlate },
    { label: 'Marka/Model:', value: vehicle?.brand || 'N/A' },
  ], '🚗');

  // Kiralama Detayları
  drawSection('Kiralama Detayları', [
    { label: 'Başlangıç Tarihi:', value: formatDate(rental.startDate) },
    { label: 'Bitiş Tarihi:', value: formatDate(rental.endDate) },
    { label: 'Başlangıç KM:', value: formatKm(rental.startKm) },
    { label: 'Bitiş KM:', value: formatKm(rental.endKm) },
    { label: 'Kiralama Tipi:', value: rental.priceType === 'daily' ? 'Günlük' : 'Aylık' },
  ], '📅');

  // Toplam Ücret
  doc.setFillColor(accentColor);
  doc.roundedRect(14, y, 182, 20, 3, 3, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#ffffff');
  doc.text('TOPLAM ÜCRET', 20, y + 12.5);
  doc.setFontSize(18);
  doc.text(formatCost(rental.totalCost), 190, y + 12.5, { align: 'right' });

  // Footer
  doc.setDrawColor(secondaryColor);
  doc.line(14, 280, 196, 280);
  doc.setFontSize(9);
  doc.setTextColor(secondaryColor);
  doc.text('Bizi tercih ettiğiniz için teşekkür ederiz.', 105, 285, { align: 'center' });

  doc.save(`kiralama-ozeti-${rental.vehiclePlate}-${rental.id}.pdf`);
}

/**
 * Ekranda geçici bir bildirim (toast) gösterir.
 * @param message Gösterilecek mesaj.
 * @param type 'success' veya 'error'
 * @param duration Bildirimin ekranda kalma süresi (ms).
 */
function showToast(message: string, type: 'success' | 'error' = 'success', duration: number = 4000) {
    // Toast container'ı oluştur veya mevcut olanı bul
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-times-circle';
    
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Animasyonla göster
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Belirtilen süre sonunda kaldır
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 500); // CSS animasyonunun bitmesini bekle
    }, duration);
}

// Uygulama ilk yüklendiğinde verileri localStorage'dan yükleme fonksiyonu
function loadDataFromLocalStorage() {
    const savedData = localStorage.getItem('rehberOtomotivData');
    if (savedData) {
        try {
            const appData = JSON.parse(savedData);
            // Sadece appData'da varsa üzerine yaz, yoksa mevcut mockup veriyi koru.
            if (appData.vehiclesData) vehiclesData = appData.vehiclesData;
            if (appData.customersData) customersData = appData.customersData;
            if (appData.rentalsData) rentalsData = appData.rentalsData;
            if (appData.reservationsData) reservationsData = appData.reservationsData;
            if (appData.maintenanceData) maintenanceData = appData.maintenanceData;
            
            // Aktiviteler, JSON'dan yüklenirken Date objesine geri çevrilmeli.
            if (appData.activitiesData) {
                activitiesData = appData.activitiesData.map(activity => ({...activity, time: new Date(activity.time)}));
            }
            
            // State'e ait verileri yükle
            if (appData.theme) state.theme = appData.theme;
            if (appData.readNotifications) state.readNotifications = appData.readNotifications;
            if (appData.settings) state.settings = { ...state.settings, ...appData.settings };
        } catch (e) {
            console.error("!!! HATA: localStorage'dan veri okunurken bir sorun oluştu. Kayıtlı veri bozuk olabilir.", e);
        }
    }

    // İçe aktarma sonrası başarı mesajını göster
    if (localStorage.getItem('showImportSuccessToast') === 'true') {
        showToast('Veriler başarıyla içe aktarıldı!', 'success');
        localStorage.removeItem('showImportSuccessToast'); // Mesajı gösterdikten sonra işareti kaldır
    }
}

// Initial render
loadDataFromLocalStorage(); // Uygulama açılırken verileri yükle
renderApp();
