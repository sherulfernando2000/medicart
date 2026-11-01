import { Product } from '../types';

export const INITIAL_CATEGORIES: string[] = [
  'Electronics',
  'Furniture',
  'Apparel',
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'PRD-IP15PR',
    name: 'iPhone 15 Pro',
    sku: 'PRD-IP15PR',
    category: 'Electronics',
    price: 999.99,
    stock: 12,
  },
  {
    id: 'PRD-ERGOCH',
    name: 'Ergonomic Office Chair',
    sku: 'PRD-ERGOCH',
    category: 'Furniture',
    price: 189.50,
    stock: 8,
  },
  {
    id: 'PRD-TCNTSH',
    name: 'Cotton Crewneck T-Shirt',
    sku: 'PRD-TCNTSH',
    category: 'Apparel',
    price: 24.99,
    stock: 50,
  },
  {
    id: 'PRD-4KMONI',
    name: '4K Ultra HD Monitor',
    sku: 'PRD-4KMONI',
    category: 'Electronics',
    price: 349.99,
    stock: 5,
  },
  {
    id: 'PRD-STDESK',
    name: 'Standing Desk',
    sku: 'PRD-STDESK',
    category: 'Furniture',
    price: 450.00,
    stock: 0,
  },
  {
    id: 'PRD-RUNSHO',
    name: 'Running Shoes',
    sku: 'PRD-RUNSHO',
    category: 'Apparel',
    price: 85.00,
    stock: 3,
  },
];
