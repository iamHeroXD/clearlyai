import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--line)] py-12 text-[var(--ink)]">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 font-semibold text-[1.0625rem]">
              <span className="brand-mark" aria-hidden="true"></span>
              <span>Clearly</span>
            </Link>
            <p className="text-[0.9375rem] text-[var(--gray-600)] mt-2 max-w-xs">
              Clarity, without leaving the page.
            </p>
          </div>

          <nav className="flex flex-wrap gap-6 text-[0.9375rem]" aria-label="Footer">
            <Link to="/product" className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">Product</Link>
            <Link to="/how-it-works" className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">How it works</Link>
            <Link to="/privacy" className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">Privacy</Link>
            <Link to="/docs" className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">Docs</Link>
            <Link to="/download" className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">Download</Link>
            <a
              href="https://github.com/iamHeroXD/clearlyai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row justify-between items-center gap-3 text-[0.8125rem] text-[var(--gray-500)]">
          <span>© {new Date().getFullYear()} Clearly</span>
          <span>Built for people who read a lot.</span>
        </div>
      </div>
    </footer>
  );
};
