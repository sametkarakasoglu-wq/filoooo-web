import type { Customer } from '../types';

export let customersData: Customer[] = [
    {
        id: 1,
        name: 'Ahmet Yılmaz',
        tc: '12345678901',
        phone: '0555 123 45 67',
        email: 'ahmet.yilmaz@example.com',
        address: 'Örnek Mah. Test Sk. No: 1 Daire: 2, İstanbul',
        licenseNumber: 'A1234567',
        licenseDate: '25.10.2015',
        idFile: 'kimlik.jpg', idFileUrl: null,
        licenseFile: 'ehliyet.jpg', licenseFileUrl: null,
        rentals: [
            { plate: '34 ABC 123', date: '15.01.2024 - 20.01.2024', status: 'Tamamlandı' },
            { plate: '06 XYZ 789', date: '01.12.2023 - 05.12.2023', status: 'Tamamlandı' },
        ]
    },
    {
        id: 2,
        name: 'Ayşe Kaya',
        tc: '98765432109',
        phone: '0533 987 65 43',
        email: 'ayse.kaya@example.com',
        address: 'Deneme Mah. Prova Sk. No: 3 Daire: 4, Ankara',
        licenseNumber: 'B7654321',
        licenseDate: '10.05.2018',
        idFile: null, idFileUrl: null,
        licenseFile: 'ehliyet.jpg', licenseFileUrl: null,
        rentals: [
             { plate: '41 JKL 123', date: '10.02.2024 - 15.02.2024', status: 'Aktif' },
        ]
    },
     {
        id: 3,
        name: 'Mehmet Öztürk',
        tc: '56789012345',
        phone: '0544 567 89 01',
        email: 'mehmet.ozturk@example.com',
        address: 'Yazılım Mah. Kod Sk. No: 5 Daire: 6, İzmir',
        licenseNumber: 'C5678901',
        licenseDate: '01.02.2012',
        idFile: null, idFileUrl: null,
        licenseFile: null, licenseFileUrl: null,
        rentals: []
    },
];