
'use client';

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Library, Plus, Save, Trash2, FileText } from "lucide-react";
import { useState } from "react";
import type { WikiPage as WikiPageType } from "@/types";

export default function WikiPage() {
    const [pages, setPages] = useState<WikiPageType[]>([]);
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const selectedPage = pages.find(p => p.id === selectedPageId) ?? null;

    const handleNewPage = () => {
        const newPage: WikiPageType = {
            id: `wiki-${Date.now()}`,
            title: "Untitled Page",
            content: ""
        };
        setPages(prev => [...prev, newPage]);
        setSelectedPageId(newPage.id);
        setIsCreating(false);
    };
    
    const handleUpdatePage = (id: string, title: string, content: string) => {
        setPages(prev => prev.map(p => p.id === id ? { ...p, title, content } : p));
    }

    const handleDeletePage = (id: string) => {
        setPages(prev => prev.filter(p => p.id !== id));
        if (selectedPageId === id) {
            setSelectedPageId(null);
        }
    }

    return (
        <>
            <AppHeader />
            <main className="flex flex-1 flex-col">
                <div className="grid md:grid-cols-[280px_1fr] flex-1">
                    <div className="flex flex-col gap-4 border-r bg-muted/40 p-4">
                         <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Wiki Pages</h2>
                            <Button size="sm" onClick={handleNewPage}>
                                <Plus className="mr-2 h-4 w-4" /> New
                            </Button>
                        </div>
                        <nav className="flex flex-col gap-1">
                           {pages.map(page => (
                                <Button
                                    key={page.id}
                                    variant={selectedPageId === page.id ? "secondary" : "ghost"}
                                    className="justify-start"
                                    onClick={() => setSelectedPageId(page.id)}
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    {page.title}
                                </Button>
                           ))}
                           {pages.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center mt-4">No pages yet.</p>
                           )}
                        </nav>
                    </div>

                    <div className="p-4 md:p-6">
                        {selectedPage ? (
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                     <Input 
                                        className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0" 
                                        value={selectedPage.title}
                                        onChange={(e) => handleUpdatePage(selectedPage.id, e.target.value, selectedPage.content)}
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleUpdatePage(selectedPage.id, selectedPage.title, selectedPage.content)}>
                                            <Save className="mr-2 h-4 w-4" /> Save
                                        </Button>
                                         <Button size="sm" variant="destructive" onClick={() => handleDeletePage(selectedPage.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <Textarea 
                                    className="flex-1 text-base resize-none border-none shadow-none focus-visible:ring-0"
                                    placeholder="Start writing your document..."
                                    value={selectedPage.content}
                                    onChange={(e) => handleUpdatePage(selectedPage.id, selectedPage.title, e.target.value)}
                                />
                            </div>
                        ) : (
                             <div className="text-center py-20 flex flex-col items-center h-full justify-center">
                                <Library className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-lg font-semibold text-muted-foreground">Select a page or create a new one.</p>
                                <p className="text-sm text-muted-foreground">Your team's knowledge base lives here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
