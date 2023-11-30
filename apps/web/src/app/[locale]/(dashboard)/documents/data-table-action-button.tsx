'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Download, Edit, Pencil, Share } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { match } from 'ts-pattern';

import { getFile } from '@documenso/lib/universal/upload/get-file';
import { Document, DocumentStatus, Recipient, SigningStatus, User } from '@documenso/prisma/client';
import { DocumentWithData } from '@documenso/prisma/types/document-with-data';
import { trpc as trpcClient } from '@documenso/trpc/client';
import { DocumentShareButton } from '@documenso/ui/components/document/document-share-button';
import { LocaleTypes } from '@documenso/ui/i18n/settings';
import { Button } from '@documenso/ui/primitives/button';

export type DataTableActionButtonProps = {
  row: Document & {
    User: Pick<User, 'id' | 'name' | 'email'>;
    Recipient: Recipient[];
  };
};

export const DataTableActionButton = ({ row }: DataTableActionButtonProps) => {
  const { data: session } = useSession();
  const locale = useParams()?.locale as LocaleTypes;

  if (!session) {
    return null;
  }

  const recipient = row.Recipient.find((recipient) => recipient.email === session.user.email);

  const isOwner = row.User.id === session.user.id;
  const isRecipient = !!recipient;
  const isDraft = row.status === DocumentStatus.DRAFT;
  const isPending = row.status === DocumentStatus.PENDING;
  const isComplete = row.status === DocumentStatus.COMPLETED;
  const isSigned = recipient?.signingStatus === SigningStatus.SIGNED;

  const onDownloadClick = async () => {
    let document: DocumentWithData | null = null;

    if (!recipient) {
      document = await trpcClient.document.getDocumentById.query({
        id: row.id,
      });
    } else {
      document = await trpcClient.document.getDocumentByToken.query({
        token: recipient.token,
      });
    }

    const documentData = document?.documentData;

    if (!documentData) {
      return;
    }

    const documentBytes = await getFile(documentData);

    const blob = new Blob([documentBytes], {
      type: 'application/pdf',
    });

    const link = window.document.createElement('a');
    const baseTitle = row.title.includes('.pdf') ? row.title.split('.pdf')[0] : row.title;

    link.href = window.URL.createObjectURL(blob);
    link.download = baseTitle ? `${baseTitle}_signed.pdf` : 'document.pdf';

    link.click();

    window.URL.revokeObjectURL(link.href);
  };

  return match({
    isOwner,
    isRecipient,
    isDraft,
    isPending,
    isComplete,
    isSigned,
  })
    .with({ isOwner: true, isDraft: true }, () => (
      <Button className="w-24" asChild>
        <Link href={`/${locale}/documents/${row.id}`}>
          <Edit className="-ml-1 mr-2 h-4 w-4" />
          Edit
        </Link>
      </Button>
    ))
    .with({ isRecipient: true, isPending: true, isSigned: false }, () => (
      <Button className="w-24" asChild>
        <Link href={`/${locale}/sign/${recipient?.token}`}>
          <Pencil className="-ml-1 mr-2 h-4 w-4" />
          Sign
        </Link>
      </Button>
    ))
    .with({ isPending: true, isSigned: true }, () => (
      <Button className="w-32" disabled={true}>
        <Pencil className="-ml-1 mr-2 inline h-4 w-4" />
        Sign
      </Button>
    ))
    .with({ isComplete: true }, () => (
      <Button className="w-32" onClick={onDownloadClick}>
        <Download className="-ml-1 mr-2 inline h-4 w-4" />
        Download
      </Button>
    ))
    .otherwise(() => (
      <DocumentShareButton
        documentId={row.id}
        token={recipient?.token}
        locale={locale}
        trigger={({ loading }) => (
          <Button className="w-24" loading={loading}>
            {!loading && <Share className="-ml-1 mr-2 h-4 w-4" />}
            Share
          </Button>
        )}
      />
    ));
};
