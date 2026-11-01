import { Product } from '../types';

/**
 * Exports products data as a CSV file.
 * Handles escaping commas and quotes correctly.
 * @param {Product[]} products The list of products to export
 */
export function exportToCSV(products: Product[]): void {
  const headers = ['Product ID / SKU', 'Product Name', 'Category', 'Price ($)', 'Stock Quantity'];
  
  const rows = products.map(product => [
    product.sku,
    product.name,
    product.category,
    product.price.toFixed(2),
    product.stock.toString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(value => {
        // Escape strings that contain quotes, commas, or newlines
        const stringValue = String(value);
        if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const date = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `inventory_report_${date}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
