import type { HTMLAttributes } from 'react';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import backgroundPattern from '@documenso/assets/images/background-pattern.png';
import cardBeautifulFigure from '@documenso/assets/images/card-beautiful-figure.png';
import cardFastFigure from '@documenso/assets/images/card-fast-figure.png';
import cardSmartFigure from '@documenso/assets/images/card-smart-figure.png';
import { createTranslation } from '@documenso/ui/i18n/server';
import type { LocaleTypes } from '@documenso/ui/i18n/settings';
import { cn } from '@documenso/ui/lib/utils';
import { Card, CardContent } from '@documenso/ui/primitives/card';

export type FasterSmarterBeautifulBentoProps = HTMLAttributes<HTMLDivElement>;

export const FasterSmarterBeautifulBento = async ({
  className,
  ...props
}: FasterSmarterBeautifulBentoProps) => {
  const locale = useParams()?.locale as LocaleTypes;
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
        {t('a-10x-better-signing-experience')}
        <span className="block md:mt-0">{t('faster-smarter-and-more-beautiful')}</span>
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-8 md:mt-8">
        <Card className="col-span-2" degrees={45} gradient>
          <CardContent className="grid grid-cols-12 gap-8 overflow-hidden p-6 lg:aspect-[2.5/1]">
            <p className="text-foreground/80 col-span-12 leading-relaxed lg:col-span-6">
              <strong className="block">{t('fast')}</strong>
              {t('when-it-comes-to')}
            </p>

            <div className="col-span-12 -my-6 -mr-6 flex items-end justify-end pt-12 lg:col-span-6">
              <Image
                src={cardFastFigure}
                alt="its fast"
                className="max-w-[80%] dark:contrast-[70%] dark:hue-rotate-180 dark:invert lg:max-w-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1" spotlight>
          <CardContent className="grid grid-cols-1 gap-8 p-6">
            <p className="text-foreground/80 leading-relaxed">
              <strong className="block">{t('beautiful')}</strong>
              {t('because-signing-should')}
            </p>

            <div className="flex items-center justify-center p-8">
              <Image
                src={cardBeautifulFigure}
                alt="its fast"
                className="w-full max-w-xs dark:contrast-[70%] dark:hue-rotate-180 dark:invert"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1" spotlight>
          <CardContent className="grid grid-cols-1 gap-8 p-6">
            <p className="text-foreground/80 leading-relaxed">
              <strong className="block">{t('smart')}</strong>
              {t('our-custom-templates')}
            </p>

            <div className="flex items-center justify-center p-8">
              <Image
                src={cardSmartFigure}
                alt="its fast"
                className="w-full max-w-[16rem] dark:contrast-[70%] dark:hue-rotate-180 dark:invert"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
