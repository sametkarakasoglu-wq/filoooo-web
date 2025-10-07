import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import App from './src/app/App';
import './index.css'; // Global stilleri import et

// LocalStorage'dan başarı bildirimini kontrol et ve göster
// Bu mantık App.tsx içinde bir useEffect'e taşınabilir.
const showToastOnLoad = localStorage.getItem('showImportSuccessToast');
if (showToastOnLoad) {
    // showToast('Veriler başarıyla içe aktarıldı!', 'success'); // Toast bileşeni henüz hazır değil.
    console.log("Veriler başarıyla içe aktarıldı!");
    localStorage.removeItem('showImportSuccessToast');
}

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </React.StrictMode>
    );
} else {
    console.error("Kök element ('root') bulunamadı. Uygulama başlatılamıyor.");
}