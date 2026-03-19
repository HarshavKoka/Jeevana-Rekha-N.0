'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SOCIAL_LINKS, NAV_ITEMS } from '../lib/constants';

export default function Footer() {
    const { language } = useLanguage();

    const policyLinks = [
        { label: { te: 'మా గురించి', en: 'About Us' }, href: '/about' },
        { label: { te: 'సంప్రదించండి', en: 'Contact' }, href: '/contact' },
        { label: { te: 'ఎడిటోరియల్ పాలసీ', en: 'Editorial Policy' }, href: '/editorial-policy' },
        { label: { te: 'ప్రైవసీ పాలసీ', en: 'Privacy Policy' }, href: '/privacy' },
        { label: { te: 'నిబంధనలు & షరతులు', en: 'Terms & Conditions' }, href: '/terms' },
    ];

    return (
        <footer className="bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 py-12 border-t border-zinc-100 dark:border-zinc-900 mt-20 relative overflow-hidden">
            {/* SUBTLE DECORATION */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />

            <div className="max-w-[1440px] mx-auto px-4 lg:px-10 relative z-10">
                {/* ROW 1: BRAND & MISSION */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 mb-12">
                    <div className="space-y-6">
                        <Link href={`/${language}`} className="text-3xl font-black font-te text-zinc-900 dark:text-white inline-block hover:opacity-90 transition-opacity tracking-tighter">
                            JEEVANA <span className="text-primary font-black">REKHA</span>
                        </Link>
                        <p className="max-w-md text-lg leading-relaxed font-te text-zinc-500 dark:text-zinc-400">
                            {language === 'te'
                                ? 'నిజాన్ని నిర్భయంగా, నిష్పక్షపాతంగా అందించే తెలుగు వార్తా పోర్టల్.'
                                : 'A trusted digital news platform committed to ethical journalism and truth.'}
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
                                    className="w-11 h-11 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-sm group"
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} className="group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/10 dark:border-primary/20 max-w-md ml-auto">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-3">
                            {language === 'te' ? 'న్యూస్ లెటర్' : 'Newsletter'}
                        </h4>
                        <p className="text-xs font-te mb-5 text-zinc-600 dark:text-zinc-300">
                            {language === 'te' ? 'తాజా వార్తలు మరియు అప్‌డేట్‌లను పొందండి.' : 'Get the latest news and updates delivered to your inbox.'}
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder={language === 'te' ? 'మీ ఇమెయిల్' : 'Your Email'}
                                className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-te"
                            />
                            <button className="bg-primary text-white rounded-xl px-4 py-2 text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm">
                                {language === 'te' ? 'సబ్స్క్రైబ్' : 'Subscribe'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ROW 2: LINKS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-12 border-t border-zinc-200 dark:border-zinc-900">
                    <div className="space-y-6">
                        <h4 className="text-[13px] font-black uppercase tracking-[0.25em] text-zinc-900 dark:text-white">
                            {language === 'te' ? 'విభాగాలు' : 'Categories'}
                        </h4>
                        <ul className="space-y-4 text-sm font-bold font-te">
                            {NAV_ITEMS.filter(i => !i.isFlash).slice(0, 4).map((item) => (
                                <li key={item.href}>
                                    <Link href={`/${language}${item.href}`} className="text-zinc-500 dark:text-zinc-400 hover:text-primary transition-colors text-base">
                                        {item.label[language]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-[13px] font-black uppercase tracking-[0.25em] text-zinc-900 dark:text-white">&nbsp;</h4>
                        <ul className="space-y-4 text-sm font-bold font-te">
                            {NAV_ITEMS.filter(i => !i.isFlash).slice(4).map((item) => (
                                <li key={item.href}>
                                    <Link href={`/${language}${item.href}`} className="text-zinc-500 dark:text-zinc-400 hover:text-primary transition-colors text-base">
                                        {item.label[language]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-[13px] font-black uppercase tracking-[0.25em] text-zinc-900 dark:text-white">
                            {language === 'te' ? 'మా కథ' : 'Our Story'}
                        </h4>
                        <ul className="space-y-4 text-sm font-bold font-te">
                            {policyLinks.slice(0, 3).map((item) => (
                                <li key={item.href}>
                                    <Link href={`/${language}${item.href}`} className="text-zinc-500 dark:text-zinc-400 hover:text-primary transition-colors text-base">
                                        {item.label[language]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-900 dark:text-white">
                            {language === 'te' ? 'పాలసీలు' : 'Policies'}
                        </h4>
                        <ul className="space-y-4 text-sm font-bold font-te">
                            {policyLinks.slice(3).map((item) => (
                                <li key={item.href}>
                                    <Link href={`/${language}${item.href}`} className="text-zinc-500 dark:text-zinc-400 hover:text-primary transition-colors">
                                        {item.label[language]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ROW 3: CONTACT & COPYRIGHT */}
                <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="space-y-2 text-center md:text-left">
                        <p className="text-xs font-black uppercase tracking-widest text-primary">contact@jeevanarekha.in</p>
                        <p className="text-sm font-te text-zinc-500 dark:text-zinc-400">Eluru, Andhra Pradesh, India - 534001</p>
                    </div>
                    <div className="text-center md:text-right space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 dark:text-zinc-500">
                            © 2026 JEEVANA REKHA. {language === 'te' ? 'అన్ని హక్కులు ప్రత్యేకించబడినవి.' : 'All Rights Reserved.'}
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
                            {language === 'te' ? 'రూపకల్పన' : 'Designed by'} <span className="text-zinc-900 dark:text-white">VIJAYI SOFTWARE</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
