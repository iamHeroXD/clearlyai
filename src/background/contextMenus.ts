export function setupContextMenus(): void {
  if (typeof chrome === 'undefined' || !chrome.contextMenus) return;

  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: 'clearly_explain_selection',
        title: 'Explain with Clearly',
        contexts: ['selection'],
      });

      chrome.contextMenus.create({
        id: 'clearly_simplify_selection',
        title: 'Simplify with Clearly',
        contexts: ['selection'],
      });

      chrome.contextMenus.create({
        id: 'clearly_open_sidepanel',
        title: 'Open Clearly Side Panel Copilot',
        contexts: ['all'],
      });

      chrome.contextMenus.create({
        id: 'clearly_open_pdf_reader',
        title: 'Open in Clearly PDF Reader Studio',
        contexts: ['all'],
      });
    });
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab?.id) return;

    if (info.menuItemId === 'clearly_open_pdf_reader') {
      chrome.tabs.create({ url: chrome.runtime.getURL('reader.html') });
      return;
    }

    if (info.menuItemId === 'clearly_open_sidepanel') {
      if ((chrome as any).sidePanel?.open) {
        (chrome as any).sidePanel.open({ tabId: tab.id, windowId: tab.windowId }).catch(() => {});
      }
      return;
    }

    if (!info.selectionText) return;

    const mode = info.menuItemId === 'clearly_simplify_selection' ? 'simplify' : 'explain';

    // First attempt: Send to Content Script (works on normal DOM pages)
    chrome.tabs.sendMessage(tab.id, {
      type: 'TRIGGER_EXPLAIN_ACTION',
      payload: {
        text: info.selectionText,
        mode,
      },
    }).catch(() => {
      // Content script is not present (e.g. on Chrome's built-in PDF viewer tab or restricted page)
      // Fallback: Open Chrome Side Panel and route the explanation there!
      if ((chrome as any).sidePanel?.open) {
        (chrome as any).sidePanel.open({ tabId: tab.id, windowId: tab.windowId })
          .then(() => {
            setTimeout(() => {
              chrome.runtime.sendMessage({
                type: 'EXPLAIN_IN_SIDEPANEL',
                payload: {
                  text: info.selectionText,
                  mode,
                },
              }).catch(() => {});
            }, 300);
          })
          .catch(() => {});
      }
    });
  });
}
