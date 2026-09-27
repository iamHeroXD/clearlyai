import { cleanSelectedText } from '../utils/cleanText';
import { Rect } from './positioning';

export interface SelectionData {
  text: string;
  rawText: string;
  rect: Rect;
  contextBefore?: string;
  contextAfter?: string;
}

const CONTEXT_WINDOW_CHARS = 160;

/**
 * Extracts the user selection, its bounding rectangle, and a small snippet of surrounding context.
 */
export function getActiveSelection(includeContext = true): SelectionData | null {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return null;
  }

  const rawText = selection.toString();
  const cleanedText = cleanSelectedText(rawText);

  if (!cleanedText || cleanedText.length === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const clientRects = range.getClientRects();
  
  // Use first rect or overall bounding rect
  let rect: Rect;
  if (clientRects.length > 0) {
    const first = clientRects[0];
    const last = clientRects[clientRects.length - 1];
    rect = {
      top: first.top,
      left: Math.min(...Array.from(clientRects).map(r => r.left)),
      bottom: last.bottom,
      right: Math.max(...Array.from(clientRects).map(r => r.right)),
      width: Math.max(...Array.from(clientRects).map(r => r.right)) - Math.min(...Array.from(clientRects).map(r => r.left)),
      height: last.bottom - first.top,
    };
  } else {
    const bRect = range.getBoundingClientRect();
    rect = {
      top: bRect.top,
      left: bRect.left,
      bottom: bRect.bottom,
      right: bRect.right,
      width: bRect.width,
      height: bRect.height,
    };
  }

  // Fallback for PDF viewers / virtualized text layers where rects may be 0x0
  if (rect.width === 0 && rect.height === 0) {
    const vpW = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const vpH = typeof window !== 'undefined' ? window.innerHeight : 800;
    rect = {
      top: vpH / 2 - 50,
      left: vpW / 2 - 100,
      bottom: vpH / 2 + 50,
      right: vpW / 2 + 100,
      width: 200,
      height: 100,
    };
  }

  let contextBefore: string | undefined = undefined;
  let contextAfter: string | undefined = undefined;

  if (includeContext && range.startContainer) {
    try {
      // Find nearest block ancestor (e.g., p, div, li, article, section)
      const containerNode = range.commonAncestorContainer;
      const blockElement = containerNode.nodeType === Node.ELEMENT_NODE
        ? (containerNode as Element).closest('p, div, li, article, section, h1, h2, h3, h4, blockquote')
        : containerNode.parentElement?.closest('p, div, li, article, section, h1, h2, h3, h4, blockquote');

      if (blockElement && blockElement.textContent) {
        const fullBlockText = blockElement.textContent;
        const selectionIndex = fullBlockText.indexOf(rawText);

        if (selectionIndex !== -1) {
          const beforeStart = Math.max(0, selectionIndex - CONTEXT_WINDOW_CHARS);
          contextBefore = fullBlockText.slice(beforeStart, selectionIndex).trim();

          const afterStart = selectionIndex + rawText.length;
          const afterEnd = Math.min(fullBlockText.length, afterStart + CONTEXT_WINDOW_CHARS);
          contextAfter = fullBlockText.slice(afterStart, afterEnd).trim();
        }
      }
    } catch (e) {
      // Ignore context extraction errors gracefully
    }
  }

  return {
    text: cleanedText,
    rawText,
    rect,
    contextBefore,
    contextAfter,
  };
}
