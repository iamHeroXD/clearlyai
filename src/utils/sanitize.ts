/**
 * Safe HTML escaping and sanitization utilities.
 * Protects against XSS injection when rendering dynamic content in the Shadow DOM.
 */

export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function sanitizeText(str: string): string {
  if (!str) return '';
  // Strip control characters while preserving newlines and tabs
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}
