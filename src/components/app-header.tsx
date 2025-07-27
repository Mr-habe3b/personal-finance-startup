
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, Settings, User, LogOut, LifeBuoy, PieChart } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/auth-context';

interface AppHeaderProps {
    toggleMobileSidebar: () => void;
}

export function AppHeader({ toggleMobileSidebar }: AppHeaderProps) {
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <div className="flex items-center gap-2">
            {isMobile && (
                <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden"
                    onClick={toggleMobileSidebar}
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            )}
             <Link href="/" className="flex items-center gap-2 font-semibold text-primary sm:hidden">
                <PieChart className="h-6 w-6" />
                <span>EquityVision</span>
            </Link>
        </div>
      <div className="flex items-center gap-4 ml-auto">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full"
            >
              <Avatar>
                <AvatarImage src="/images/user/avatar.png" alt={user?.name} data-ai-hint="person" />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name || 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
