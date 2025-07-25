
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

export default function FinancialsPage() {
    const [financialData, setFinancialData] = useState<FinancialRecord[]>(initialFinancialData);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<FinancialRecord | null>(null);

    const analytics = useMemo(() => {
        const totalRevenue = financialData.reduce((acc, item) => acc + item.revenue, 0);
        const totalExpenses = financialData.reduce((acc, item) => acc + item.expenses, 0);
        const netProfit = totalRevenue - totalExpenses;
        const averageMonthlyBurn = financialData
            .filter(item => item.netIncome < 0)
            .reduce((acc, item, _, arr) => acc + Math.abs(item.netIncome) / arr.length, 0);

        return {
            totalRevenue,
            totalExpenses,
            netProfit,
            averageMonthlyBurn,
        }
    }, [financialData]);

    const handleAddRecordClick = () => {
        setSelectedRecord(null);
        setIsFormOpen(true);
    };

    const handleEditRecordClick = (record: FinancialRecord) => {
        setSelectedRecord(record);
        setIsFormOpen(true);
    };
    
    const handleSaveRecord = (recordData: Omit<FinancialRecord, 'netIncome'>) => {
        const netIncome = recordData.revenue - recordData.expenses;
        
        if (selectedRecord && recordData.month === selectedRecord.month) {
            // Update existing record
             setFinancialData(prev => prev.map(r => r.month === recordData.month ? { ...recordData, netIncome } : r));
        } else {
            // Add new record - prevent duplicate months
            if (financialData.some(r => r.month === recordData.month)) {
                alert("A record for this month already exists."); // Or use a toast
                return;
            }
             setFinancialData(prev => [...prev, { ...recordData, netIncome }].sort((a, b) => new Date(`1 ${a.month} 2000`).getTime() - new Date(`1 ${b.month} 2000`).getTime()));
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

                 <Card>
                    <CardHeader>
                        <CardTitle>Financial Records</CardTitle>
                        <CardDescription>Manage your monthly financial data.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FinancialsTable 
                            records={financialData}
                            onEdit={handleEditRecordClick}
                            onDelete={(month) => handleDeleteRecord(month)}
                        />
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue vs. Expenses</CardTitle>
                            <CardDescription>A monthly breakdown of cash flow.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={financialData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
                                    <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" />
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
                                <LineChart data={financialData}>
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
