import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Library, Plus } from "lucide-react";

export default function WikiPage() {
    return (
        <>
            <AppHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Wiki</CardTitle>
                            <CardDescription>
                                Your team's central knowledge base.
                            </CardDescription>
                        </div>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Page
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-20 flex flex-col items-center">
                            <Library className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-semibold text-muted-foreground">No wiki pages created yet.</p>
                            <p className="text-sm text-muted-foreground">Click "New Page" to create your first document.</p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
