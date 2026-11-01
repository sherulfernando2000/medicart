import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { resetMockMedicines } from '../services/mockApiService';

describe('MediCart – Online Pharmacy Test Suite', () => {
  beforeEach(() => {
    resetMockMedicines();
    try {
      window.localStorage.clear();
    } catch {
      // ignore
    }
  });

  // Test 1: Renders the MediCart header/title correctly
  it('Test 1: Renders the MediCart header/title correctly', async () => {
    render(<App />);

    // Check for the primary branded heading
    const titleElements = await screen.findAllByText(/MediCart – Online Pharmacy/i);
    expect(titleElements.length).toBeGreaterThan(0);
    expect(titleElements[0]).toBeInTheDocument();
  });

  // Test 2: Renders the list of pharmaceutical items
  it('Test 2: Renders the list of pharmaceutical items', async () => {
    render(<App />);

    // Assert that sample pharmaceutical products are displayed
    expect(await screen.findByText('Paracetamol')).toBeInTheDocument();
    expect(screen.getByText('Amoxicillin')).toBeInTheDocument();
    expect(screen.getByText('Vitamin C')).toBeInTheDocument();
    expect(screen.getByText('Ibuprofen')).toBeInTheDocument();
  });

  // Test 3: Tests that clicking the checkout button updates the UI to show an order confirmation
  it('Test 3: Tests that clicking the checkout button updates the UI to show an order confirmation', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 1. Add Paracetamol to cart
    const addButtons = await screen.findAllByRole('button', { name: /add to cart/i });
    expect(addButtons.length).toBeGreaterThan(0);
    await user.click(addButtons[0]);

    // 2. Open the checkout modal via the checkout button on the active cart bar
    const openCheckoutBtn = await screen.findByTestId('catalog-checkout-btn');
    expect(openCheckoutBtn).toBeInTheDocument();
    await user.click(openCheckoutBtn);

    // 3. Find and click the complete checkout submit button
    const checkoutSubmitBtn = await screen.findByTestId('checkout-button');
    expect(checkoutSubmitBtn).toBeInTheDocument();
    await user.click(checkoutSubmitBtn);

    // 4. Assert that the UI updates to show the order confirmation receipt
    await waitFor(() => {
      expect(screen.getByTestId('order-confirmation-receipt')).toBeInTheDocument();
    });

    const receipt = screen.getByTestId('order-confirmation-receipt');
    expect(receipt).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Order Confirmation/i })).toBeInTheDocument();
    expect(screen.getAllByText(/CONFIRMED/i).length).toBeGreaterThanOrEqual(1);
  });
});
