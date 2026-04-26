import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { I18nProvider } from '@/lib/i18n';
import { ErrorBoundary } from '@/components/error-boundary';

export const dynamic = 'force-dynamic';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <div className="flex min-h-screen bg-transparent">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-20 flex h-14 items-center border-b border-border/70 bg-background/85 px-4 backdrop-blur md:hidden">
            <MobileNav />
            <span className="ml-3 font-semibold">TaskFlow</span>
          </div>
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </I18nProvider>
  );
}
