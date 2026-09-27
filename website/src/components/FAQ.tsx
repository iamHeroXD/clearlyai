import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { sound } from '../utils/sound';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: 'How does Clearly achieve 0ms offline latency?',
    answer: 'Clearly connects directly to Chrome\'s experimental on-device `window.ai` API powered by Gemini Nano. When enabled on supported Chrome builds, text is processed locally on your machine\'s neural hardware without making external network requests.'
  },
  {
    question: 'Do I need an API key to use Clearly?',
    answer: 'No! You can use the built-in Mock mode or Chrome Gemini Nano for 100% free local usage. If you want maximum reasoning quality for research papers and complex code, you can easily plug in your personal Google Gemini (free tier), OpenAI, Anthropic Claude, or local Ollama endpoint in the Options page.'
  },
  {
    question: 'Does Clearly store or log my highlighted text?',
    answer: 'Never. Clearly is 100% privacy-first and open source. It has zero analytics, zero cookies, and zero server logging. All settings and API keys are stored locally and encrypted in your browser\'s `chrome.storage.local`.'
  },
  {
    question: 'How does the 1-Click Replace feature work?',
    answer: 'When you highlight text inside an editable field (such as an email in Gmail, a message in Slack, a draft in Notion, or a tweet on X), choosing a writing mode (Grammar or Professional) reveals the "Replace text" button. Clicking it replaces your original draft in-place without copying and pasting.'
  },
  {
    question: 'Which browsers are supported?',
    answer: 'Clearly is built on the modern Manifest V3 standard and is fully compatible with Google Chrome, Brave, Arc, Microsoft Edge, Opera, and any Chromium-based browser.'
  },
  {
    question: 'Can I export my saved vocabulary to Obsidian or Notion?',
    answer: 'Yes! Whenever you star an explanation, Clearly saves it to your local notebook. From the extension popup or options page, you can export your entire glossary to Markdown (`.md`), CSV for Anki flashcards, or copy to clipboard.'
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    sound.playClick();
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-xl">
            Everything you need to know about Clearly, security, models, and performance.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#060812] border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-bold text-white text-base sm:text-lg">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-indigo-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-white/5 pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
