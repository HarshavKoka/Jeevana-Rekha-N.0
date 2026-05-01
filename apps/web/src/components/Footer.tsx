'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { SOCIAL_LINKS, NAV_ITEMS } from '../lib/constants';

export default function Footer() {

    const policyLinks = [
        { label: 'మా గురించి', href: '/about' },
        { label: 'సంప్రదించండి', href: '/contact' },
        { label: 'ఎడిటోరియల్ పాలసీ', href: '/editorial-policy' },
        { label: 'ప్రైవసీ పాలసీ', href: '/privacy' },
        { label: 'నిబంధనలు & షరతులు', href: '/terms' },
    ];

    return (
        <footer className="bg-[#1A1A1A] text-white/70 py-12 border-t border-white/10 mt-20 relative overflow-hidden">
            {/* SUBTLE DECORATION */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />

            <div className="max-w-[1440px] mx-auto px-4 lg:px-10 relative z-10">
                {/* ROW 1: BRAND & MISSION */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 mb-12">
                    <div className="space-y-6">
                        <Link href="/" className="relative h-12 w-48 block hover:opacity-90 transition-opacity">
                            <Image
                                src="/assets/logo.png"
                                alt="Jeevana Rekha Logo"
                                fill
                                className="object-contain invert object-left"
                            />
                        </Link>
                        <p className="max-w-md hero-summary text-white/60">
                            నిజాన్ని నిర్భయంగా, నిష్పక్షపాతంగా అందించే తెలుగు వార్తా పోర్టల్.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: Facebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
                                { icon: Twitter, href: SOCIAL_LINKS.twitter, label: 'Twitter' },
                                { icon: Instagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
                                { icon: Youtube, href: SOCIAL_LINKS.youtube, label: 'Youtube' }
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-sm group"
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} className="group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 max-w-md ml-auto">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-3">
                            న్యూస్ లెటర్
                        </h4>
                        <p className="text-xs font-te mb-5 text-white/70">
                            తాజా వార్తలు మరియు అప్‌డేట్‌లను పొందండి.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="మీ ఇమెయిల్"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-te text-white"
                            />
                            <button className="bg-primary text-white rounded-xl px-4 py-2 text-xs font-bold hover:bg-primary-deep transition-colors shadow-sm">
                                సబ్స్క్రైబ్
                            </button>
                        </div>
                    </div>
                </div>

                {/* ROW 2: LINKS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-12 border-t border-white/10">
                    <div className="space-y-6">
                        <h4 className="text-[13px] font-black uppercase tracking-[0.25em] text-white">
                            విభాగాలు
                        </h4>
                        <ul className="space-y-4 footer-link">
                            {NAV_ITEMS.filter(i => !i.isFlash).slice(0, 4).map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-white/50 hover:text-primary transition-colors text-base">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-[13px] font-black uppercase tracking-[0.25em] text-white">&nbsp;</h4>
                        <ul className="space-y-4 footer-link">
                            {NAV_ITEMS.filter(i => !i.isFlash).slice(4).map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-white/50 hover:text-primary transition-colors text-base">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-[13px] font-black uppercase tracking-[0.25em] text-white">
                            మా కథ
                        </h4>
                        <ul className="space-y-4 footer-link">
                            {policyLinks.slice(0, 3).map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-white/50 hover:text-primary transition-colors text-base">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.25em] text-white">
                            పాలసీలు
                        </h4>
                        <ul className="space-y-4 footer-link">
                            {policyLinks.slice(3).map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-white/50 hover:text-primary transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ROW 3: CONTACT & COPYRIGHT */}
                <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="space-y-2 text-center md:text-left">
                        <p className="text-xs font-black uppercase tracking-widest text-primary font-body">contact@jeevanarekha.in</p>
                        <p className="footer-link text-white/40">Eluru, Andhra Pradesh, India - 534001</p>
                    </div>
                    <div className="text-center md:text-right space-y-2">
                        <p className="footer-legal uppercase tracking-[0.4em] text-white/30">
                            © 2026 జీవన రేఖ. అన్ని హక్కులు ప్రత్యేకించబడినవి.
                        </p>
                        <p className="footer-legal uppercase tracking-[0.3em] text-white/30">
                            రూపకల్పన <span className="text-white">VIJAYI SOFTWARE</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
