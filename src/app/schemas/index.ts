import { z } from 'zod';

// =================================================================
// Araç Şeması (Vehicle Schema)
// =================================================================
// Formdan gelen veriyi doğrulamak için kullanılır.
export const vehicleFormSchema = z.object({
  plate: z.string({ required_error: "Plaka zorunludur." })
    .min(3, "Plaka en az 3 karakter olmalıdır.")
    .regex(/^[0-9]{2}\s?[A-Z-a-z]{1,3}\s?[0-9]{2,4}$/, "Geçersiz plaka formatı. Örn: 34 ABC 1234"),
  brand: z.string().min(2, "Marka en az 2 karakter olmalıdır."),
  model: z.string().min(2, "Model en az 2 karakter olmalıdır."),
  km: z.string().refine(val => !isNaN(parseInt(val.replace(/[,.]/g, ''))), {
    message: "Kilometre sayısal bir değer olmalıdır.",
  }),
  status: z.enum(['Müsait', 'Kirada', 'Bakımda']),
  insuranceDate: z.string().optional().nullable(),
  inspectionDate: z.string().optional().nullable(),
});

// =================================================================
// Müşteri Şeması (Customer Schema)
// =================================================================
export const customerFormSchema = z.object({
    name: z.string().min(2, "İsim en az 2 karakter olmalıdır."),
    tc: z.string().length(11, "TC Kimlik Numarası 11 haneli olmalıdır.").regex(/^[0-9]{11}$/, "Geçersiz TC Kimlik Numarası."),
    phone: z.string().min(10, "Telefon numarası en az 10 haneli olmalıdır."),
    email: z.string().email("Geçersiz e-posta adresi.").optional().or(z.literal('')),
    licenseNumber: z.string().optional(),
    licenseDate: z.string().optional(),
    address: z.string().optional(),
});


// =================================================================
// Kiralama Şeması (Rental Schema)
// =================================================================
// Kiralama formu, yeni müşteri oluşturma seçeneği içerdiği için koşullu doğrulamaya ihtiyaç duyar.
const rentalBaseSchema = z.object({
    vehiclePlate: z.string().min(1, "Araç seçimi zorunludur."),
    startDate: z.string().min(1, "Başlangıç tarihi zorunludur."),
    startKm: z.string().refine(val => !isNaN(parseInt(val.replace(/[,.]/g, ''))), {
        message: "Başlangıç kilometresi sayısal bir değer olmalıdır.",
    }),
    price: z.string().refine(val => !isNaN(parseFloat(val)), {
        message: "Fiyat sayısal bir değer olmalıdır.",
    }),
    priceType: z.enum(['daily', 'monthly']),
    customerType: z.enum(['existing', 'new']),
    // Koşullu alanlar (opsiyonel olarak tanımlanır, superRefine ile doğrulanır)
    customerId: z.string().optional(),
    newCustomerName: z.string().optional(),
    newCustomerTc: z.string().optional(),
    newCustomerPhone: z.string().optional(),
    newCustomerEmail: z.string().email().optional().or(z.literal('')),
});

export const rentalFormSchema = rentalBaseSchema.superRefine((data, ctx) => {
    if (data.customerType === 'existing') {
        if (!data.customerId || data.customerId === "0") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['customerId'],
                message: 'Lütfen mevcut bir müşteri seçin.',
            });
        }
    } else { // 'new'
        if (!data.newCustomerName || data.newCustomerName.length < 2) {
            ctx.addIssue({ code: 'custom', path: ['newCustomerName'], message: 'Yeni müşteri adı en az 2 karakter olmalıdır.' });
        }
        if (!data.newCustomerTc || !/^[0-9]{11}$/.test(data.newCustomerTc)) {
            ctx.addIssue({ code: 'custom', path: ['newCustomerTc'], message: 'Geçersiz TC Kimlik Numarası (11 hane olmalıdır).' });
        }
        if (!data.newCustomerPhone || data.newCustomerPhone.length < 10) {
            ctx.addIssue({ code: 'custom', path: ['newCustomerPhone'], message: 'Geçerli bir telefon numarası girin.' });
        }
    }
});


// =================================================================
// Rezervasyon Şeması (Reservation Schema)
// =================================================================
const reservationBaseSchema = z.object({
    vehiclePlate: z.string().min(1, "Araç seçimi zorunludur."),
    startDate: z.string().min(1, "Başlangıç tarihi zorunludur."),
    endDate: z.string().min(1, "Bitiş tarihi zorunludur."),
    deliveryLocation: z.string().min(2, "Teslimat konumu en az 2 karakter olmalıdır."),
    notes: z.string().optional(),
    customerType: z.enum(['existing', 'new']),
    // Koşullu alanlar
    customerId: z.string().optional(),
    newCustomerName: z.string().optional(),
    newCustomerPhone: z.string().optional(),
});

export const reservationFormSchema = reservationBaseSchema.superRefine((data, ctx) => {
    if (new Date(data.startDate) > new Date(data.endDate)) {
        ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'Bitiş tarihi, başlangıç tarihinden önce olamaz.' });
    }

    if (data.customerType === 'existing') {
        if (!data.customerId || data.customerId === "0") {
            ctx.addIssue({ code: 'custom', path: ['customerId'], message: 'Lütfen mevcut bir müşteri seçin.' });
        }
    } else { // 'new'
        if (!data.newCustomerName || data.newCustomerName.length < 2) {
            ctx.addIssue({ code: 'custom', path: ['newCustomerName'], message: 'Yeni müşteri adı en az 2 karakter olmalıdır.' });
        }
        if (!data.newCustomerPhone || data.newCustomerPhone.length < 10) {
            ctx.addIssue({ code: 'custom', path: ['newCustomerPhone'], message: 'Geçerli bir telefon numarası girin.' });
        }
    }
});

// =================================================================
// Bakım Şeması (Maintenance Schema)
// =================================================================
export const maintenanceFormSchema = z.object({
    vehiclePlate: z.string().min(1, "Araç seçimi zorunludur."),
    maintenanceDate: z.string().min(1, "Bakım tarihi zorunludur."),
    maintenanceKm: z.string().refine(val => !isNaN(parseInt(val.replace(/[,.]/g, ''))), {
        message: "Bakım kilometresi sayısal bir değer olmalıdır.",
    }),
    type: z.string().min(2, "Bakım türü en az 2 karakter olmalıdır."),
    cost: z.string().refine(val => !isNaN(parseFloat(val)), {
        message: "Maliyet sayısal bir değer olmalıdır.",
    }),
    description: z.string().optional(),
    nextMaintenanceKm: z.string().refine(val => !isNaN(parseInt(val.replace(/[,.]/g, ''))), {
        message: "Sonraki bakım kilometresi sayısal bir değer olmalıdır.",
    }),
    nextMaintenanceDate: z.string().min(1, "Sonraki bakım tarihi zorunludur."),
});

// =================================================================
// Araç Teslim Alma (Check-in) Şeması
// =================================================================
export const checkInFormSchema = z.object({
    rentalId: z.string(),
    returnDate: z.string().min(1, "Dönüş tarihi zorunludur."),
    returnKm: z.string().refine(val => !isNaN(parseInt(val.replace(/[,.]/g, ''))), {
        message: "Dönüş kilometresi sayısal bir değer olmalıdır.",
    }),
});