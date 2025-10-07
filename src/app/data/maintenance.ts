import type { Maintenance } from '../types';

export let maintenanceData: Maintenance[] = [
    { id: 1, vehiclePlate: '35 DEF 456', maintenanceDate: '2024-05-01', maintenanceKm: 45000, type: 'Periyodik Bakım', cost: 2500, description: 'Yağ ve filtreler değişti. Genel kontrol yapıldı.', nextMaintenanceKm: 60000, nextMaintenanceDate: '2025-05-01' },
];