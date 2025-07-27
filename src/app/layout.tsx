
'use client';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AppSidebar } from '@/components/app-sidebar';
import { TeamProvider } from '@/context/team-context';
import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { useIsMobile } from '@/hooks/use-mobile';
import { AppBottomNav } from '@/components/app-bottom-nav';
import { AuthProvider, AuthGuard } from '@/context/auth-context';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

function AppContent({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  }
  
  const toggleMobileSidebar = () => {
      setIsMobileSidebarOpen(prev => !prev);
  }

  if (!user || pathname === '/login') {
    return <>{children}</>;
  }

  return (
     <div className="flex min-h-screen w-full flex-col bg-muted/40">
       {isMounted && !isMobile && (
        <AppSidebar 
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
          isMobile={false}
        />
      )}
       {isMounted && isMobile && (
         <AppSidebar
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleMobileSidebar}
            isMobile={true}
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
       )}
      <div className={cn(
          "flex flex-col",
          isMounted && !isMobile && (isSidebarCollapsed 
            ? "sm:pl-14" 
            : "sm:pl-[220px] lg:pl-[280px]"),
          isMobile && "pb-16" // Padding for bottom nav
      )}>
        <AppHeader toggleMobileSidebar={toggleMobileSidebar} />
        <main className="flex-1">
            {children}
        </main>
      </div>
       {isMounted && isMobile && <AppBottomNav />}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>EquityVision</title>
        <meta name="description" content="Manage and visualize your company ownership with ease." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AuthGuard>
              <TeamProvider>
                <AppContent>{children}</AppContent>
              </TeamProvider>
            </AuthGuard>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
