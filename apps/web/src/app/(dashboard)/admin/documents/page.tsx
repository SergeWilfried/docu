import { findDocuments } from '@documenso/lib/server-only/admin/get-all-documents';
import { useTranslation } from '@documenso/lib/i18n/client';
import { DocumentsDataTable } from './data-table';

export type DocumentsPageProps = {
  searchParams?: {
    page?: string;
    perPage?: string;
  };
};

export default async function Documents({ searchParams = {} }: DocumentsPageProps) {
  const page = Number(searchParams.page) || 1;
  const perPage = Number(searchParams.perPage) || 20;
  const { t } = useTranslation('web');

  const results = await findDocuments({
    page,
    perPage,
  });

  return (
    <div>
      <h2 className="text-4xl font-semibold">{t('manage-documents')}</h2>
      <div className="mt-8">
        <DocumentsDataTable results={results} />
      </div>
    </div>
  );
}
