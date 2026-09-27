import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <main id="main" className="min-h-[70vh] flex items-center justify-center">
      <div className="container-custom text-center py-20">
        <span className="font-mono text-xs text-[var(--gray-500)] uppercase tracking-wider mb-3 block">
          404 // Page not found
        </span>
        <h1 className="text-[var(--text-h2)] font-semibold text-[var(--ink)]">
          Looks like there's nothing here.
        </h1>
        <p className="text-[1rem] text-[var(--ink-soft)] mt-3 max-w-sm mx-auto">
          The page you requested does not exist or has been moved.
        </p>
        <div className="mt-7">
          <Link
            to="/"
            className="inline-flex items-center px-5 py-2.5 rounded-full text-[0.875rem] font-medium bg-[var(--ink)] text-[var(--paper)] hover:opacity-85 active:scale-95 transition-all"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
};
