import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  return (
    <main id="main">
      {/* Header */}
      <section className="section-padding hero pb-12">
        <div className="container-custom">
          <div className="max-w-[38rem] mx-auto text-center">
            <span className="inline-block text-[0.8125rem] px-3 py-1 rounded-full bg-[var(--paper-raised)] border border-[var(--line)] text-[var(--gray-600)] font-mono mb-4">
              Privacy &amp; Security
            </span>
            <h1 className="text-[var(--text-display)] font-semibold text-[var(--ink)] leading-[1.06] tracking-tight">
              Your words stay yours.
            </h1>
            <p className="text-[1.125rem] text-[var(--ink-soft)] mt-4 leading-[1.6]">
              A complete and honest breakdown of how Clearly handles your text, settings, and data.
            </p>
          </div>
        </div>
      </section>

      {/* Main Privacy Document Content */}
      <section className="section-padding divider section-flush-top">
        <div className="container-custom">
          <div className="max-w-[48rem] mx-auto space-y-12">

            {/* Philosophy */}
            <div>
              <h2 className="text-[1.375rem] font-semibold text-[var(--ink)] mb-3">
                1. Our Privacy Philosophy
              </h2>
              <p className="text-[0.9375rem] text-[var(--ink-soft)] leading-[1.7]">
                Clearly was designed on a simple principle: reading is personal. An assistant that helps you read should not monitor what you browse, build a shadow profile of your reading habits, or monetize your search queries. Clearly does not require an account, does not use tracking pixels, and does not maintain a central user database.
              </p>
            </div>

            {/* Local Storage */}
            <div>
              <h2 className="text-[1.375rem] font-semibold text-[var(--ink)] mb-3">
                2. What Stays on Your Device
              </h2>
              <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--paper-raised)] border border-[var(--line)] space-y-3 text-[0.9375rem] text-[var(--ink-soft)] leading-[1.6]">
                <div>
                  <strong className="text-[var(--ink)] block mb-0.5">Settings &amp; Preferences:</strong>
                  Your default explanation lens, theme preference, and shortcut configurations are saved exclusively in your browser's <code className="font-mono text-xs bg-[var(--paper)] px-1.5 py-0.5 rounded border border-[var(--line)]">chrome.storage.local</code>.
                </div>
                <div>
                  <strong className="text-[var(--ink)] block mb-0.5">Starred Knowledge Notebook:</strong>
                  Words, definitions, and IPA transcriptions that you star remain entirely inside your local browser database until you export or delete them.
                </div>
                <div>
                  <strong className="text-[var(--ink)] block mb-0.5">API Keys:</strong>
                  Any personal API keys you supply (Google Gemini, OpenAI, Anthropic) are stored locally in your browser and used only to authenticate direct client-to-provider requests.
                </div>
              </div>
            </div>

            {/* Cloud AI Transmission */}
            <div>
              <h2 className="text-[1.375rem] font-semibold text-[var(--ink)] mb-3">
                3. What Happens When Cloud AI Is Used
              </h2>
              <p className="text-[0.9375rem] text-[var(--ink-soft)] leading-[1.7] mb-4">
                When you highlight text and trigger an explanation using a cloud provider (such as Gemini 2.0, GPT-4o mini, or Claude 3.5 Sonnet):
              </p>
              <ul className="list-disc pl-5 space-y-2.5 text-[0.9375rem] text-[var(--ink-soft)] leading-[1.6]">
                <li><strong>Selected Text:</strong> The highlighted text snippet and the chosen lens prompt are sent directly from your browser to your selected AI provider endpoint.</li>
                <li><strong>Surrounding Context (Optional):</strong> If "Include Surrounding Context" is enabled in Extension Settings (default: enabled), Clearly attaches the immediate sentence before and after your selection so the model can resolve pronouns ("it", "they") without scraping the full page. You can disable this anytime in Settings.</li>
                <li><strong>Local-Only History & Metadata:</strong> When history is enabled, page titles and URLs are recorded strictly inside your local browser storage (<code className="font-mono text-xs bg-[var(--paper)] px-1.5 py-0.5 rounded border border-[var(--line)]">chrome.storage.local</code>) for your personal reference. This data never leaves your device and is never sent to any Clearly server.</li>
                <li><strong>On-Device Local Inference:</strong> When using on-device models (Chrome Gemini Nano or local Ollama), <strong>zero network requests</strong> leave your computer.</li>
              </ul>
            </div>

            {/* Tracking & Telemetry */}
            <div>
              <h2 className="text-[1.375rem] font-semibold text-[var(--ink)] mb-3">
                4. Tracking &amp; Analytics
              </h2>
              <p className="text-[0.9375rem] text-[var(--ink-soft)] leading-[1.7]">
                Clearly includes <strong>zero telemetry scripts</strong>, zero third-party advertising SDKs, and zero behavioral tracking cookies. We do not track what websites you visit or what queries you run.
              </p>
            </div>

            {/* Third-Party Providers */}
            <div>
              <h2 className="text-[1.375rem] font-semibold text-[var(--ink)] mb-3">
                5. Third-Party AI Provider Policies
              </h2>
              <p className="text-[0.9375rem] text-[var(--ink-soft)] leading-[1.7] mb-4">
                If you use your personal API keys for cloud providers, requests are governed by their respective API data privacy policies:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[0.875rem]">
                <div className="p-4 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)]">
                  <strong className="block text-[var(--ink)] mb-1">Google AI Studio</strong>
                  <span className="text-[var(--gray-600)] text-xs">Standard developer terms; API inputs are not used for public model training under paid tiers.</span>
                </div>
                <div className="p-4 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)]">
                  <strong className="block text-[var(--ink)] mb-1">OpenAI API</strong>
                  <span className="text-[var(--gray-600)] text-xs">API data is not used to train OpenAI models by default.</span>
                </div>
                <div className="p-4 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)]">
                  <strong className="block text-[var(--ink)] mb-1">Anthropic API</strong>
                  <span className="text-[var(--gray-600)] text-xs">Commercial API inputs are not retained or used for training.</span>
                </div>
              </div>
            </div>

            {/* User Control & Deletion */}
            <div>
              <h2 className="text-[1.375rem] font-semibold text-[var(--ink)] mb-3">
                6. User Control &amp; Data Deletion
              </h2>
              <p className="text-[0.9375rem] text-[var(--ink-soft)] leading-[1.7]">
                You can delete your starred vocabulary, reset all preferences, or wipe saved API keys at any moment with one click in the Clearly Options page. Uninstalling the Chrome extension immediately removes all stored data from your browser.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="section-padding divider raised text-center">
        <div className="container-custom">
          <h2 className="text-[var(--text-h2)] font-semibold text-[var(--ink)]">
            Clear, transparent, and private.
          </h2>
          <div className="mt-6">
            <Link
              to="/download"
              className="inline-flex items-center px-6 py-3 rounded-full text-[0.9375rem] font-medium bg-[var(--ink)] text-[var(--paper)] hover:opacity-85 active:scale-95 transition-all"
            >
              Get Clearly
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
