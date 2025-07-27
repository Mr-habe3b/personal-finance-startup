
'use client';

import { CapTableChart } from '@/components/cap-table-chart';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTeam } from "@/context/team-context";
import type { Metadata } from 'next';

// Although this is a client component, we can still export metadata
export const metadata: Metadata = {
  title: 'Cap Table | EquityVision',
  description: 'View the current company ownership structure and equity distribution.',
};

export default function CapTablePage() {
    const { capTable } = useTeam();

    return (
        <>
            <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Cap Table</CardTitle>
                        <CardDescription>
                            Current company ownership structure.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <CapTableChart capTable={capTable} />
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
