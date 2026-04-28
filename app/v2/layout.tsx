import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/v2/Sidebar';
import { getCurrentUser } from '@/lib/session';

export default async function V2Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/?auth_required=1');

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <Sidebar />
      <div className="md:pl-64">
        <div className="min-h-screen">{children}</div>
      </div>
    </div>
  );
}
