import type { Rental } from '../types';

export let rentalsData: Rental[] = [
    { id: 1, vehiclePlate: '06 XYZ 789', customerId: 3, startDate: '2024-05-10', endDate: null, startKm: 85200, endKm: null, price: 1200, priceType: 'daily', totalCost: null, contractFile: null, contractFileUrl: null, invoiceFile: null, invoiceFileUrl: null, status: 'active' },
    { id: 2, vehiclePlate: '41 JKL 123', customerId: 2, startDate: '2024-05-15', endDate: null, startKm: 62300, endKm: null, price: 25000, priceType: 'monthly', totalCost: null, contractFile: 'sozlesme.pdf', contractFileUrl: null, invoiceFile: null, invoiceFileUrl: null, status: 'active' },
];