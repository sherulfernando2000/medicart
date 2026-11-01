export interface Medicine {
  id: string;
  sku: string;
  name: string;
  genericName: string;
  category: 'Pain Relief' | 'Antibiotics' | 'Vitamins & Supplements' | 'Allergy & Cold' | 'Chronic Care' | 'Digestive Health';
  dosage: string;
  form: 'Tablets' | 'Capsules' | 'Syrup' | 'Effervescent';
  price: number;
  stock: number;
  prescriptionRequired: boolean;
  description: string;
  manufacturer: string;
  rating: number;
  badge?: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  address: string;
  paymentMethod: 'Credit Card' | 'Cash on Delivery' | 'Digital Wallet';
}

export interface OrderConfirmation {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  timestamp: string;
  status: 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED';
  customer: CustomerDetails;
  deliveryEstimatedDate: string;
}

export interface HealthStatus {
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  uptimeSeconds: number;
  timestamp: string;
  version: string;
  environment: string;
  services: {
    catalogService: 'UP' | 'DOWN';
    checkoutService: 'UP' | 'DOWN';
    inventoryStorage: 'UP' | 'DOWN';
  };
}

const APP_START_TIME = Date.now();

// Initial pharmaceutical catalogue dataset
export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-01',
    sku: 'MED-PARA-500',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'Pain Relief',
    dosage: '500 mg',
    form: 'Tablets',
    price: 4.99,
    stock: 120,
    prescriptionRequired: false,
    description: 'Fast-acting relief for mild to moderate pain including headaches, toothache, and fever reduction.',
    manufacturer: 'HealthCare Pharma',
    rating: 4.8,
    badge: 'Popular',
  },
  {
    id: 'med-02',
    sku: 'MED-AMOX-250',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin Trihydrate',
    category: 'Antibiotics',
    dosage: '250 mg',
    form: 'Capsules',
    price: 14.50,
    stock: 45,
    prescriptionRequired: true,
    description: 'Broad-spectrum penicillin antibiotic used to treat various bacterial infections of the respiratory tract, ear, and skin.',
    manufacturer: 'BioCure Therapeutics',
    rating: 4.6,
    badge: 'Rx Required',
  },
  {
    id: 'med-03',
    sku: 'MED-VITC-1000',
    name: 'Vitamin C',
    genericName: 'Ascorbic Acid',
    category: 'Vitamins & Supplements',
    dosage: '1000 mg',
    form: 'Effervescent',
    price: 8.75,
    stock: 85,
    prescriptionRequired: false,
    description: 'High-strength effervescent vitamin C with zinc to boost the immune system, provide antioxidant protection, and enhance vitality.',
    manufacturer: 'VitaVitality Labs',
    rating: 4.9,
    badge: 'Best Seller',
  },
  {
    id: 'med-04',
    sku: 'MED-IBUP-400',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    category: 'Pain Relief',
    dosage: '400 mg',
    form: 'Tablets',
    price: 6.20,
    stock: 70,
    prescriptionRequired: false,
    description: 'Non-steroidal anti-inflammatory drug (NSAID) for muscle ache, joint pain, menstrual cramps, and inflammation.',
    manufacturer: 'MediRelief Inc.',
    rating: 4.7,
  },
  {
    id: 'med-05',
    sku: 'MED-CETI-010',
    name: 'Cetirizine',
    genericName: 'Cetirizine Hydrochloride',
    category: 'Allergy & Cold',
    dosage: '10 mg',
    form: 'Tablets',
    price: 7.99,
    stock: 95,
    prescriptionRequired: false,
    description: 'Non-drowsy 24-hour antihistamine providing fast relief from hay fever, seasonal allergies, pet dander, and itchy rashes.',
    manufacturer: 'AllerGuard Pharma',
    rating: 4.7,
  },
  {
    id: 'med-06',
    sku: 'MED-METF-500',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    category: 'Chronic Care',
    dosage: '500 mg',
    form: 'Tablets',
    price: 12.30,
    stock: 35,
    prescriptionRequired: true,
    description: 'First-line medication for the treatment of type 2 diabetes mellitus, helping to regulate blood sugar levels.',
    manufacturer: 'GlycoCare Labs',
    rating: 4.5,
    badge: 'Rx Required',
  },
  {
    id: 'med-07',
    sku: 'MED-OMEP-020',
    name: 'Omeprazole',
    genericName: 'Omeprazole Magnesium',
    category: 'Digestive Health',
    dosage: '20 mg',
    form: 'Capsules',
    price: 11.45,
    stock: 50,
    prescriptionRequired: false,
    description: 'Proton pump inhibitor (PPI) providing long-lasting heartburn relief and protection against acid reflux.',
    manufacturer: 'GastroShield Health',
    rating: 4.8,
  },
  {
    id: 'med-08',
    sku: 'MED-MULT-DLY',
    name: 'Daily Multivitamin Complex',
    genericName: 'Multivitamin & Mineral Complex',
    category: 'Vitamins & Supplements',
    dosage: '1 Daily Tablet',
    form: 'Tablets',
    price: 15.99,
    stock: 65,
    prescriptionRequired: false,
    description: 'Complete nutritional formula featuring 24 essential vitamins and minerals for active energy and overall wellness.',
    manufacturer: 'VitaVitality Labs',
    rating: 4.9,
  },
];

// In-memory state storage (persisted across sessions via localStorage if available)
const STORAGE_KEY = 'medicart_medicines_v1';

function getStoredMedicines(): Medicine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // localStorage unavailable or restricted
  }
  return [...INITIAL_MEDICINES];
}

function saveStoredMedicines(medicines: Medicine[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
  } catch {
    // localStorage unavailable
  }
}

// Internal in-memory medicine store
let memoryMedicines: Medicine[] = getStoredMedicines();

/**
 * Core Action 1: Health Status check (internal app status)
 */
export async function getHealthStatus(): Promise<HealthStatus> {
  const uptimeSeconds = Math.floor((Date.now() - APP_START_TIME) / 1000);
  
  return {
    status: 'HEALTHY',
    uptimeSeconds,
    timestamp: new Date().toISOString(),
    version: '1.0.0-cicd',
    environment: 'production-ready',
    services: {
      catalogService: 'UP',
      checkoutService: 'UP',
      inventoryStorage: 'UP',
    },
  };
}

/**
 * Core Action 2: Get Medicine List
 */
export async function getMedicineList(query?: string, category?: string): Promise<Medicine[]> {
  let results = [...memoryMedicines];

  if (category && category !== 'All') {
    results = results.filter((m) => m.category === category);
  }

  if (query && query.trim() !== '') {
    const q = query.toLowerCase().trim();
    results = results.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );
  }

  return results;
}

/**
 * Core Action 3: Get Single Medicine Details
 */
export async function getMedicineDetails(id: string): Promise<Medicine | null> {
  const medicine = memoryMedicines.find((m) => m.id === id || m.sku === id);
  return medicine ? { ...medicine } : null;
}

/**
 * Core Action 4: Checkout Order confirmation (alerts or displays an order placed receipt)
 */
export async function checkoutOrder(
  items: CartItem[],
  customerDetails?: Partial<CustomerDetails>
): Promise<OrderConfirmation> {
  if (!items || items.length === 0) {
    throw new Error('Cannot checkout with an empty cart.');
  }

  const subtotal = items.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  // Deduct inventory stock
  memoryMedicines = memoryMedicines.map((med) => {
    const cartMatch = items.find((ci) => ci.medicine.id === med.id);
    if (cartMatch) {
      return {
        ...med,
        stock: Math.max(0, med.stock - cartMatch.quantity),
      };
    }
    return med;
  });
  saveStoredMedicines(memoryMedicines);

  // Generate deterministic/unique Order ID
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderId = `MC-${randomSuffix}`;

  const estimatedDelivery = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(
    'en-US',
    { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
  );

  const confirmation: OrderConfirmation = {
    orderId,
    items: [...items],
    subtotal: Number(subtotal.toFixed(2)),
    tax,
    total,
    timestamp: new Date().toISOString(),
    status: 'CONFIRMED',
    customer: {
      name: customerDetails?.name || 'Valued Patient',
      email: customerDetails?.email || 'patient@medicart.health',
      address: customerDetails?.address || '104 Healthcare Boulevard, Suite 300',
      paymentMethod: customerDetails?.paymentMethod || 'Credit Card',
    },
    deliveryEstimatedDate: estimatedDelivery,
  };

  return confirmation;
}

/**
 * Helper to reset stock for testing/demo purposes
 */
export function resetMockMedicines(): void {
  memoryMedicines = [...INITIAL_MEDICINES];
  saveStoredMedicines(memoryMedicines);
}
