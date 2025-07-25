
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { FinancialRecord } from '@/types';
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';

interface FinancialsTableProps {
  records: FinancialRecord[];
  onEdit: (record: FinancialRecord) => void;
  onDelete: (month: string) => void;
}

export function FinancialsTable({ records, onEdit, onDelete }: FinancialsTableProps) {
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead className="text-right">Expenses</TableHead>
            <TableHead className="text-right">Net Income</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.month}>
              <TableCell className="font-medium">{record.month}</TableCell>
              <TableCell className="text-right text-green-500">${record.revenue.toLocaleString()}</TableCell>
              <TableCell className="text-right text-red-500">${record.expenses.toLocaleString()}</TableCell>
               <TableCell className="text-right font-medium">
                    <Badge variant={record.netIncome >= 0 ? "default" : "destructive"}>
                        ${record.netIncome.toLocaleString()}
                    </Badge>
                </TableCell>
               <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(record)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => onDelete(record.month)} className="text-red-500 focus:text-red-500">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
       {records.length === 0 && (
          <div className="text-center py-12">
              <p className="text-muted-foreground">No financial records added yet.</p>
          </div>
      )}
    </div>
  );
}
