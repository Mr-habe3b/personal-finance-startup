
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Library, Plus, Save, Trash2, FileText, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { WikiPage as WikiPageType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { generateWikiContent } from "@/ai/flows/wiki-content-generator";

const WIKI_STORAGE_KEY = 'equityvision-wiki-pages';

export default function WikiPage() {
    const [pages, setPages] = useState<WikiPageType[]>([]);
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
    const [activeTitle, setActiveTitle] = useState('');
    const [activeContent, setActiveContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    // Load pages from localStorage on initial render
    useEffect(() => {
        try {
            const savedPages = localStorage.getItem(WIKI_STORAGE_KEY);
            if (savedPages) {
                const parsedPages = JSON.parse(savedPages);
                setPages(parsedPages);
                if (parsedPages.length > 0 && !selectedPageId) {
                    setSelectedPageId(parsedPages[0].id);
                }
            }
        } catch (error) {
            console.error("Failed to load wiki pages from localStorage", error);
        }
    }, [selectedPageId]);

    // Save pages to localStorage whenever they change
    useEffect(() => {
        try {
             if (pages.length > 0) {
                localStorage.setItem(WIKI_STORAGE_KEY, JSON.stringify(pages));
            } else {
                 localStorage.removeItem(WIKI_STORAGE_KEY);
            }
        } catch (error) {
            console.error("Failed to save wiki pages to localStorage", error);
        }
    }, [pages]);

    const selectedPage = pages.find(p => p.id === selectedPageId) ?? null;

    useEffect(() => {
        if (selectedPage) {
            setActiveTitle(selectedPage.title);
            setActiveContent(selectedPage.content);
        } else {
            setActiveTitle('');
            setActiveContent('');
        }
    }, [selectedPage]);


    const handleNewPage = () => {
        const newPage: WikiPageType = {
            id: `wiki-${Date.now()}`,
            title: "Untitled Page",
            content: ""
        };
        setPages(prev => [...prev, newPage]);
        setSelectedPageId(newPage.id);
    };
    
    const handleUpdatePage = () => {
        if (selectedPageId) {
            setPages(prev => prev.map(p => p.id === selectedPageId ? { ...p, title: activeTitle, content: activeContent } : p));
             toast({ title: "Page Saved", description: `"${activeTitle}" has been updated.`});
        }
    }

    const handleDeletePage = (id: string) => {
        const pageToDelete = pages.find(p => p.id === id);
        const newPages = pages.filter(p => p.id !== id);
        setPages(newPages);
        
        if (selectedPageId === id) {
            setSelectedPageId(newPages.length > 0 ? newPages[0].id : null);
        }
        
        toast({ title: "Page Deleted", description: `"${pageToDelete?.title}" has been removed.`});
    }

    const handleGenerateContent = async () => {
        if (!activeTitle) {
            toast({ variant: 'destructive', title: 'Title Required', description: 'Please provide a title for the AI to generate content.' });
            return;
        }
        setIsGenerating(true);
        try {
            const result = await generateWikiContent({ title: activeTitle });
            setActiveContent(prev => prev ? `${prev}\n\n---\n\n${result.content}` : result.content);
        } catch (error) {
            console.error("AI content generation failed:", error);
            toast({ variant: 'destructive', title: 'AI Error', description: 'Failed to generate content.' });
        } finally {
            setIsGenerating(false);
        }
    }


    return (
        <>
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
                                    <span className="truncate">{page.title}</span>
                                </Button>
                           ))}
                           {pages.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center mt-4">No pages yet.</p>
                           )}
                        </nav>
                    </div>

                    <div className="p-4 md:p-6">
                        {selectedPage ? (
                             <div className="w-full h-full flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                     <Input 
                                        className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0" 
                                        value={activeTitle}
                                        onChange={(e) => setActiveTitle(e.target.value)}
                                        onBlur={handleUpdatePage}
                                    />
                                    <div className="flex gap-2 shrink-0 ml-4">
                                        <Button size="sm" variant="outline" onClick={handleGenerateContent} disabled={isGenerating}>
                                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                            Generate
                                        </Button>
                                        <Button size="sm" onClick={handleUpdatePage}>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save
                                        </Button>
                                         <Button size="icon" variant="destructive" onClick={() => handleDeletePage(selectedPage.id)} aria-label="Delete Page">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <Textarea 
                                    className="flex-1 text-base resize-none border-none shadow-none focus-visible:ring-0 p-0"
                                    placeholder="Start writing your document..."
                                    value={activeContent}
                                    onChange={(e) => setActiveContent(e.target.value)}
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
