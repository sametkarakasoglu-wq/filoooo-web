export type Activity = {
    icon: string;
    message: string;
    time: Date;
};

export type Vehicle = {
    plate: string;
    brand: string;
    km: string;
    status: string;
    insuranceDate: string | null;
    inspectionDate: string | null;
    insuranceFile: string | null;
    inspectionFile: string | null;
    licenseFile: string | null;
    insuranceFileUrl: string | null;
    inspectionFileUrl: string | null;
    licenseFileUrl: string | null;
    rentedBy?: { name: string; phone: string; };
    activeRentalId?: number;
};

export type Customer = {
    id: number;
    name: string;
    tc: string;
    phone: string;
    email: string;
    address: string;
    licenseNumber: string;
    licenseDate: string;
    idFile: string | null;
    idFileUrl: string | null;
    licenseFile: string | null;
    licenseFileUrl: string | null;
    rentals: { plate: string; date: string; status: string; }[];
};

export type Rental = {
    id: number;
    vehiclePlate: string;
    customerId: number;
    startDate: string;
    endDate: string | null;
    startKm: number;
    endKm: number | null;
    price: number;
    priceType: 'daily' | 'monthly';
    totalCost: number | null;
    contractFile: string | null;
    contractFileUrl: string | null;
    invoiceFile: string | null;
    invoiceFileUrl: string | null;
    status: 'active' | 'completed';
};

export type Reservation = {
    id: number;
    vehiclePlate: string;
    customerId: number;
    startDate: string;
    endDate: string;
    deliveryLocation: string;
    notes: string | null;
    status: 'active' | 'completed' | 'cancelled';
};

export type Maintenance = {
    id: number;
    vehiclePlate: string;
    maintenanceDate: string;
    maintenanceKm: number;
    type: string;
    cost: number;
    description: string;
    nextMaintenanceKm: number;
    nextMaintenanceDate: string;
};