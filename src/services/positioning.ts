export interface Rect {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

export interface PositionCoordinates {
  x: number;
  y: number;
  placement: 'top' | 'bottom';
}

/**
 * Calculates pixel-perfect viewport coordinates for the floating action pill.
 * Positions the pill immediately above or below the selected text (4px gap).
 */
export function calculatePillPosition(
  rect: Rect,
  pillWidth = 92,
  pillHeight = 28,
  margin = 4
): PositionCoordinates {
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

  const actualPillWidth = Math.min(pillWidth, viewportWidth - 16);

  // Center horizontally over the selection bounding rect
  let x = rect.left + (rect.width / 2) - (actualPillWidth / 2);

  // Clamp within viewport margins
  const minX = 8;
  const maxX = viewportWidth - actualPillWidth - 8;
  x = Math.max(minX, Math.min(x, maxX));

  let y: number;
  let placement: 'top' | 'bottom';

  // If there's enough space above the selection (28px + 4px + 6px), place above
  if (rect.top >= pillHeight + margin + 6) {
    y = rect.top - pillHeight - margin;
    placement = 'top';
  } else {
    // Otherwise place immediately below
    y = rect.bottom + margin;
    placement = 'bottom';
  }

  // Safety clamp Y within viewport
  y = Math.max(6, Math.min(y, viewportHeight - pillHeight - 6));

  return { x, y, placement };
}

/**
 * Calculates pixel-perfect viewport coordinates for the explanation card.
 * Automatically adapts to any screen size and guarantees the card stays on-screen.
 */
export function calculateCardPosition(
  rect: Rect,
  cardWidth = 324,
  estimatedCardHeight = 240,
  margin = 6
): PositionCoordinates {
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

  const actualCardWidth = Math.min(cardWidth, viewportWidth - 20);

  // Center horizontally over the selection
  let x = rect.left + (rect.width / 2) - (actualCardWidth / 2);

  // Strictly clamp within viewport
  const minX = 10;
  const maxX = Math.max(10, viewportWidth - actualCardWidth - 10);
  x = Math.max(minX, Math.min(x, maxX));

  const spaceBelow = viewportHeight - rect.bottom - margin - 10;
  const spaceAbove = rect.top - margin - 10;
  let y: number;
  let placement: 'top' | 'bottom';

  // Prefer placing below if space allows, or if more space below than above
  if (spaceBelow >= estimatedCardHeight || spaceBelow >= spaceAbove) {
    y = rect.bottom + margin;
    placement = 'bottom';
  } else {
    y = rect.top - estimatedCardHeight - margin;
    placement = 'top';
  }

  // Strictly clamp Y so the card NEVER goes off the top or bottom of the screen
  const maxY = Math.max(10, viewportHeight - estimatedCardHeight - 10);
  y = Math.max(10, Math.min(y, maxY));

  return { x, y, placement };
}

