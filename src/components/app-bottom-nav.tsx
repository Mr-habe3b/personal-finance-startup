
'use client';

import {
    LayoutDashboard,
    Users,
    PieChart,
    Landmark,
    TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/team', label: 'Team', icon: Users },
    { href: '/captable', label: 'Cap Table', icon: PieChart },
    { href: '/fundraising', label: 'Fundraising', icon: Landmark },
    { href: '/financials', label: 'Financials', icon: TrendingUp },
];

export function AppBottomNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "inline-flex flex-col items-center justify-center px-5 hover:bg-muted-foreground/10 group",
                            pathname === item.href ? "text-primary" : "text-muted-foreground"
                        )}
                        title={item.label}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="sr-only">{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
