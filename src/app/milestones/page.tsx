import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from "lucide-react";

export default function MilestonesPage() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <AppHeader />
            <main className="flex-1 p-4 md:p-6">
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
    );
}
