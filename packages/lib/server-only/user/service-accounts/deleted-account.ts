import { prisma } from '@documenso/prisma';

export const deletedAccountServiceAccount = async () => {
  const serviceAccount = await prisma.user.findFirst({
    where: {
      email: 'deleted-account@tampon.xyz',
    },
  });

  if (!serviceAccount) {
    throw new Error(
      'Deleted account service account not found, have you ran the appropriate migrations?',
    );
  }

  return serviceAccount;
};
