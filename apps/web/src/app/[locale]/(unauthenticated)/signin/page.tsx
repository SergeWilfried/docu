import Link from 'next/link';

import { useTranslation } from '@documenso/ui/i18n/client';

import { SignInForm } from '~/components/forms/signin';

const SignInPage = ({ locale }) => {
  // Make sure to use the correct namespace here.
  const { t } = useTranslation(locale, 'marketing');

  return (
    <div>
      <h1 className="text-4xl font-semibold">{t(`sign-in-your-account`)}</h1>

      <p className="text-muted-foreground/60 mt-2 text-sm">{t(`welcome-back`)}</p>

      <SignInForm className="mt-4" />

      <p className="text-muted-foreground mt-6 text-center text-sm">
        {t(`no-account`)}{' '}
        <Link href="/signup" className="text-primary duration-200 hover:opacity-70">
          {t('signup')}
        </Link>
      </p>

      <p className="mt-2.5 text-center">
        <Link
          href="/forgot-password"
          className="text-muted-foreground text-sm duration-200 hover:opacity-70"
        >
          {t(`forgot-password`)}
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;
