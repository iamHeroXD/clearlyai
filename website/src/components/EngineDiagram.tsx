import React from 'react';

export const EngineDiagram: React.FC = () => {
  return (
    <div className="max-w-[680px] mx-auto text-[var(--ink)]">
      {/* Root Node */}
      <div className="table mx-auto px-5 py-2.5 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] font-semibold text-[0.9375rem] shadow-[var(--shadow-sm)]">
        Clearly
      </div>

      {/* Connector line */}
      <div className="w-[1px] h-8 bg-[var(--line-strong)] mx-auto" />

      {/* Sub Node */}
      <div className="table mx-auto px-4 py-2 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] text-[var(--ink-soft)] font-medium text-[0.875rem]">
        Inference router
      </div>

      {/* Branch Connectors & Cards */}
      <div className="relative mt-8 pt-8">
        {/* Horizontal bar */}
        <div className="hidden sm:block absolute top-0 left-[16.66%] right-[16.66%] h-[1px] bg-[var(--line-strong)]" />
        <div className="hidden sm:block absolute -top-8 left-1/2 -translate-x-1/2 w-[1px] h-8 bg-[var(--line-strong)]" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* On-device */}
          <div className="relative p-5 rounded-[var(--radius-md)] bg-[var(--paper-raised)] border border-[var(--line)] text-center">
            <div className="hidden sm:block absolute -top-8 left-1/2 -translate-x-1/2 w-[1px] h-8 bg-[var(--line-strong)]" />
            <div className="text-[0.75rem] font-mono uppercase tracking-wider text-[var(--gray-500)] mb-1">01 // Local</div>
            <strong className="block text-[0.9375rem] font-semibold mb-1 text-[var(--ink)]">On-device</strong>
            <span className="block text-[0.8125rem] text-[var(--gray-600)] leading-[1.45]">
              Chrome built-in AI model, where supported.
            </span>
          </div>

          {/* Cloud */}
          <div className="relative p-5 rounded-[var(--radius-md)] bg-[var(--paper-raised)] border border-[var(--line)] text-center">
            <div className="hidden sm:block absolute -top-8 left-1/2 -translate-x-1/2 w-[1px] h-8 bg-[var(--line-strong)]" />
            <div className="text-[0.75rem] font-mono uppercase tracking-wider text-[var(--gray-500)] mb-1">02 // Cloud (BYOK)</div>
            <strong className="block text-[0.9375rem] font-semibold mb-1 text-[var(--ink)]">Cloud</strong>
            <span className="block text-[0.8125rem] text-[var(--gray-600)] leading-[1.45]">
              Gemini, OpenAI, or Anthropic with your own key.
            </span>
          </div>

          {/* Self-hosted */}
          <div className="relative p-5 rounded-[var(--radius-md)] bg-[var(--paper-raised)] border border-[var(--line)] text-center">
            <div className="hidden sm:block absolute -top-8 left-1/2 -translate-x-1/2 w-[1px] h-8 bg-[var(--line-strong)]" />
            <div className="text-[0.75rem] font-mono uppercase tracking-wider text-[var(--gray-500)] mb-1">03 // Self-hosted</div>
            <strong className="block text-[0.9375rem] font-semibold mb-1 text-[var(--ink)]">Self-hosted</strong>
            <span className="block text-[0.8125rem] text-[var(--gray-600)] leading-[1.45]">
              Ollama, running directly on your machine.
            </span>
          </div>
        </div>
      </div>

      <p className="text-center text-[0.875rem] text-[var(--gray-600)] mt-7">
        You choose what runs where. Clearly stays the same either way.
      </p>
    </div>
  );
};
