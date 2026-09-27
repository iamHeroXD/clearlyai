/**
 * Intelligently cleans and normalizes user selection before sending to AI.
 * Strips weird formatting artifacts while strictly preserving code indentation,
 * mathematical formulas, punctuation, and essential capitalization.
 */
export function cleanSelectedText(text: string, maxLength = 4000): string {
  if (!text) return '';

  // Replace zero-width spaces, byte order marks, and non-standard whitespace characters
  let cleaned = text
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero width spaces
    .replace(/[\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000]/g, ' ') // unicode spaces to regular space
    .replace(/\r\n/g, '\n') // normalize Windows line endings
    .replace(/\r/g, '\n'); // normalize classic Mac line endings

  // Remove excessive consecutive empty lines (more than 2 -> 2)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Strip leading and trailing whitespace
  cleaned = cleaned.trim();

  // If text is not code, normalize multiple horizontal spaces to single space per line
  const isLikelyCode = cleaned.includes('{') || cleaned.includes(';') || cleaned.includes('def ') || cleaned.includes('function ') || cleaned.includes('const ') || cleaned.includes('var ');
  if (!isLikelyCode) {
    cleaned = cleaned
      .split('\n')
      .map(line => line.replace(/[ \t]+/g, ' ').trim())
      .join('\n');
  }

  // Cap at maxLength without cutting mid-word if possible
  if (cleaned.length > maxLength) {
    const truncated = cleaned.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      cleaned = truncated.slice(0, lastSpace) + '...';
    } else {
      cleaned = truncated + '...';
    }
  }

  return cleaned;
}
