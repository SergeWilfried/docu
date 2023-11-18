'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Copy,
  Download,
  Edit,
  Files,
  History,
  Loader,
  MoreHorizontal,
  Pencil,
  Share,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

import { useCopyShareLink } from '@documenso/lib/client-only/hooks/use-copy-share-link';
import {
  TOAST_DOCUMENT_SHARE_ERROR,
  TOAST_DOCUMENT_SHARE_SUCCESS,
} from '@documenso/lib/constants/toast';
import { getFile } from '@documenso/lib/universal/upload/get-file';
import { Document, DocumentStatus, Recipient, User } from '@documenso/prisma/client';
import { DocumentWithData } from '@documenso/prisma/types/document-with-data';
import { trpc as trpcClient } from '@documenso/trpc/client';
import { trpc } from '@documenso/trpc/react';
import { DocumentShareButton } from '@documenso/ui/components/document/document-share-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@documenso/ui/primitives/dropdown-menu';
import { useToast } from '@documenso/ui/primitives/use-toast';

import { DeleteDraftDocumentDialog } from './delete-draft-document-dialog';

export type DataTableActionDropdownProps = {
  row: Document & {
    User: Pick<User, 'id' | 'name' | 'email'>;
    Recipient: Recipient[];
  };
};

export const DataTableActionDropdown = ({ row }: DataTableActionDropdownProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!session) {
    return null;
  }

  const recipient = row.Recipient.find((recipient) => recipient.email === session.user.email);

  const isOwner = row.User.id === session.user.id;
  // const isRecipient = !!recipient;
  const isDraft = row.status === DocumentStatus.DRAFT;
  // const isPending = row.status === DocumentStatus.PENDING;
  const isComplete = row.status === DocumentStatus.COMPLETED;
  // const isSigned = recipient?.signingStatus === SigningStatus.SIGNED;
  const isDocumentDeletable = isOwner && row.status === DocumentStatus.DRAFT;
  const { mutateAsync: createTemplateFromDocument } =
    trpc.template.createTemplateFromDocument.useMutation({
      onSuccess: ({ id }) => {
        router.refresh();
        router.push(`/templates/${id}`);

        toast({
          title: 'Template created',
          description: 'Your template has been created successfully.',
          duration: 5000,
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'An error occurred while creating template from document.',
          variant: 'destructive',
        });
      },
    });
  const { createAndCopyShareLink, isCopyingShareLink } = useCopyShareLink({
    onSuccess: () => toast(TOAST_DOCUMENT_SHARE_SUCCESS),
    onError: () => toast(TOAST_DOCUMENT_SHARE_ERROR),
  });
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

    link.href = window.URL.createObjectURL(blob);
    link.download = row.title || 'document.pdf';

    link.click();

    window.URL.revokeObjectURL(link.href);
  };
  const onSaveAsTemplateClick = async () => {
    try {
      await createTemplateFromDocument({ documentId: row.id });
    } catch {
      toast({
        title: 'Something went wrong',
        description: 'This template could not be created at this time. Please try again.',
        variant: 'destructive',
        duration: 7500,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal className="text-muted-foreground h-5 w-5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-52" align="start" forceMount>
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuItem disabled={!recipient || isComplete} asChild>
          <Link href={`/sign/${recipient?.token}`}>
            <Pencil className="mr-2 h-4 w-4" />
            Sign
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!isOwner || isComplete} asChild>
          <Link href={`/documents/${row.id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!isComplete} onClick={onDownloadClick}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!isOwner || isComplete} onClick={onSaveAsTemplateClick}>
          <Files className="mr-2 h-4 w-4" />
          Save as Template
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <XCircle className="mr-2 h-4 w-4" />
          Void
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} disabled={!isDocumentDeletable}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuLabel>Share</DropdownMenuLabel>
        <DropdownMenuItem disabled>
          <History className="mr-2 h-4 w-4" />
          Resend
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isDraft}
          onClick={async () =>
            createAndCopyShareLink({
              token: recipient?.token,
              documentId: row.id,
            })
          }
        >
          {isCopyingShareLink ? (
            <Loader className="mr-2 h-4 w-4" />
          ) : (
            <Share className="mr-2 h-4 w-4" />
          )}
          Share
        </DropdownMenuItem>
        <DocumentShareButton
          documentId={row.id}
          token={recipient?.token}
          trigger={({ loading, disabled }) => (
            <DropdownMenuItem disabled={disabled || isDraft} onSelect={(e) => e.preventDefault()}>
              <div className="flex items-center">
                {loading ? <Loader className="mr-2 h-4 w-4" /> : <Share className="mr-2 h-4 w-4" />}
                Share
              </div>
            </DropdownMenuItem>
          )}
        />
      </DropdownMenuContent>

      {isDocumentDeletable && (
        <DeleteDraftDocumentDialog
          id={row.id}
          open={isDeleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
    </DropdownMenu>
  );
};
