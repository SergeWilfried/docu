import { HTMLAttributes } from 'react';

import Image from 'next/image';

import backgroundPattern from '@documenso/assets/images/background-pattern.png';
import cardConnectionsFigure from '@documenso/assets/images/card-connections-figure.png';
import cardPaidFigure from '@documenso/assets/images/card-paid-figure.png';
import cardSharingFigure from '@documenso/assets/images/card-sharing-figure.png';
import cardWidgetFigure from '@documenso/assets/images/card-widget-figure.png';
import { cn } from '@documenso/ui/lib/utils';
import { Card, CardContent } from '@documenso/ui/primitives/card';
import { LocaleTypes, fallbackLng } from '@documenso/ui/i18n/settings';
import { createTranslation } from '@documenso/ui/i18n/server';

export type ShareConnectPaidWidgetBentoProps = HTMLAttributes<HTMLDivElement> & {
  locale?: LocaleTypes;
};
export const ShareConnectPaidWidgetBento = async ({
  className,
  locale = fallbackLng,
  ...props
}: ShareConnectPaidWidgetBentoProps) => {
  const { t } = await createTranslation(locale, 'marketing');

  return (
    <div className={cn('relative', className)} {...props}>
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <Image
          src={backgroundPattern}
          alt="background pattern"
          className="h-full scale-125 object-cover dark:contrast-[70%] dark:invert dark:sepia md:scale-150 lg:scale-[175%]"
        />
      </div>
      <h2 className="px-0 text-[22px] font-semibold md:px-12 md:text-4xl lg:px-24">
        {t('integratesTools')}
        <span className="block md:mt-0">{t('sendAndConnect')}</span>
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-8 md:mt-8">
        <Card className="col-span-2 lg:col-span-1" degrees={120} gradient>
          <CardContent className="grid grid-cols-1 gap-8 p-6">
            <p className="text-foreground/80 leading-relaxed">
              <strong className="block">{t('easySharing')}</strong>
              {t('personalLink')}
            </p>

            <div className="flex items-center justify-center p-8">
              <Image
                src={cardSharingFigure}
                alt={t('its-fast')}
                className="w-full max-w-xs dark:contrast-[70%] dark:hue-rotate-180 dark:invert"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1" spotlight>
          <CardContent className="grid grid-cols-1 gap-8 p-6">
            <p className="text-foreground/80 leading-relaxed">
              <strong className="block">{t('connections')}</strong>
              {t('automations')}
            </p>

            <div className="flex items-center justify-center p-8">
              <Image
                src={cardConnectionsFigure}
                alt={t('its-fast')}
                className="w-full max-w-sm dark:contrast-[70%] dark:hue-rotate-180 dark:invert"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1" spotlight>
          <CardContent className="grid grid-cols-1 gap-8 p-6">
            <p className="text-foreground/80 leading-relaxed">
              <strong className="block">{t('getPaid')}</strong>
              {t('stripe')}
            </p>

            <div className="flex items-center justify-center p-8">
              <Image
                src={cardPaidFigure}
                alt={t('its-fast')}
                className="w-full max-w-[14rem] dark:contrast-[70%] dark:hue-rotate-180 dark:invert"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1" spotlight>
          <CardContent className="grid grid-cols-1 gap-8 p-6">
            <p className="text-foreground/80 leading-relaxed">
              <strong className="block">{t('reactWidget')}</strong>
              {t('embedEasily')}
            </p>

            <div className="flex items-center justify-center p-8">
              <Image
                src={cardWidgetFigure}
                alt={t('its-fast')}
                className="w-full max-w-xs dark:contrast-[70%] dark:hue-rotate-180 dark:invert"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
