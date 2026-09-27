/**
 * Checks whether an element is an active editable field (textarea, input, contenteditable).
 */
export function isEditableElement(element: Element | null): boolean {
  if (!element) return false;

  const tagName = element.tagName.toLowerCase();
  if (tagName === 'textarea') return true;
  if (tagName === 'input') {
    const inputType = (element as HTMLInputElement).type?.toLowerCase() || 'text';
    const nonTextTypes = ['checkbox', 'radio', 'button', 'submit', 'reset', 'file', 'image', 'color', 'range'];
    return !nonTextTypes.includes(inputType);
  }

  if (element.getAttribute('contenteditable') === 'true' || (element as HTMLElement).isContentEditable) {
    return true;
  }

  // Check parent nodes up the tree
  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    if (parent.getAttribute('contenteditable') === 'true' || parent.isContentEditable) {
      return true;
    }
    parent = parent.parentElement;
  }

  return false;
}

/**
 * Replaces the currently selected text inside an editable element or DOM range.
 * Preserves undo history (Ctrl+Z) where possible using insertText.
 */
export function replaceSelectedText(newText: string): boolean {
  const activeEl = document.activeElement;

  // Handle standard <textarea> and <input> elements
  if (activeEl && (activeEl.tagName.toLowerCase() === 'textarea' || activeEl.tagName.toLowerCase() === 'input')) {
    const input = activeEl as HTMLInputElement | HTMLTextAreaElement;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    if (start !== undefined && end !== undefined && start !== end) {
      input.focus();
      // Try execCommand first to preserve native undo stack
      const success = document.execCommand('insertText', false, newText);
      if (!success) {
        // Fallback to direct value replacement
        const val = input.value;
        input.value = val.substring(0, start) + newText + val.substring(end);
        input.selectionStart = start + newText.length;
        input.selectionEnd = start + newText.length;

        // Dispatch input event for frameworks like React/Vue
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return true;
    }
  }

  // Handle contenteditable / rich text editors (Gmail, Notion, Slack, Google Docs)
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
    const range = sel.getRangeAt(0);
    // Use execCommand for rich text to maintain formatting & undo stack
    const success = document.execCommand('insertText', false, newText);
    if (!success) {
      range.deleteContents();
      const textNode = document.createTextNode(newText);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    return true;
  }

  return false;
}
