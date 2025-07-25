
'use client';

import type { FinancialRecord } from '@/types';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Download, Edit, MoreHorizontal, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface FinancialsTableProps {
  records: FinancialRecord[];
  onEdit: (record: FinancialRecord) => void;
  onDelete: (month: string) => void;
}

export function FinancialsTable({ records, onEdit, onDelete }: FinancialsTableProps) {
  
  return (
    <div className="space-y-2">
       {records.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
                {records.map((record) => (
                    <AccordionItem value={record.month} key={record.month} className="border-b-0">
                         <Card className="mb-2">
                            <AccordionTrigger className="p-4 hover:no-underline">
                                <div className="flex justify-between items-center w-full">
                                    <div className="font-medium text-lg">{record.month}</div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant={record.netIncome >= 0 ? 'default' : 'destructive'} className="text-base">
                                            ${record.netIncome.toLocaleString()}
                                        </Badge>
                                        <div className="flex items-center gap-2">
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
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(record.month); }} className="text-red-500 focus:text-red-500">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                                            <TrendingUp className="h-5 w-5 text-green-500" />
                                            <div>
                                                <div className="text-muted-foreground">Revenue</div>
                                                <div className="font-semibold text-green-500">${record.revenue.toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                                            <TrendingDown className="h-5 w-5 text-red-500" />
                                            <div>
                                                <div className="text-muted-foreground">Expenses</div>
                                                <div className="font-semibold text-red-500">${record.expenses.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">Details</h4>
                                        <p className="text-sm text-muted-foreground">{record.details}</p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                         <a href={record.invoicePath} download>
                                            <Download className="mr-2" />
                                            Download Invoice
                                        </a>
                                    </Button>
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

import { Card } from './ui/card';
