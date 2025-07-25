
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  PieChart as PieChartIcon,
  Settings,
  Calculator,
  LucideIcon,
  FileText,
  Target,
  PieChart,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import React from 'react';

interface MenuItem {
    href: string;
    label: string;
    icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/captable', label: 'Cap Table', icon: PieChartIcon },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/dilution-simulator', label: 'Simulator', icon: Calculator },
  { href: '/milestones', label: 'Milestones', icon: Target },
];

const settingsItem: MenuItem = { href: '/settings', label: 'Settings', icon: Settings };

export function AppSidebar() {
  const pathname = usePathname();

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    return (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
            className="w-full justify-start"
          >
            <Link href={item.href}>
                <Icon className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">
                {item.label}
                </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
    );
  }

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
            <span className="font-bold group-data-[collapsible=icon]:hidden">
                EquityVision
            </span>
            </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(renderMenuItem)}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
            {renderMenuItem(settingsItem)}
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
