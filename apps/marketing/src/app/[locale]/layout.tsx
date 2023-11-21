import { Suspense } from 'react';

import { Caveat, Inter } from 'next/font/google';

import { FeatureFlagProvider } from '@documenso/lib/client-only/providers/feature-flag';
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
  title: 'Notario - Simplify Your Signatures, Secure Your Documents',
  description:
    'Join Notario, the open signing infrastructure, and get a 10x better signing experience. Pricing starts at $30/mo. Forever! Sign in now and enjoy a faster, smarter, and more intuitive document signing process. Integrates with your favorite tools, customizable, and expandable. Support our mission and become a part of our community.',
  keywords:
    'Notario, DocuSign alternative, document signing, fast signing, beautiful signing, smart templates',
  authors: { name: 'Notario, Inc.' },
  robots: 'index, follow',
  openGraph: {
    title: 'Notario - Simplify Your Signatures, Secure Your Documents',
    description:
      'Join Notario, the open signing infrastructure, and get a 10x better signing experience. Pricing starts at $30/mo. Forever! Sign in now and enjoy a faster, smarter, and more intuitive document signing process. Integrates with your favorite tools, customizable, and expandable. Support our mission and become a part of our community.',
    type: 'website',
    images: [`${process.env.NEXT_PUBLIC_MARKETING_URL}/opengraph-image.jpg`],
  },
  twitter: {
    site: '@notario',
    card: 'summary_large_image',
    images: [`${process.env.NEXT_PUBLIC_MARKETING_URL}/opengraph-image.jpg`],
    description:
      'Join Notario, the open signing infrastructure, and get a 10x better signing experience. Pricing starts at $30/mo. Forever! Sign in now and enjoy a faster, smarter, and more intuitive document signing process. Integrates with your favorite tools, customizable, and expandable. Support our mission and become a part of our community.',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const flags = await getAllAnonymousFlags();

  return (
    <html
      lang="en"
      className={cn(fontInter.variable, fontCaveat.variable)}
      suppressHydrationWarning
    >
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <Suspense>
        <PostHogPageview />
      </Suspense>

      <body>
        <FeatureFlagProvider initialFlags={flags}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <PlausibleProvider>
              <TrpcProvider>{children}</TrpcProvider>
            </PlausibleProvider>
          </ThemeProvider>
        </FeatureFlagProvider>

        <Toaster />
      </body>
    </html>
  );
}
