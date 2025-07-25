'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  PieChart,
  Settings,
  Calculator,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import React from 'react';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/dilution-simulator', label: 'Dilution Simulator', icon: Calculator },
  { href: '/team', label: 'Team', icon: Users },
];

const settingsItem = { href: '/settings', label: 'Settings', icon: Settings };

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      className="border-r"
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-primary"
        >
          <PieChart className="h-6 w-6" />
          <span className="group-data-[collapsible=icon]:hidden">
            EquityVision
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                className="w-full justify-start"
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === settingsItem.href}
                    tooltip={settingsItem.label}
                    className="w-full justify-start"
                >
                     <Link href={settingsItem.href}>
                        <settingsItem.icon className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">
                            {settingsItem.label}
                        </span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
