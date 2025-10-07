import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectApp, setActivePage } from './features/app/appSlice';

// Sayfa Bileşenleri
import DashboardPage from './pages/DashboardPage';
import VehiclesPage from './pages/VehiclesPage';
import CustomersPage from './pages/CustomersPage';
import RentalsPage from './pages/RentalsPage';
import ReservationsPage from './pages/ReservationsPage';
import MaintenancePage from './pages/MaintenancePage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';

// Modal Bileşenleri
import VehicleModal from './components/VehicleModal';
import CustomerModal from './components/CustomerModal';
import RentalModal from './components/RentalModal';
import CheckInModal from './components/CheckInModal';
import ReservationModal from './components/ReservationModal';
import MaintenanceModal from './components/MaintenanceModal';
import RentalEditModal from './components/RentalEditModal';
import ReservationEditModal from './components/ReservationEditModal';
import MaintenanceEditModal from './components/MaintenanceEditModal';


const NavSidebar: React.FC = () => {
    const dispatch = useDispatch();
    const { activePage } = useSelector(selectApp);

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

    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <img src="https://storage.googleapis.com/genai-web-experiments/logo-horizontal.png" alt="Rehber Otomotiv Logo" className="sidebar-logo" />
            </div>
            <ul className="nav-menu">
                {navItems.map(item => (
                    <li key={item.id}>
                        <a
                            href="#"
                            className={`nav-link ${activePage === item.id ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(setActivePage(item.id));
                            }}
                        >
                            <i className={item.icon}></i>
                            <span>{item.text}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};


const App: React.FC = () => {
  const { activePage, theme } = useSelector(selectApp);

  React.useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage />;
      case 'vehicles': return <VehiclesPage />;
      case 'customers': return <CustomersPage />;
      case 'rentals': return <RentalsPage />;
      case 'reservations': return <ReservationsPage />;
      case 'maintenance': return <MaintenancePage />;
      case 'notifications': return <NotificationsPage />;
      case 'settings': return <SettingsPage />;
      default: return <div>Sayfa bulunamadı</div>;
    }
  };

  return (
    <>
        <NavSidebar />
        <main className="main-content">
            {renderPage()}
        </main>

        {/* Tüm modalları burada koşullu olarak render et */}
        <VehicleModal />
        <CustomerModal />
        <RentalModal />
        <CheckInModal />
        <ReservationModal />
        <MaintenanceModal />
        <RentalEditModal />
        <ReservationEditModal />
        <MaintenanceEditModal />
    </>
  );
};

export default App;