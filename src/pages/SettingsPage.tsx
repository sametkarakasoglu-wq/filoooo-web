interface SettingsPageProps {
    state: any;
}

const SettingsPage = ({ state }: SettingsPageProps): string => {
  const createSettingCard = (title: string, content: string) => `
      <div class="setting-content-card">
          <h4>${title}</h4>
          ${content}
      </div>
  `;

  const createCheckbox = (id: string, label: string, checked = true) => `
      <div class="setting-checkbox">
          <input type="checkbox" id="${id}" data-setting-key="${id}" ${checked ? 'checked' : ''}>
          <label for="${id}">${label}</label>
      </div>
  `;

  const createColorTag = (label: string, colorVar: string) => `
      <div class="setting-color-tag">
          <span class="color-swatch" style="background-color: var(${colorVar})"></span>
          ${label}
      </div>
  `;

  const sections = [
      {
          icon: 'fa-chart-pie',
          title: 'Gösterge Paneli',
          content: `
              ${createSettingCard('Metrik Görünürlüğü', `
                  ${createCheckbox('db_metric_total', 'Toplam Araç Kartı', state.settings.db_metric_total)}
                  ${createCheckbox('db_metric_rented', 'Aktif Kiralama Kartı', state.settings.db_metric_rented)}
                  ${createCheckbox('db_metric_maintenance', 'Bakımdaki Araçlar Kartı', state.settings.db_metric_maintenance)}
                  ${createCheckbox('db_metric_income', 'Aylık Gelir Kartı', state.settings.db_metric_income)}
              `)}
              ${createSettingCard('Panel Görünürlüğü', `
                  <p class="setting-description">Ana sayfadaki panellerin görünürlüğünü yönetin.</p>
                  ${createCheckbox('db_panel_reminders', 'Yaklaşan Hatırlatmalar Paneli')}
                  ${createCheckbox('db_panel_quick_access', 'Hızlı İşlemler Paneli')}
                  ${createCheckbox('db_panel_activities', 'Son İşlemler Paneli')}
                  ${createCheckbox('db_panel_distribution', 'Filo Durum Dağılımı Paneli')}
              `)}
          `
      },
      {
          icon: 'fa-car',
          title: 'Araç ve Hatırlatmalar',
          content: `
              ${createSettingCard('Hatırlatma Süresi', `
                  <p class="setting-description">Sigorta ve muayene gibi uyarıların kaç gün önceden gösterileceğini belirleyin.</p>
                  <input type="number" class="setting-input" data-setting-key="reminder_days" value="${state.settings.reminder_days}">
              `)}
              ${createSettingCard('Araç Kartı Butonları', `
                  <p class="setting-description">Araçlar sayfasındaki kartlarda görünecek işlem butonlarını seçin.</p>
                  ${createCheckbox('vehicle_btn_rent', 'Kirala Butonu', state.settings.vehicle_btn_rent)}
                  ${createCheckbox('vehicle_btn_checkin', 'Teslim Al Butonu', state.settings.vehicle_btn_checkin)}
                  ${createCheckbox('vehicle_btn_edit', 'Düzenle Butonu', state.settings.vehicle_btn_edit)}
              `)}
          `
      },
      {
          icon: 'fa-bell',
          title: 'Bildirimler',
          content: `
              ${createSettingCard('Bildirim Türleri', `
                  <p class="setting-description">Hangi durumlarda bildirim almak istediğinizi seçin.</p>
                  ${createCheckbox('notif_type_insurance', 'Sigorta Bitiş Uyarısı', state.settings.notif_type_insurance)}
                  ${createCheckbox('notif_type_inspection', 'Muayene Bitiş Uyarısı', state.settings.notif_type_inspection)}
                  ${createCheckbox('notif_type_activity', 'Yeni Sistem Aktiviteleri', state.settings.notif_type_activity)}
              `)}
          `
      },
      {
          icon: 'fa-palette',
          title: 'Görünüm ve Tema',
          content: `
              <div class="setting-card">
                  <div class="setting-info">
                      <h3>Karanlık Mod</h3>
                      <p>Uygulama arayüzünü açık veya koyu tema arasında değiştirin.</p>
                  </div>
                  <div class="theme-switcher">
                      <i class="fa-solid fa-sun"></i>
                      <label class="switch">
                          <input type="checkbox" id="theme-toggle" ${state.theme === 'dark' ? 'checked' : ''} />
                          <span class="slider round"></span>
                      </label>
                      <i class="fa-solid fa-moon"></i>
                  </div>
              </div>
          `
      },
      {
          icon: 'fa-solid fa-database',
          title: 'Yedekleme ve Geri Yükleme',
          content: `
              ${createSettingCard('Veri Yönetimi', `
                  <p class="setting-description">Uygulama verilerinizi (araçlar, müşteriler, kiralamalar vb.) bir JSON dosyası olarak yedekleyin veya daha önce aldığınız bir yedeği geri yükleyin.</p>
                  <div class="backup-restore-buttons">
                      <button class="btn btn-secondary" id="btn-export-data"><i class="fa-solid fa-download"></i> Verileri Dışa Aktar</button>
                      <button class="btn btn-secondary" id="btn-import-data"><i class="fa-solid fa-upload"></i> Verileri İçe Aktar</button>
                      <input type="file" id="import-file-input" accept=".json" style="display: none;">
                  </div>
              `)}
          `
      }
  ];

  const accordionsHTML = sections.map(section => `
      <div class="settings-accordion">
          <button class="settings-accordion-header">
              <div class="accordion-title">
                  <i class="fa-solid ${section.icon}"></i>
                  <span>${section.title}</span>
              </div>
              <i class="fa-solid fa-chevron-right accordion-arrow"></i>
          </button>
          <div class="settings-accordion-content">
              <div class="accordion-content-inner">
                  ${section.content}
              </div>
          </div>
      </div>
  `).join('');

  return `
      <header class="page-header">
          <h1>Ayarlar</h1>
          <p>Uygulama genelindeki tercihlerinizi ve görünümleri yönetin.</p>
      </header>
      <div class="settings-body">
          ${accordionsHTML}
      </div>
      <div class="settings-footer">
          <button class="btn-gradient-reset" disabled>Sıfırla</button>
          <button class="btn-gradient-save">Değişiklikleri Kaydet</button>
      </div>
  `;
};

export default SettingsPage;