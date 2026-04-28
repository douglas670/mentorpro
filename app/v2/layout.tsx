import { Sidebar } from '@/components/v2/Sidebar';

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <Sidebar />
      <div className="md:pl-64">
        <div className="min-h-screen">{children}</div>
      </div>
    </div>
  );
}
