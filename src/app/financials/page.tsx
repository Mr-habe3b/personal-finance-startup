
'use client';

import { AppHeader } from "@/components/app-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { financialData } from "@/data/mock";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function FinancialsPage() {

    const analytics = useMemo(() => {
        const totalRevenue = financialData.reduce((acc, item) => acc + item.revenue, 0);
        const totalExpenses = financialData.reduce((acc, item) => acc + item.expenses, 0);
        const netProfit = totalRevenue - totalExpenses;
        const averageMonthlyBurn = financialData
            .filter(item => item.netIncome < 0)
            .reduce((acc, item, _, arr) => acc - item.netIncome / arr.length, 0);

        return {
            totalRevenue,
            totalExpenses,
            netProfit,
            averageMonthlyBurn,
        }
    }, []);
    
    return (
        <>
            <AppHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Financials</h1>
                    <p className="text-muted-foreground mb-6">Track your company's financial performance.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Total revenue over the last 6 months.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <TrendingDown className="h-4 w-4 text-muted-foreground text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${analytics.totalExpenses.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Total expenses over the last 6 months.</p>
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
                            <p className="text-xs text-muted-foreground">Total net profit over the last 6 months.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Monthly Burn</CardTitle>
                             <TrendingDown className="h-4 w-4 text-muted-foreground text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${analytics.averageMonthlyBurn.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Average cash burn in unprofitable months.</p>
                        </CardContent>
                    </Card>
                </div>

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
        </>
    );
}
