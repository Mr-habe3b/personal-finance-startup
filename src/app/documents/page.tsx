import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Briefcase, FileQuestion } from "lucide-react";
import { documents } from "@/data/mock";
import type { Document } from "@/types";

const getIconForType = (type: Document['type']) => {
    switch (type) {
        case 'Legal':
            return <Briefcase className="h-5 w-5 text-muted-foreground" />;
        case 'Sales':
            return <FileText className="h-5 w-5 text-muted-foreground" />;
        case 'RFQ':
            return <FileQuestion className="h-5 w-5 text-muted-foreground" />;
        default:
            return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
}

export default function DocumentsPage() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <AppHeader />
            <main className="flex-1 p-4 md:p-6">
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
                        {documents.length > 0 ? (
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="py-2">Name</TableHead>
                                        <TableHead className="hidden sm:table-cell py-2">Type</TableHead>
                                        <TableHead className="text-right py-2">Date Added</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documents.map((doc) => (
                                        <TableRow key={doc.id}>
                                            <TableCell className="py-2">
                                                <div className="flex items-center gap-3">
                                                    {getIconForType(doc.type)}
                                                    <span className="font-medium">{doc.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell py-2">
                                                <Badge variant="outline">{doc.type}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground py-2">{doc.dateAdded}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No documents uploaded yet.</p>
                                <p className="text-sm text-muted-foreground">Click "Upload Document" to get started.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
