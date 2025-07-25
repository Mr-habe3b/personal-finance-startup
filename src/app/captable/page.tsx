import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { CapTableChart } from '@/components/cap-table-chart';
import { capTable } from '@/data/mock';
import { AppHeader } from "@/components/app-header";

export default function CapTablePage() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full flex-col">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                    <AppHeader />
                    <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
            </div>
        </SidebarProvider>
    );
}
