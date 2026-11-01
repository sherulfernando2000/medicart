import { describe, it, expect, beforeEach } from 'vitest';
import {
  getHealthStatus,
  getMedicineList,
  getMedicineDetails,
  checkoutOrder,
  resetMockMedicines,
} from '../services/mockApiService';

describe('Mock Data Layer Service (4 Core Actions)', () => {
  beforeEach(() => {
    resetMockMedicines();
  });

  // Action 1: Health Status check (internal app status)
  it('Action 1: returns healthy status and service checks', async () => {
    const health = await getHealthStatus();
    expect(health.status).toBe('HEALTHY');
    expect(health.services.catalogService).toBe('UP');
    expect(health.services.checkoutService).toBe('UP');
    expect(health.services.inventoryStorage).toBe('UP');
    expect(typeof health.uptimeSeconds).toBe('number');
  });

  // Action 2: Get Medicine List
  it('Action 2: returns the list of pharmaceutical products', async () => {
    const medicines = await getMedicineList();
    expect(medicines.length).toBeGreaterThanOrEqual(3);

    const names = medicines.map((m) => m.name);
    expect(names).toContain('Paracetamol');
    expect(names).toContain('Amoxicillin');
    expect(names).toContain('Vitamin C');
  });

  // Action 3: Get Single Medicine Details
  it('Action 3: returns details for a single medicine by id or sku', async () => {
    const medicine = await getMedicineDetails('med-01');
    expect(medicine).not.toBeNull();
    expect(medicine?.name).toBe('Paracetamol');
    expect(medicine?.dosage).toBe('500 mg');
    expect(medicine?.price).toBe(4.99);

    const nonExistent = await getMedicineDetails('unknown-id');
    expect(nonExistent).toBeNull();
  });

  // Action 4: Checkout Order confirmation
  it('Action 4: places order, creates confirmation receipt, and deducts inventory', async () => {
    const medicines = await getMedicineList();
    const paracetamol = medicines.find((m) => m.name === 'Paracetamol')!;
    const initialStock = paracetamol.stock;

    const receipt = await checkoutOrder(
      [{ medicine: paracetamol, quantity: 2 }],
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        address: '789 Recovery Road',
        paymentMethod: 'Credit Card',
      }
    );

    expect(receipt.status).toBe('CONFIRMED');
    expect(receipt.orderId).toMatch(/^MC-\d+/);
    expect(receipt.items).toHaveLength(1);
    expect(receipt.items[0].quantity).toBe(2);
    expect(receipt.customer.name).toBe('Jane Doe');

    // Check that inventory was updated
    const updated = await getMedicineDetails(paracetamol.id);
    expect(updated?.stock).toBe(initialStock - 2);
  });
});
