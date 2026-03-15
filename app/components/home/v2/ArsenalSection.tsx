import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Bot, CreditCard, ShoppingCart } from 'lucide-react';

export default function ArsenalSection() {
    return (
        <section className="py-24 bg-[#05080c]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-16">
                    Ce que nous déployons pour vous.
                </h2>

                <div className="flex flex-col gap-6 mb-20 text-left">
                    <div className="bg-[#0a0f16] border border-gray-800 p-6 rounded-2xl flex items-start gap-4 hover:border-orange-500/50 transition-colors">
                        <ShoppingCart className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-semibold text-lg mb-2">Boutiques Shopify/WooCommerce ultra-performantes</h3>
                            <p className="text-gray-400 font-light">Des plateformes robustes, optimisées pour la conversion mobile et conçues pour encaisser de forts volumes de trafic sans ralentissement.</p>
                        </div>
                    </div>

                    <div className="bg-[#0a0f16] border border-gray-800 p-6 rounded-2xl flex items-start gap-4 hover:border-orange-500/50 transition-colors">
                        <CreditCard className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-semibold text-lg mb-2">Intégration fluide des paiements locaux</h3>
                            <p className="text-gray-400 font-light">Mobile Money (Wave, Orange Money) et Cartes Bancaires sécurisées. Réduisez la friction au checkout à zéro.</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-600/10 to-[#0a0f16] border border-orange-500/30 p-6 rounded-2xl flex items-start gap-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-bl-lg">EXCLUSIVITÉ TEKKI</div>
                        <Bot className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-semibold text-lg mb-2">La Vendeuse IA "Chatseller"</h3>
                            <p className="text-gray-400 font-light">Un agent autonome formé sur votre catalogue qui conseille vos clients 24h/24 et anéantit les abandons de panier.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-gray-800/80">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Prêt à casser votre plafond de verre ?
                    </h2>
                    <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto font-light">
                        Nous travaillons exclusivement avec des fondateurs ambitieux prêts à structurer leur croissance. Voyons si nous sommes faits pour nous entendre.
                    </p>

                    <Link
                        href="/diagnostic"
                        className="inline-flex px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-medium transition-all duration-300 items-center justify-center gap-2 shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:shadow-[0_0_40px_rgba(234,88,12,0.5)] transform hover:-translate-y-1"
                    >
                        Démarrer l'audit IA gratuit
                    </Link>
                </div>
            </div>
        </section>
    );
}
