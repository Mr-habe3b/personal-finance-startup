import { AppHeader } from "@/components/app-header";
import { CapTableChart } from '@/components/cap-table-chart';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { capTable } from '@/data/mock';

export default function CapTablePage() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <AppHeader />
            <main className="flex-1 p-4 sm:px-6 sm:py-8 md:gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Cap Table</CardTitle>
                        <CardDescription>
                            Current company ownership structure.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CapTableChart capTable={capTable} />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
