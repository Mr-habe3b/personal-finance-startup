import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { SidebarInset } from "@/components/ui/sidebar";

export default function DocumentsPage() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full flex-col">
                <AppSidebar />
                <SidebarInset>
                    <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Legal Documents</CardTitle>
                                    <CardDescription>
                                        Manage and secure your company's legal agreements.
                                    </CardDescription>
                                </div>
                                <Button>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Document
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">No documents uploaded yet.</p>
                                    <p className="text-sm text-muted-foreground">Click "Upload Document" to get started.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
