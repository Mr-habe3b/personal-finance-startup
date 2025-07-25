
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AppSidebar } from '@/components/app-sidebar';
import { TeamProvider } from '@/context/team-context';
import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/app-header';

// This is a client component, so metadata should be defined in a parent server component if needed.
// export const metadata: Metadata = {
//   title: 'EquityVision',
//   description: 'Manage and visualize your company ownership with ease.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  }

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
          <TeamProvider>
             <div className="min-h-screen w-full">
               {isMounted && (
                <AppSidebar 
                  isCollapsed={isSidebarCollapsed}
                  toggleSidebar={toggleSidebar}
                />
              )}
              <div className={cn(
                  "flex flex-col h-screen",
                   isMounted && isSidebarCollapsed 
                    ? "md:pl-[72px]" 
                    : "md:pl-[220px] lg:pl-[280px]"
              )}>
                <AppHeader isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
              </div>
            </div>
          </TeamProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
