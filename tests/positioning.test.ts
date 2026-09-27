import { describe, it, expect, beforeEach } from 'vitest';
import { calculatePillPosition, calculateCardPosition } from '../src/services/positioning';

describe('positioning calculations', () => {
  beforeEach(() => {
    if (typeof globalThis.window === 'undefined') {
      (globalThis as any).window = {};
    }
    Object.defineProperty(globalThis.window, 'innerWidth', { writable: true, configurable: true, value: 1200 });
    Object.defineProperty(globalThis.window, 'innerHeight', { writable: true, configurable: true, value: 800 });
  });

  it('should position pill above selection when sufficient space is available', () => {
    const rect = { top: 300, left: 400, bottom: 320, right: 600, width: 200, height: 20 };
    const pos = calculatePillPosition(rect, 84, 26, 4);
    expect(pos.placement).toBe('top');
    expect(pos.y).toBeLessThan(rect.top);
  });

  it('should flip pill below selection when selection is near the top edge', () => {
    const rect = { top: 10, left: 400, bottom: 30, right: 600, width: 200, height: 20 };
    const pos = calculatePillPosition(rect, 84, 26, 4);
    expect(pos.placement).toBe('bottom');
    expect(pos.y).toBeGreaterThan(rect.bottom);
  });

  it('should clamp pill within horizontal viewport margins', () => {
    const rectNearRight = { top: 300, left: 1180, bottom: 320, right: 1250, width: 70, height: 20 };
    const pos = calculatePillPosition(rectNearRight, 84, 26, 4);
    expect(pos.x + 84).toBeLessThanOrEqual(1200);
  });

  it('should calculate card position within bounds', () => {
    const rect = { top: 200, left: 300, bottom: 230, right: 500, width: 200, height: 30 };
    const pos = calculateCardPosition(rect, 320, 220, 6);
    expect(pos.x).toBeGreaterThanOrEqual(10);
    expect(pos.x + 320).toBeLessThanOrEqual(1200);
  });
});
