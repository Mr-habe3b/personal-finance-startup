import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AppHeader } from "@/components/app-header";

export default function MilestonesPage() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full flex-col">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                    <AppHeader />
                    <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Milestones & Targets</CardTitle>
                                    <CardDescription>
                                        Track your startup's progress, set targets, and assign tasks.
                                    </CardDescription>
                                </div>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Milestone
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">No milestones created yet.</p>
                                    <p className="text-sm text-muted-foreground">Click "Add Milestone" to set your first target.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
