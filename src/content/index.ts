import React from 'react';
import ReactDOM from 'react-dom/client';
import { ContentApp } from './components/App';
import { getOrCreateShadowRoot } from './shadowHost';

function initializeContentScript() {
  try {
    const { container } = getOrCreateShadowRoot();
    const root = ReactDOM.createRoot(container);
    root.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(ContentApp, null)
      )
    );
  } catch (err) {
    console.error('Clearly: Failed to initialize content script', err);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeContentScript);
} else {
  initializeContentScript();
}
