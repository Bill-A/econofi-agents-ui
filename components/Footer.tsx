import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#13204c] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

          {/* Logo + tagline */}
          <div className="flex flex-col gap-2">
            <Link href="https://econofi.app" target="_blank" rel="noopener noreferrer">
              <Image
                src="/econofi-logo.png"
                alt="Econofi"
                width={120}
                height={30}
                className="h-7 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p
              className="text-xs text-white/50 max-w-xs leading-relaxed"
              style={{ fontFamily: 'var(--font-open-sans), Open Sans, sans-serif' }}
            >
              BSA/AML compliance automation for MDI and CDFI community banks.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <Link
              href="https://econofi.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/70 hover:text-[#00a4b4] transition-colors font-medium"
              style={{ fontFamily: 'var(--font-open-sans), Open Sans, sans-serif' }}
            >
              Econofi Home
            </Link>
            <Link
              href="/"
              className="text-sm text-white/70 hover:text-[#00a4b4] transition-colors font-medium"
              style={{ fontFamily: 'var(--font-open-sans), Open Sans, sans-serif' }}
            >
              Home
            </Link>
            <Link
              href="/alerts"
              className="text-sm text-white/70 hover:text-[#00a4b4] transition-colors font-medium"
              style={{ fontFamily: 'var(--font-open-sans), Open Sans, sans-serif' }}
            >
              Alert Dashboard
            </Link>
            <Link
              href="/screen"
              className="text-sm text-white/70 hover:text-[#00a4b4] transition-colors font-medium"
              style={{ fontFamily: 'var(--font-open-sans), Open Sans, sans-serif' }}
            >
              Transaction Screener
            </Link>
          </nav>

        </div>

        {/* Divider + copyright */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p
            className="text-xs text-white/40"
            style={{ fontFamily: 'var(--font-open-sans), Open Sans, sans-serif' }}
          >
            © 2024–2026 Econofi™, a division of agile Innovation Labs LLC. All rights reserved.
          </p>
          <p className="text-xs font-mono text-white/25">
            BSA/AML TransactionMonitor v1.0 — demo environment
          </p>
        </div>
      </div>
    </footer>
  );
}
