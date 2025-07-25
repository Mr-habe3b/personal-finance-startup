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
import { SidebarInset } from "@/components/ui/sidebar";

export default function CapTablePage() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full flex-col">
                <AppSidebar />
                <SidebarInset>
                    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
