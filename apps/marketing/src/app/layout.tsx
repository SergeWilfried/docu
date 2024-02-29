import { Suspense } from 'react';

import { Caveat, Inter } from 'next/font/google';

import { PublicEnvScript } from 'next-runtime-env';

import { FeatureFlagProvider } from '@documenso/lib/client-only/providers/feature-flag';
import { LocaleProvider } from '@documenso/lib/client-only/providers/locale';
import { NEXT_PUBLIC_MARKETING_URL } from '@documenso/lib/constants/app';
import type { Locales } from '@documenso/lib/i18n/settings';
import { getLocale } from '@documenso/lib/server-only/headers/get-locale';
import { getAllAnonymousFlags } from '@documenso/lib/universal/get-feature-flag';
import { TrpcProvider } from '@documenso/trpc/react';
import { cn } from '@documenso/ui/lib/utils';
import { Toaster } from '@documenso/ui/primitives/toaster';

import { ThemeProvider } from '~/providers/next-theme';
import { PlausibleProvider } from '~/providers/plausible';
import { PostHogPageview } from '~/providers/posthog';

import './globals.css';

const fontInter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const fontCaveat = Caveat({ subsets: ['latin'], variable: '--font-signature' });

export const metadata = {
  title: {
    template: '%s - MonTampon',
    default: 'MonTampon',
  },
  description:
    'Join MonTampon, and get a 10x better signing experience. Pricing starts at $30/mo. forever! Sign in now and enjoy a faster, smarter, and more beautiful document signing process. Integrates with your favorite tools, customizable, and expandable.',
  keywords:
    'Electronic signature, Digital signature, E signature, Esign, Sign documents online, Online signature, Electronic signature free, Free document signing, Sign pdf online, Esignature free, Sign pdf online free, Sign documents online free, E sign, Esign documents, Digital signature free, Digital signature online, Document sign, Esign pdf, E signature online, Fill and sign pdf, Online contract signing, MonTampon, DocuSign alternative, open signing infrastructure, open-source community, fast signing, beautiful signing, smart templates',
  authors: { name: 'MonTampon, Inc.' },
  robots: 'index, follow',
  openGraph: {
    title: 'MonTampon - The DocuSign Alternative',
    description:
      'Join MonTampon, and get a 10x better signing experience. Pricing starts at $30/mo. forever! Sign in now and enjoy a faster, smarter, and more beautiful document signing process. Integrates with your favorite tools, customizable, and expandable.',
    type: 'website',
    images: [`${NEXT_PUBLIC_MARKETING_URL}/opengraph-image.jpg`],
  },
  twitter: {
    site: '@monTampon',
    card: 'summary_large_image',
    images: [`${NEXT_PUBLIC_MARKETING_URL}/opengraph-image.jpg`],
    description:
      'Join MonTampon, and get a 10x better signing experience. Pricing starts at $30/mo. forever! Sign in now and enjoy a faster, smarter, and more beautiful document signing process. Integrates with your favorite tools, customizable, and expandable.',
  },
  verification: {
    google: 'your-google-verification-id-here'
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const flags = await getAllAnonymousFlags();
  const locale = getLocale() as Locales;

  return (
    <html
      lang={locale}
      className={cn(fontInter.variable, fontCaveat.variable)}
      suppressHydrationWarning
    >
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <PublicEnvScript />
      </head>

      <Suspense>
        <PostHogPageview />
      </Suspense>

      <body>
        <LocaleProvider value={locale}>
          <FeatureFlagProvider initialFlags={flags}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <PlausibleProvider>
                <TrpcProvider>{children}</TrpcProvider>
              </PlausibleProvider>
            </ThemeProvider>
          </FeatureFlagProvider>
        </LocaleProvider>

        <Toaster />
      </body>
    </html>
  );
}
