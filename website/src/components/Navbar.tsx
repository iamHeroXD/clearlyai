import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeContext';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Product', path: '/product' },
    { label: 'How it works', path: '/how-it-works' },
    { label: 'Privacy', path: '/privacy' },
    { label: 'Docs', path: '/docs' },
    { label: 'Download', path: '/download' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--line)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-custom flex items-center justify-between py-4">
        {/* Brand */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-semibold text-[1.0625rem] text-[var(--ink)] hover:opacity-90 transition-opacity"
        >
          <span className="brand-mark" aria-hidden="true"></span>
          <span>Clearly</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[0.9375rem] transition-colors ${
                  isActive
                    ? 'text-[var(--ink)] font-medium'
                    : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-[34px] h-[34px] rounded-full border border-[var(--line-strong)] flex items-center justify-center text-[var(--ink-soft)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
              </svg>
            )}
          </button>

          {/* Primary CTA */}
          <Link
            to="/download"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-[0.875rem] font-medium bg-[var(--ink)] text-[var(--paper)] hover:opacity-85 active:scale-95 transition-all"
          >
            Get Clearly
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 rounded-lg border border-[var(--line)] text-[var(--ink-soft)]"
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12"/>
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-[var(--line)] bg-[var(--paper)] px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="block text-[1rem] font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] py-1.5"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[var(--line)]">
            <Link
              to="/download"
              onClick={() => setMobileOpen(false)}
              className="block text-center w-full py-2.5 rounded-full text-sm font-medium bg-[var(--ink)] text-[var(--paper)]"
            >
              Get Clearly
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
