
'use client';

import type { FinancialRecord } from '@/types';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Download, Edit, MoreHorizontal, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface FinancialsTableProps {
  records: (FinancialRecord & { totalRevenue: number; totalExpenses: number; netIncome: number; })[];
  onEdit: (record: FinancialRecord) => void;
  onDelete: (month: string, year: number) => void;
}

export function FinancialsTable({ records, onEdit, onDelete }: FinancialsTableProps) {
  
  return (
    <div className="space-y-2">
       {records.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
                {records.map((record) => (
                    <AccordionItem value={`${record.month}-${record.year}`} key={`${record.month}-${record.year}`} className="border-b-0">
                         <Card className="mb-2">
                            <AccordionTrigger className="p-4 hover:no-underline">
                                <div className="flex justify-between items-center w-full">
                                    <div className="font-medium text-lg">{record.month} {record.year}</div>
                                    <Badge variant={record.netIncome >= 0 ? 'default' : 'destructive'} className="text-base">
                                        ${record.netIncome.toLocaleString()}
                                    </Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                                            <TrendingUp className="h-5 w-5 text-green-500" />
                                            <div>
                                                <div className="text-muted-foreground">Revenue</div>
                                                <div className="font-semibold text-green-500">${record.totalRevenue.toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                                            <TrendingDown className="h-5 w-5 text-red-500" />
                                            <div>
                                                <div className="text-muted-foreground">Total Expenses</div>
                                                <div className="font-semibold text-red-500">${record.totalExpenses.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-medium mb-2">Revenue Breakdown</h4>
                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                {record.revenueItems.map(item => (
                                                    <div key={item.id} className="flex justify-between">
                                                        <span>{item.description}</span>
                                                        <span>${item.amount.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                         <div>
                                            <h4 className="font-medium mb-2">Expense Breakdown</h4>
                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                {record.expenses.map(exp => (
                                                    <div key={exp.id} className="flex justify-between">
                                                        <span>{exp.description}</span>
                                                        <span>${exp.amount.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center pt-2">
                                        <div className='flex items-center gap-2'>
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={record.invoicePath} download>
                                                    <Download className="mr-2" />
                                                    Download Invoice
                                                </a>
                                            </Button>
                                             <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                         <p className='text-xs text-muted-foreground'>
                                                            Last updated: {new Date(record.lastUpdated).toLocaleDateString()}
                                                        </p>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{new Date(record.lastUpdated).toLocaleString()}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Actions</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(record); }}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(record.month, record.year); }} className="text-red-500 focus:text-red-500">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                ))}
            </Accordion>
        ) : (
             <div className="text-center py-12">
                <p className="text-muted-foreground">No financial records added yet.</p>
            </div>
        )}
    </div>
  );
}
