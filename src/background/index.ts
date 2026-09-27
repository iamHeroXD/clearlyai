import { setupContextMenus } from './contextMenus';
import { setupMessageRouter } from './messageRouter';

// Initialize context menus and message listener
setupContextMenus();
setupMessageRouter();

// Handle keyboard shortcuts (e.g. Ctrl+Shift+E, Ctrl+Shift+S)
if (typeof chrome !== 'undefined' && chrome.commands) {
  chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab?.id) return;

      if (command === 'explain-selection') {
        chrome.tabs.sendMessage(activeTab.id, {
          type: 'TRIGGER_EXPLAIN_SHORTCUT',
        }).catch(() => {
          // If content script is unavailable (e.g. PDF tab), open Side Panel
          if ((chrome as any).sidePanel?.open) {
            (chrome as any).sidePanel.open({ tabId: activeTab.id, windowId: activeTab.windowId }).catch(() => {});
          }
        });
      } else if (command === 'open-side-panel') {
        if ((chrome as any).sidePanel?.open) {
          (chrome as any).sidePanel.open({ tabId: activeTab.id, windowId: activeTab.windowId }).catch(() => {});
        }
      }
    });
  });
}
