
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Briefcase, FileQuestion, Download, Trash2, Sparkles } from "lucide-react";
import { documents as initialDocuments } from "@/data/mock";
import type { Document, UIDocument } from "@/types";
import { useRef, useState, useEffect } from "react";
import { DocumentQADialog } from "@/components/document-qa-dialog";
import { useIsMobile } from "@/hooks/use-mobile";

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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [documents, setDocuments] = useState<UIDocument[]>([]);
    const [isQADialogOpen, setIsQADialogOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<UIDocument | null>(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        const loadInitialDocuments = async () => {
             const docsWithContent = await Promise.all(initialDocuments.map(async (doc) => {
                try {
                    // In a real app, you would fetch from a URL.
                    // For this mock, we'll simulate fetching by creating a dummy file.
                    const response = await fetch(doc.path);
                    const blob = await response.blob();
                    const file = new File([blob], doc.name, { type: blob.type });
                    const content = await file.text();

                    return {
                        ...doc,
                        file,
                        url: URL.createObjectURL(file),
                        content: content
                    };
                } catch (e) {
                     console.error("Error loading initial doc", e);
                     return {
                         ...doc,
                         file: undefined,
                         url: doc.path,
                         content: "Could not load content"
                     }
                }
            }));
            setDocuments(docsWithContent);
        }
        loadInitialDocuments();

        // Cleanup object URLs on component unmount
        return () => {
            documents.forEach(doc => {
                if (doc.url && doc.url.startsWith('blob:')) {
                    URL.revokeObjectURL(doc.url);
                }
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const content = await file.text();
            const newDocument: UIDocument = {
                id: `doc-${Date.now()}`,
                name: file.name,
                type: 'Legal', // Defaulting, could be dynamic
                dateAdded: new Date().toISOString().split('T')[0],
                path: `/documents/${file.name}`,
                file: file,
                url: URL.createObjectURL(file),
                content,
            };
            setDocuments(prev => [...prev, newDocument]);
        }
    }
    
    const handleAskAI = (doc: UIDocument) => {
        setSelectedDocument(doc);
        setIsQADialogOpen(true);
    }

    const handleDelete = (docId: string) => {
        const docToDelete = documents.find(d => d.id === docId);
        if (docToDelete?.url && docToDelete.url.startsWith('blob:')) {
            URL.revokeObjectURL(docToDelete.url);
        }
        setDocuments(prev => prev.filter(doc => doc.id !== docId));
    }

    return (
        <>
            <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Legal Documents</CardTitle>
                            <CardDescription>
                                Manage, secure, and ask questions about your company's legal agreements.
                            </CardDescription>
                        </div>
                        <Button onClick={handleUploadClick} size={isMobile ? 'icon' : 'default'} aria-label="Upload Document">
                            <Upload />
                            <span className="sr-only md:not-sr-only md:ml-2">Upload Document</span>
                        </Button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            accept=".txt,.md,.pdf,.doc,.docx"
                        />
                    </CardHeader>
                    <CardContent>
                        {documents.length > 0 ? (
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="hidden sm:table-cell">Type</TableHead>
                                        <TableHead className="hidden md:table-cell">Date Added</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documents.map((doc) => (
                                        <TableRow key={doc.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {getIconForType(doc.type)}
                                                    <span className="font-medium">{doc.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge variant="outline">{doc.type}</Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground">{doc.dateAdded}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                 <Button variant="outline" size="sm" onClick={() => handleAskAI(doc)} disabled={!doc.content}>
                                                    <Sparkles className="mr-2 h-4 w-4" />
                                                    Ask AI
                                                </Button>
                                                 <Button variant="ghost" size="icon" asChild aria-label="Download Document">
                                                    <a href={doc.url} download={doc.name}>
                                                        <Download className="h-4 w-4" />
                                                        <span className="sr-only">Download</span>
                                                    </a>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)} aria-label="Delete Document">
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </TableCell>
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
            {isQADialogOpen && selectedDocument && (
                 <DocumentQADialog
                    isOpen={isQADialogOpen}
                    onClose={() => setIsQADialogOpen(false)}
                    document={selectedDocument}
                />
            )}
        </>
    );
}
