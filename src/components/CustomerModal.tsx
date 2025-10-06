import type { Customer } from '../types';

interface CustomerModalProps {
    state: any;
    customersData: Customer[];
}

const CustomerModal = ({ state, customersData }: CustomerModalProps) => {
    const isEditing = state.editingCustomerIndex !== null;
    const customer = isEditing ? customersData[state.editingCustomerIndex] : null;

    return `
    <div class="modal-overlay" id="customer-modal-overlay">
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2>${isEditing ? 'Müşteriyi Düzenle' : 'Yeni Müşteri Ekle'}</h2>
                <button class="close-modal-btn" data-modal-id="customer-modal"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form class="modal-form" id="customer-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="customer-name">Ad Soyad</label>
                        <input type="text" id="customer-name" name="name" value="${customer?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="customer-tc">TC Kimlik No</label>
                        <input type="text" id="customer-tc" name="tc" value="${customer?.tc || ''}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="customer-phone">Telefon</label>
                        <input type="tel" id="customer-phone" name="phone" value="${customer?.phone || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="customer-email">Email</label>
                        <input type="email" id="customer-email" name="email" value="${customer?.email || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="customer-license-number">Ehliyet No</label>
                        <input type="text" id="customer-license-number" name="licenseNumber" value="${customer?.licenseNumber || ''}">
                    </div>
                    <div class="form-group">
                        <label for="customer-license-date">Ehliyet Tarihi</label>
                        <input type="date" id="customer-license-date" name="licenseDate" value="${customer?.licenseDate || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="customer-address">Adres</label>
                    <input type="text" id="customer-address" name="address" value="${customer?.address || ''}">
                </div>
                <div class="file-upload-group">
                    <label>Belge Yükleme</label>
                    <div class="file-input-wrapper">
                         <span><i class="fa-solid fa-id-card"></i> Kimlik</span>
                         <input type="file" id="idFile" name="idFile" accept=".pdf,.jpg,.jpeg,.png">
                    </div>
                     <div class="file-input-wrapper">
                         <span><i class="fa-solid fa-id-card-clip"></i> Ehliyet</span>
                         <input type="file" id="licenseFile" name="licenseFile" accept=".pdf,.jpg,.jpeg,.png">
                    </div>
                </div>
            </form>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-modal-id="customer-modal">İptal</button>
                <button type="submit" form="customer-form" class="btn btn-primary">${isEditing ? 'Değişiklikleri Kaydet' : 'Müşteriyi Kaydet'}</button>
            </div>
        </div>
    </div>
`};

export default CustomerModal;