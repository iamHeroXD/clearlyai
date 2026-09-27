import { ExtensionMessage, ExtensionResponse, AIProviderType } from '../types';
import { processExplanationRequest } from '../services/aiService';
import { getStoredSettings, saveStoredSettings } from '../services/storage';
import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
  toggleStarHistoryItem,
  exportHistoryToMarkdown,
  exportHistoryToJSON,
} from '../services/history';
import { cacheService } from '../services/cache';
import { getAIProvider } from '../providers';

export function setupMessageRouter(): void {
  chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
    handleMessage(message)
      .then((res) => sendResponse(res))
      .catch((err) => {
        sendResponse({
          success: false,
          error: err?.message || 'Unknown internal extension error',
        });
      });

    // Return true to indicate asynchronous response
    return true;
  });
}

async function handleMessage(message: ExtensionMessage): Promise<ExtensionResponse> {
  switch (message.type) {
    case 'EXPLAIN_TEXT': {
      try {
        const result = await processExplanationRequest(message.payload);
        return { success: true, data: result };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to explain text' };
      }
    }

    case 'GET_SETTINGS': {
      const settings = await getStoredSettings();
      return { success: true, data: settings };
    }

    case 'SAVE_SETTINGS': {
      const updated = await saveStoredSettings(message.payload);
      return { success: true, data: updated };
    }

    case 'GET_HISTORY': {
      const history = await getHistory();
      return { success: true, data: history };
    }

    case 'TOGGLE_STAR_HISTORY_ITEM': {
      const isStarred = await toggleStarHistoryItem(message.payload.id);
      return { success: true, data: { isStarred } };
    }

    case 'EXPORT_HISTORY': {
      if (message.payload?.format === 'json') {
        const json = await exportHistoryToJSON(message.payload?.starredOnly);
        return { success: true, data: json };
      }
      const md = await exportHistoryToMarkdown(message.payload?.starredOnly);
      return { success: true, data: md };
    }

    case 'DELETE_HISTORY_ITEM': {
      await deleteHistoryItem(message.payload.id);
      return { success: true };
    }

    case 'CLEAR_HISTORY': {
      await clearHistory();
      return { success: true };
    }

    case 'CLEAR_CACHE': {
      cacheService.clear();
      return { success: true };
    }

    case 'TEST_PROVIDER': {
      try {
        const settings = await getStoredSettings();
        const providerName = message.payload.provider as AIProviderType;
        const config = settings.providers[providerName] || {};
        const provider = getAIProvider(providerName);

        const testRes = await provider.explain(
          {
            text: 'Photosynthesis is how plants produce food from sunlight.',
            mode: 'explain',
          },
          config,
          'English'
        );
        return { success: true, data: testRes };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Connection test failed.' };
      }
    }

    default:
      return { success: false, error: 'Unrecognized message type' };
  }
}
