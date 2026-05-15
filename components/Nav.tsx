'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/about', label: 'Home' },
  { href: '/alerts', label: 'Alert Dashboard' },
  { href: '/screen', label: 'Transaction Screener' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#13204c] text-white shadow-sm">
      <div className="bg-[#b45309] text-white text-center text-[11px] font-mono font-semibold tracking-widest uppercase py-1 px-4">
        Demo Environment — Synthetic Data Only
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-17.5 sm:h-30">

          {/* Logo — 36px mobile / 48px desktop, stacked label below on desktop */}
          <Link href="/alerts" className="flex flex-col items-start justify-center gap-0.5 shrink-0">
            <Image
              src="/econofi-logo.png"
              alt="Econofi"
              width={197}
              height={48}
              className="h-9 sm:h-12 w-auto"
              priority
            />
            <span className="text-[11px] sm:text-xs font-mono font-semibold text-[#00a4b4] tracking-widest hidden sm:block pl-0.5">
              / bsa-aml
            </span>
          </Link>

          {/* Nav links — full-height click area, inner span carries the border-radius arc (econofi.app pattern) */}
          <div className="flex items-center gap-0 h-full">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="h-full flex items-center px-1"
                >
                  <span
                    className={`px-2.5 py-2.5 text-sm sm:text-[18px] leading-7.5 transition-all rounded-[7px] border-b-2 ${
                      active
                        ? 'text-[#00a4b4] border-[#00a4b4] font-bold'
                        : 'text-[#eff2fb]/70 border-transparent font-semibold hover:text-[#42e8e0]'
                    }`}
                    style={{ fontFamily: 'var(--font-open-sans), Open Sans, sans-serif' }}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Bank context + role */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:flex flex-col items-end leading-tight gap-0.5">
              <span
                className="text-sm font-semibold text-white"
                style={{ fontFamily: 'var(--font-open-sans), Open Sans, sans-serif' }}
              >
                YourBank
              </span>
              <span className="text-[10px] font-mono text-white/35 tracking-wide">bank-demo-001</span>
            </div>
            <span
              className="text-xs bg-[#0d7a6b] text-white px-2.5 py-1 rounded-full font-semibold tracking-wide whitespace-nowrap"
              style={{ fontFamily: 'var(--font-open-sans), Open Sans, sans-serif' }}
            >
              Compliance Officer
            </span>
          </div>

        </div>
      </div>
    </nav>
  );
}
