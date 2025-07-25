
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { financialData as initialFinancialData } from "@/data/mock";
import { DollarSign, TrendingDown, TrendingUp, Plus, Sparkles, Loader2 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { FinancialRecord } from "@/types";
import { FinancialsTable } from "@/components/financials-table";
import { Button } from "@/components/ui/button";
import { FinancialRecordForm } from "@/components/financial-record-form";
import { analyzeFinancials, FinancialAnalysisOutput } from '@/ai/flows/financial-analysis';
import { useToast } from '@/hooks/use-toast';

const calculateTotals = (record: FinancialRecord) => {
    const totalRevenue = record.revenueItems.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = record.expenses.reduce((sum, item) => sum + item.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    return { ...record, totalRevenue, totalExpenses, netIncome };
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function FinancialsPage() {
    const [financialData, setFinancialData] = useState<FinancialRecord[]>(initialFinancialData);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<FinancialRecord | null>(null);
    const [openAccordionItem, setOpenAccordionItem] = useState<string | undefined>(undefined);
    const [aiAnalysis, setAiAnalysis] = useState<FinancialAnalysisOutput | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { toast } = useToast();

    const processedFinancialData = useMemo(() => {
        return financialData.map(calculateTotals);
    }, [financialData]);
    
     useEffect(() => {
        const runAnalysis = async () => {
            if (processedFinancialData.length > 2) { // Only run analysis if there's enough data
                setIsAnalyzing(true);
                try {
                    const result = await analyzeFinancials({ financialRecords: processedFinancialData });
                    setAiAnalysis(result);
                } catch (error) {
                    console.error("Error analyzing financials:", error);
                    toast({
                        variant: 'destructive',
                        title: 'AI Analysis Failed',
                        description: 'Could not generate financial insights.'
                    });
                } finally {
                    setIsAnalyzing(false);
                }
            }
        };
        runAnalysis();
    }, [processedFinancialData, toast]);


    const analytics = useMemo(() => {
        const totalRevenue = processedFinancialData.reduce((acc, item) => acc + item.totalRevenue, 0);
        const totalExpenses = processedFinancialData.reduce((acc, item) => acc + item.totalExpenses, 0);
        const netProfit = totalRevenue - totalExpenses;
        const averageMonthlyBurn = processedFinancialData
            .filter(item => item.netIncome < 0)
            .reduce((acc, item, _, arr) => acc + Math.abs(item.netIncome) / arr.length, 0);

        return {
            totalRevenue,
            totalExpenses,
            netProfit,
            averageMonthlyBurn,
        }
    }, [processedFinancialData]);

    const handleAddRecordClick = () => {
        setSelectedRecord(null);
        setIsFormOpen(true);
    };

    const handleEditRecordClick = (record: FinancialRecord) => {
        setSelectedRecord(record);
        setIsFormOpen(true);
    };
    
    const handleSaveRecord = (recordData: Omit<FinancialRecord, 'invoicePath' | 'lastUpdated'>, originalRecord?: { month: string, year: number }) => {
        const invoicePath = `/invoices/${recordData.month.toLowerCase()}-${recordData.year}-invoice.pdf`;
        const lastUpdated = new Date().toISOString();
        
        const recordExists = (month: string, year: number) => financialData.some(r => r.month === month && r.year === year);

        if (originalRecord) { // This is an update
            const isNewMonthYear = originalRecord.month !== recordData.month || originalRecord.year !== recordData.year;
            if (isNewMonthYear && recordExists(recordData.month, recordData.year)) {
                 alert("A record for this month and year already exists.");
                 return;
            }
            setFinancialData(prev => prev.map(r => (r.month === originalRecord.month && r.year === originalRecord.year) ? { ...recordData, invoicePath, lastUpdated } : r));
        } else { // This is a new record
            if (recordExists(recordData.month, recordData.year)) {
                alert("A record for this month and year already exists.");
                return;
            }
            const newRecord = { ...recordData, invoicePath, lastUpdated };
             setFinancialData(prev => [...prev, newRecord].sort((a, b) => {
                const dateA = new Date(a.year, months.indexOf(a.month));
                const dateB = new Date(b.year, months.indexOf(b.month));
                return dateA.getTime() - dateB.getTime();
             }));
        }
        setOpenAccordionItem(`${recordData.month}-${recordData.year}`);
        setIsFormOpen(false);
    }
    
    const handleDeleteRecord = (month: string, year: number) => {
        setFinancialData(prev => prev.filter(r => !(r.month === month && r.year === year)));
        setIsFormOpen(false);
    }

    const handleCancel = () => {
        setIsFormOpen(false);
        setSelectedRecord(null);
    }
    
    return (
        <>
            <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between">
                     <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-1">Financials</h1>
                        <p className="text-muted-foreground">Track your company's financial performance and get AI-powered insights.</p>
                    </div>
                     <Button onClick={handleAddRecordClick}>
                        <Plus className="mr-2" />
                        Add Record
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${analytics.totalExpenses.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Profit / Loss</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${analytics.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                ${analytics.netProfit.toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Monthly Burn</CardTitle>
                             <TrendingDown className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${analytics.averageMonthlyBurn.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
                     <div className="lg:col-span-3 space-y-4">
                         <Card>
                            <CardHeader>
                                <CardTitle>Financial Records</CardTitle>
                                <CardDescription>Manage and review your monthly financial data.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FinancialsTable 
                                    records={processedFinancialData}
                                    onEdit={handleEditRecordClick}
                                    onDelete={(month, year) => handleDeleteRecord(month, year)}
                                    openItem={openAccordionItem}
                                    onOpenChange={setOpenAccordionItem}
                                />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue vs. Expenses</CardTitle>
                                <CardDescription>A monthly breakdown of cash flow.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={processedFinancialData.map(d => ({...d, name: `${d.month} ${d.year}`}))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="totalRevenue" fill="hsl(var(--primary))" name="Revenue" />
                                        <Bar dataKey="totalExpenses" fill="hsl(var(--destructive))" name="Expenses" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Net Income</CardTitle>
                                <CardDescription>Your company's profitability over time.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={processedFinancialData.map(d => ({...d, name: `${d.month} ${d.year}`}))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="netIncome" stroke="hsl(var(--primary))" name="Net Income" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                     </div>
                     <div className="lg:col-span-2">
                        <Card className="sticky top-20">
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="text-primary" />
                                    AI-Powered Insights
                                </CardTitle>
                                <CardDescription>Your financial co-pilot analyzing the data.</CardDescription>
                            </CardHeader>
                            <CardContent>
                               {isAnalyzing ? (
                                    <div className="flex items-center justify-center h-64">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                               ) : aiAnalysis ? (
                                   <div className="space-y-4">
                                       <div>
                                           <h4 className="font-semibold mb-2">Key Trends</h4>
                                           <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                                {aiAnalysis.keyTrends.map((trend, i) => <li key={i}>{trend}</li>)}
                                           </ul>
                                       </div>
                                       <div>
                                           <h4 className="font-semibold mb-2">Profitability</h4>
                                           <p className="text-sm text-muted-foreground">{aiAnalysis.profitabilityAnalysis}</p>
                                       </div>
                                       <div>
                                           <h4 className="font-semibold mb-2">Burn Rate</h4>
                                           <p className="text-sm text-muted-foreground">{aiAnalysis.burnRateAnalysis}</p>
                                       </div>
                                        <div>
                                           <h4 className="font-semibold mb-2">Outlook</h4>
                                           <p className="text-sm text-muted-foreground italic">"{aiAnalysis.forwardLookingStatement}"</p>
                                       </div>
                                   </div>
                               ) : (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground">Add more financial records to unlock AI insights.</p>
                                    </div>
                               )}
                            </CardContent>
                        </Card>
                     </div>
                </div>

            </main>
            {isFormOpen && (
                 <FinancialRecordForm
                    key={selectedRecord ? `${selectedRecord.month}-${selectedRecord.year}` : 'new'}
                    record={selectedRecord}
                    onSave={handleSaveRecord}
                    onDelete={handleDeleteRecord}
                    onCancel={handleCancel}
                    isOpen={isFormOpen}
                />
            )}
        </>
    );
}
