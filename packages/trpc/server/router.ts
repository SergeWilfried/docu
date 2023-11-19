import { adminRouter } from './admin-router/router';
import { authRouter } from './auth-router/router';
import { documentRouter } from './document-router/router';
import { fieldRouter } from './field-router/router';
import { profileRouter } from './profile-router/router';
import { shareLinkRouter } from './share-link-router/router';
import { templateRouter } from './template-router/router';
import { procedure, router } from './trpc';
import { twoFactorRouter } from './two-factor-router/router';

export const appRouter = router({
  health: procedure.query(() => {
    return { status: 'ok' };
  }),
  auth: authRouter,
  profile: profileRouter,
  document: documentRouter,
  field: fieldRouter,
  admin: adminRouter,
  shareLink: shareLinkRouter,
  template: templateRouter,
  twoFactor: twoFactorRouter,
});

export type AppRouter = typeof appRouter;
