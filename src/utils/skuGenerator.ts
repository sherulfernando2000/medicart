/**
 * Generates a unique Product SKU / ID
 * Format: PRD-XXXXXX (where X is a random uppercase letter or number)
 * @returns {string} The generated SKU
 */
export function generateSKU(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `PRD-${result}`;
}
