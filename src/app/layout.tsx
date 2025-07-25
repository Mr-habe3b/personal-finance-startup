
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AppSidebar } from '@/components/app-sidebar';
import { TeamProvider } from '@/context/team-context';
import { useEffect, useState } from 'react';

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
                  toggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
                />
              )}
              <div className={cn(
                  "flex flex-col transition-all duration-300 ease-in-out",
                   isSidebarCollapsed 
                    ? "md:pl-[72px]" 
                    : "md:pl-[220px] lg:pl-[280px]"
              )}>
                {children}
              </div>
            </div>
          </TeamProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
