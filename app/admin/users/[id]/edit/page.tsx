'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditUserPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to users list - editing is now done via modal
    router.push('/admin/users');
  }, [router]);

  return null;
}
