import '../../styles/globals.css';
import Script from 'next/script';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Providers } from '../../context/Providers';
import { getThemeSettings, buildThemeCss } from '../../lib/payload-client';

export const metadata = {
    title: 'Jeevana Rekha',
    description: 'A trusted digital news platform committed to ethical journalism and public interest.',
};

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
    const theme = await getThemeSettings();
    const themeCss = buildThemeCss(theme);

    return (
        <html lang="te">
            <head>
                {/* CMS-controlled theme: colors + font scale */}
                <style dangerouslySetInnerHTML={{ __html: themeCss }} />
                {/* Google Analytics GA4 */}
                <Script
                    strategy="afterInteractive"
                    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
                </Script>
                {/* Google Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Montserrat:wght@500;700&family=Noto+Sans+Telugu:wght@400;700&family=Noto+Serif+Telugu:wght@400;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
                <link rel="icon" href="/assets/favicon.png" type="image/png" />
            </head>
            <body className="antialiased">
                <Script
                    id="theme-initializer"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
            (function() {
              try {
                const theme = localStorage.getItem('theme');
                const supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && supportDark)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.removeAttribute('data-theme');
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();
          `,
                    }}
                />
                <Providers initialLang="te">
                    <Header lang="te" />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
