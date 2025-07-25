
'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FinancialRecord, ExpenseItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';

const expenseItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required.'),
  amount: z.coerce.number().min(0, 'Amount must be positive.'),
});

const formSchema = z.object({
  month: z.string().min(1, 'Month is required.'),
  revenue: z.coerce.number().min(0, 'Revenue must be a positive number.'),
  expenses: z.array(expenseItemSchema),
});

type FinancialRecordFormData = Omit<FinancialRecord, 'invoicePath'>;

interface FinancialRecordFormProps {
    record: FinancialRecord | null;
    onSave: (data: FinancialRecordFormData) => void;
    onDelete: (month: string) => void;
    onCancel: () => void;
    isOpen: boolean;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function FinancialRecordForm({ record, onSave, onDelete, onCancel, isOpen }: FinancialRecordFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        month: '',
        revenue: 0,
        expenses: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
      control: form.control,
      name: "expenses",
  });

  useEffect(() => {
    if (record) {
        form.reset({
            month: record.month,
            revenue: record.revenue,
            expenses: record.expenses.map(e => ({...e, id: e.id || `exp-${Math.random()}`}))
        });
    } else {
        form.reset({
            month: '',
            revenue: 0,
            expenses: [],
        });
    }
  }, [record, form, isOpen]);


  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values as FinancialRecordFormData);
  };

  const handleDeleteClick = () => {
    if (record) {
        onDelete(record.month);
    }
  }

  const isEditMode = !!record;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Financial Record' : 'Add New Record'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Update the financial data for ${record.month}.` : 'Enter the financial data for a new month.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Month</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditMode}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a month" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                        </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                    control={form.control}
                    name="revenue"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Revenue ($)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 25000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <FormLabel>Expenses</FormLabel>
                    <Button type="button" size="sm" variant="outline" onClick={() => append({ id: `exp-${Date.now()}`, description: '', amount: 0 })}>
                        <Plus className="mr-2" /> Add Expense
                    </Button>
                </div>
                <ScrollArea className="h-48 p-4 border rounded-md">
                     {fields.length > 0 ? (
                        <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-center">
                                 <FormField
                                    control={form.control}
                                    name={`expenses.${index}.description`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder="Expense description" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`expenses.${index}.amount`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="number" className="w-28" placeholder="Amount" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                    <Trash2 className="text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                     ) : (
                        <p className="text-sm text-muted-foreground text-center">No expenses added yet.</p>
                     )}
                </ScrollArea>
            </div>
           
             <DialogFooter className="flex justify-between items-center sm:justify-between w-full pt-4">
                <div>
                  {isEditMode && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button type="button" variant="destructive">
                              <Trash2 className="mr-2" />
                              Delete Record
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the financial record for {record?.month}.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteClick}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                  )}
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">{isEditMode ? 'Save Changes' : 'Add Record'}</Button>
                </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
