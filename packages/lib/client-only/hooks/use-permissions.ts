import fetcher from '@documenso/packages/lib/fetcher';
import type { Permission } from '@documenso/packages/lib/permissions';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import type { ApiResponse } from 'types';

const usePermissions = () => {
  const router = useRouter();
  const [teamSlug, setTeamSlug] = useState<string | null>(null);

  const { slug } = router.query as { slug: string };

  useEffect(() => {
    if (slug) {
      setTeamSlug(slug);
    }
  }, [router.query]);

  const { data, error, isLoading } = useSWR<ApiResponse<Permission[]>>(
    teamSlug ? `/api/teams/${teamSlug}/permissions` : null,
    fetcher
  );

  return {
    isLoading,
    isError: error,
    permissions: data?.data,
  };
};

export default usePermissions;
