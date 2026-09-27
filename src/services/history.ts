import { HistoryItem, ExplanationRequest, StructuredExplanation } from '../types';

const HISTORY_STORAGE_KEY = 'clearly_history_v1';
const MAX_HISTORY_ITEMS = 200;

export async function getHistory(): Promise<HistoryItem[]> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      try {
        const local = localStorage.getItem(HISTORY_STORAGE_KEY);
        const parsed = local ? JSON.parse(local) : [];
        resolve(Array.isArray(parsed) ? parsed : []);
      } catch {
        resolve([]);
      }
      return;
    }

    chrome.storage.local.get([HISTORY_STORAGE_KEY], (res) => {
      if (chrome.runtime.lastError) {
        resolve([]);
        return;
      }
      const raw = res[HISTORY_STORAGE_KEY];
      resolve(Array.isArray(raw) ? raw : []);
    });
  });
}

export async function addHistoryItem(
  request: ExplanationRequest,
  response: StructuredExplanation
): Promise<void> {
  const history = await getHistory();
  
  const newItem: HistoryItem = {
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    originalText: request.text,
    mode: request.mode,
    response,
    pageTitle: request.pageTitle,
    pageUrl: request.pageUrl,
  };

  const updated = [newItem, ...history.filter(item => item.originalText !== request.text)].slice(0, MAX_HISTORY_ITEMS);

  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      resolve();
      return;
    }

    chrome.storage.local.set({ [HISTORY_STORAGE_KEY]: updated }, () => {
      resolve();
    });
  });
}

export async function toggleStarHistoryItem(id: string): Promise<boolean> {
  const history = await getHistory();
  let isStarred = false;
  const updated = history.map((item) => {
    if (item.id === id) {
      isStarred = !item.isStarred;
      return { ...item, isStarred };
    }
    return item;
  });

  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      resolve(isStarred);
      return;
    }

    chrome.storage.local.set({ [HISTORY_STORAGE_KEY]: updated }, () => {
      resolve(isStarred);
    });
  });
}

export async function exportHistoryToMarkdown(starredOnly = false): Promise<string> {
  const history = await getHistory();
  const items = starredOnly ? history.filter((h) => h.isStarred) : history;

  let md = `# ✦ Clearly Vocabulary & Knowledge Exports\n\n`;
  md += `*Exported on ${new Date().toLocaleDateString()} — ${items.length} items*\n\n---\n\n`;

  for (const item of items) {
    const star = item.isStarred ? ' ⭐' : '';
    const date = new Date(item.timestamp).toLocaleDateString();
    md += `### ${item.originalText}${star}\n`;
    md += `- **Date**: ${date} | **Mode**: \`${item.mode}\`${item.pageTitle ? ` | **Source**: [${item.pageTitle}](${item.pageUrl || '#'})` : ''}\n`;
    
    if (item.response.defineBreakdown) {
      md += `- **Definition**: ${item.response.defineBreakdown.definition}\n`;
      if (item.response.defineBreakdown.example) {
        md += `- **Example**: *"${item.response.defineBreakdown.example}"*\n`;
      }
    } else if (item.response.rewrittenText) {
      md += `- **Polished**: ${item.response.rewrittenText}\n`;
    } else if (item.response.tldrPoints) {
      md += `- **TL;DR**:\n`;
      item.response.tldrPoints.forEach((pt) => (md += `  - ${pt}\n`));
    } else {
      md += `- **Summary**: ${item.response.summary}\n`;
      if (item.response.example) md += `- **Example**: *${item.response.example}*\n`;
      if (item.response.whyItMatters) md += `- **Why it matters**: ${item.response.whyItMatters}\n`;
    }
    md += `\n`;
  }

  return md;
}

export async function exportHistoryToJSON(starredOnly = false): Promise<string> {
  const history = await getHistory();
  const items = starredOnly ? history.filter((h) => h.isStarred) : history;
  return JSON.stringify(items, null, 2);
}

export async function deleteHistoryItem(id: string): Promise<void> {
  const history = await getHistory();
  const updated = history.filter((item) => item.id !== id);

  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      resolve();
      return;
    }

    chrome.storage.local.set({ [HISTORY_STORAGE_KEY]: updated }, () => {
      resolve();
    });
  });
}

export async function clearHistory(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      resolve();
      return;
    }

    chrome.storage.local.remove([HISTORY_STORAGE_KEY], () => {
      resolve();
    });
  });
}
