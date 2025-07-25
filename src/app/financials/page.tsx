
'use client';

import { AppHeader } from "@/components/app-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { financialData as initialFinancialData } from "@/data/mock";
import { DollarSign, TrendingDown, TrendingUp, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { FinancialRecord } from "@/types";
import { FinancialsTable } from "@/components/financials-table";
import { Button } from "@/components/ui/button";
import { FinancialRecordForm } from "@/components/financial-record-form";

const calculateTotals = (record: FinancialRecord) => {
    const totalRevenue = record.revenueItems.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = record.expenses.reduce((sum, item) => sum + item.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    return { ...record, totalRevenue, totalExpenses, netIncome };
}


export default function FinancialsPage() {
    const [financialData, setFinancialData] = useState<FinancialRecord[]>(initialFinancialData);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<FinancialRecord | null>(null);

    const processedFinancialData = useMemo(() => {
        return financialData.map(calculateTotals);
    }, [financialData]);

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
    
    const handleSaveRecord = (recordData: Omit<FinancialRecord, 'invoicePath'>, originalMonth?: string) => {
        const invoicePath = `/invoices/${recordData.month.toLowerCase()}-invoice.pdf`;
        
        if (originalMonth) { // This is an update
            if (originalMonth !== recordData.month && financialData.some(r => r.month === recordData.month)) {
                 alert("A record for this month already exists.");
                 return;
            }
            setFinancialData(prev => prev.map(r => r.month === originalMonth ? { ...recordData, invoicePath } : r));
        } else { // This is a new record
            if (financialData.some(r => r.month === recordData.month)) {
                alert("A record for this month already exists.");
                return;
            }
             setFinancialData(prev => [...prev, { ...recordData, invoicePath }].sort((a, b) => new Date(`1 ${a.month} 2000`).getTime() - new Date(`1 ${b.month} 2000`).getTime()));
        }
        setIsFormOpen(false);
    }
    
    const handleDeleteRecord = (month: string) => {
        setFinancialData(prev => prev.filter(r => r.month !== month));
        setIsFormOpen(false);
    }

    const handleCancel = () => {
        setIsFormOpen(false);
        setSelectedRecord(null);
    }
    
    return (
        <>
            <AppHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between">
                     <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-1">Financials</h1>
                        <p className="text-muted-foreground">Track your company's financial performance.</p>
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
                            <TrendingUp className="h-4 w-4 text-muted-foreground text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <TrendingDown className="h-4 w-4 text-muted-foreground text-red-500" />
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
                             <TrendingDown className="h-4 w-4 text-muted-foreground text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${analytics.averageMonthlyBurn.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
                     <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Financial Records</CardTitle>
                            <CardDescription>Manage and review your monthly financial data.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FinancialsTable 
                                records={processedFinancialData}
                                onEdit={handleEditRecordClick}
                                onDelete={(month) => handleDeleteRecord(month)}
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
                                <BarChart data={processedFinancialData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
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
                                <LineChart data={processedFinancialData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="netIncome" stroke="hsl(var(--primary))" name="Net Income" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

            </main>
            {isFormOpen && (
                 <FinancialRecordForm
                    key={selectedRecord?.month || 'new'}
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
