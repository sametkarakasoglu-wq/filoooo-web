import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectApp, updateSetting, setTheme } from '../features/app/appSlice';
import { exportDataAsJson, importDataFromJson } from '../services/fileService';

// Alt Bileşen: SettingsAccordion
const SettingsAccordion: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`settings-accordion ${isOpen ? 'active' : ''}`}>
            <button className="settings-accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="accordion-title">
                    <i className={`fa-solid ${icon}`}></i>
                    <span>{title}</span>
                </div>
                <i className={`fa-solid fa-chevron-right accordion-arrow ${isOpen ? 'open' : ''}`}></i>
            </button>
            <div className="settings-accordion-content" style={{ maxHeight: isOpen ? '500px' : '0' }}>
                <div className="accordion-content-inner">{children}</div>
            </div>
        </div>
    );
};

// Alt Bileşen: SettingCard
const SettingContentCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="setting-content-card">
        <h4>{title}</h4>
        {children}
    </div>
);

// Ana Bileşen: SettingsPage
const SettingsPage: React.FC = () => {
    const dispatch = useDispatch();
    const { settings, theme } = useSelector(selectApp);
    const storeState = useSelector((state: RootState) => state);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { dataset, value, type, checked } = e.target;
        const key = dataset.settingKey as keyof typeof settings;
        if (key) {
            dispatch(updateSetting({ key, value: type === 'checkbox' ? checked : value }));
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                await importDataFromJson(file);
                // showToast is not implemented yet, but we can log it.
                console.log("İçe aktarma başarılı, sayfa yeniden yükleniyor.");
            } catch (error: any) {
                console.error(error);
                alert(error.message);
            }
        }
    };

    return (
        <>
            <header className="page-header">
                <h1>Ayarlar</h1>
                <p>Uygulama genelindeki tercihlerinizi ve görünümleri yönetin.</p>
            </header>
            <div className="settings-body">
                <SettingsAccordion icon="fa-palette" title="Görünüm ve Tema">
                    <div className="setting-card">
                        <div className="setting-info">
                            <h3>Karanlık Mod</h3>
                            <p>Uygulama arayüzünü açık veya koyu tema arasında değiştirin.</p>
                        </div>
                        <div className="theme-switcher">
                            <i className="fa-solid fa-sun"></i>
                            <label className="switch">
                                <input type="checkbox" checked={theme === 'dark'} onChange={(e) => dispatch(setTheme(e.target.checked ? 'dark' : 'light'))} />
                                <span className="slider round"></span>
                            </label>
                            <i className="fa-solid fa-moon"></i>
                        </div>
                    </div>
                </SettingsAccordion>

                <SettingsAccordion icon="fa-database" title="Yedekleme ve Geri Yükleme">
                     <SettingContentCard title="Veri Yönetimi">
                         <p className="setting-description">Uygulama verilerinizi (araçlar, müşteriler, kiralamalar vb.) bir JSON dosyası olarak yedekleyin veya daha önce aldığınız bir yedeği geri yükleyin.</p>
                         <div className="backup-restore-buttons">
                            <button className="btn btn-secondary" onClick={() => exportDataAsJson(storeState)}>
                                <i className="fa-solid fa-download"></i> Verileri Dışa Aktar
                            </button>
                            <button className="btn btn-secondary" onClick={handleImportClick}>
                                <i className="fa-solid fa-upload"></i> Verileri İçe Aktar
                            </button>
                            <input type="file" ref={fileInputRef} accept=".json" style={{ display: 'none' }} onChange={handleFileImport} />
                        </div>
                    </SettingContentCard>
                </SettingsAccordion>

                {/* Diğer ayar grupları buraya eklenebilir */}

            </div>
        </>
    );
};

export default SettingsPage;