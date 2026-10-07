// app/not-found.tsx
import Link from 'next/link';
import { ArrowRight, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-tekki-cream flex items-center justify-center px-4 sm:px-6">
      <div className="relative w-full max-w-[560px] text-center py-20">
        <div className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-tekki-orange/[0.05] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[300px] h-[300px] rounded-full bg-tekki-ink/[0.03] blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-10 group rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-tekki-orange/50 focus-visible:ring-offset-2">
            <img
              src="/images/tekkistudio/logo_black.svg"
              alt="TEKKI Studio"
              className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          <p className="font-home-mono text-[15px] font-semibold text-tekki-orange-deep mb-4 tabular-nums">
            404
          </p>

          <h1 className="font-home-display text-[30px] sm:text-[36px] font-semibold text-tekki-ink tracking-tight mb-4 leading-[1.2]">
            Cette page n&apos;existe pas.
          </h1>

          <p className="font-home-body text-[16px] text-tekki-ink-soft mb-10 leading-relaxed max-w-[440px] mx-auto">
            Le lien est peut-être obsolète, ou l&apos;adresse comporte une erreur. Voici où retrouver ce que vous cherchez.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-7 py-[14px] bg-tekki-orange hover:bg-tekki-orange-hover active:scale-[0.98] text-white rounded-full font-home-body font-semibold text-[15px] transition-all duration-300 group shadow-lg shadow-tekki-orange/20 hover:shadow-xl hover:shadow-tekki-orange/30 outline-none focus-visible:ring-2 focus-visible:ring-tekki-orange/50 focus-visible:ring-offset-2"
            >
              <Home size={18} />
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/diagnostic"
              className="inline-flex items-center justify-center gap-1.5 font-home-body text-[15px] text-tekki-ink font-semibold hover:text-tekki-orange transition-colors rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-tekki-orange/50 focus-visible:ring-offset-2"
            >
              Faire le diagnostic gratuit
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-8 border-t border-tekki-ink/10 text-[14px]">
            <Link href="/cas-clients" className="text-tekki-ink-soft hover:text-tekki-orange transition-colors rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-tekki-orange/50 focus-visible:ring-offset-2">
              Cas clients
            </Link>
            <Link href="/nos-marques" className="text-tekki-ink-soft hover:text-tekki-orange transition-colors rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-tekki-orange/50 focus-visible:ring-offset-2">
              Nos marques
            </Link>
            <Link href="/a-propos" className="text-tekki-ink-soft hover:text-tekki-orange transition-colors rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-tekki-orange/50 focus-visible:ring-offset-2">
              À propos
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
