
'use client';

import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FinancialRecord, ExpenseItem, RevenueItem } from '@/types';
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
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

const revenueItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required.'),
  amount: z.coerce.number().min(0, 'Amount must be positive.'),
});


const expenseItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required.'),
  amount: z.coerce.number().min(0, 'Amount must be positive.'),
});

const formSchema = z.object({
  month: z.string().min(1, 'Month is required.'),
  year: z.coerce.number().min(2000, "Year must be after 2000").max(new Date().getFullYear() + 5, "Year seems too far in the future"),
  revenueItems: z.array(revenueItemSchema),
  expenses: z.array(expenseItemSchema),
});

type FinancialRecordFormData = Omit<FinancialRecord, 'invoicePath' | 'lastUpdated'>;

interface FinancialRecordFormProps {
    record: FinancialRecord | null;
    onSave: (data: FinancialRecordFormData, originalRecord?: { month: string, year: number }) => void;
    onDelete: (month: string, year: number) => void;
    onCancel: () => void;
    isOpen: boolean;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function FinancialRecordForm({ record, onSave, onDelete, onCancel, isOpen }: FinancialRecordFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        month: '',
        year: new Date().getFullYear(),
        revenueItems: [],
        expenses: [],
    },
  });

  const { fields: revenueFields, append: appendRevenue, remove: removeRevenue } = useFieldArray({
      control: form.control,
      name: "revenueItems",
  });
  
  const { fields: expenseFields, append: appendExpense, remove: removeExpense } = useFieldArray({
      control: form.control,
      name: "expenses",
  });

  const revenueItems = form.watch('revenueItems');
  const expenses = form.watch('expenses');

  const totalRevenue = revenueItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const netIncome = totalRevenue - totalExpenses;

  useEffect(() => {
    if (record) {
        form.reset({
            month: record.month,
            year: record.year,
            revenueItems: record.revenueItems.map(r => ({...r, id: r.id || `rev-${Math.random()}`})),
            expenses: record.expenses.map(e => ({...e, id: e.id || `exp-${Math.random()}`}))
        });
    } else {
        form.reset({
            month: '',
            year: new Date().getFullYear(),
            revenueItems: [],
            expenses: [],
        });
    }
  }, [record, form, isOpen]);


  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    const originalRecord = record ? { month: record.month, year: record.year } : undefined;
    onSave(values as FinancialRecordFormData, originalRecord);
  };

  const handleDeleteClick = () => {
    if (record) {
        onDelete(record.month, record.year);
    }
  }

  const isEditMode = !!record;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Financial Record' : 'Add New Record'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Update the financial data for ${record.month} ${record.year}.` : 'Enter the financial data for a new month.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
             <div className="flex gap-4">
                 <FormField
                    control={form.control}
                    name="month"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Month</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className='w-48'>
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
                    name="year"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                           <Input type="number" className="w-32" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
             </div>

            <div className="grid grid-cols-2 gap-6">
                <div className='space-y-2'>
                    <div className="flex justify-between items-center">
                        <FormLabel>Revenue Items</FormLabel>
                        <Button type="button" size="sm" variant="outline" onClick={() => appendRevenue({ id: `rev-${Date.now()}`, description: '', amount: 0 })}>
                            <Plus className="mr-2" /> Add Item
                        </Button>
                    </div>
                    <ScrollArea className="h-48 p-4 border rounded-md">
                        {revenueFields.length > 0 ? (
                            <div className="space-y-3">
                            {revenueFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-start">
                                    <FormField
                                        control={form.control}
                                        name={`revenueItems.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="Revenue source" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`revenueItems.${index}.amount`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input type="number" className="w-28" placeholder="Amount" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeRevenue(index)}>
                                        <Trash2 className="text-destructive h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No revenue items added yet.</p>
                        )}
                    </ScrollArea>
                </div>

                 <div className='space-y-2'>
                    <div className="flex justify-between items-center">
                        <FormLabel>Expense Items</FormLabel>
                        <Button type="button" size="sm" variant="outline" onClick={() => appendExpense({ id: `exp-${Date.now()}`, description: '', amount: 0 })}>
                            <Plus className="mr-2" /> Add Item
                        </Button>
                    </div>
                    <ScrollArea className="h-48 p-4 border rounded-md">
                        {expenseFields.length > 0 ? (
                            <div className="space-y-3">
                            {expenseFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-start">
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
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeExpense(index)}>
                                        <Trash2 className="text-destructive h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No expenses added yet.</p>
                        )}
                    </ScrollArea>
                </div>
            </div>
           
             <DialogFooter className="grid grid-cols-2 gap-4 items-center pt-4 border-t mt-4">
                <div className="text-left">
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
                                    This action cannot be undone. This will permanently delete the financial record for {record?.month} {record?.year}.
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
                <div className="flex flex-col items-end gap-2">
                     <div className='flex items-baseline gap-2'>
                        <span className='text-muted-foreground text-sm'>Net Income:</span>
                         <span className={cn(
                            "text-lg font-bold",
                            netIncome >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                            ${netIncome.toLocaleString()}
                        </span>
                    </div>
                    <div className='flex gap-2'>
                        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                        <Button type="submit">{isEditMode ? 'Save Changes' : 'Add Record'}</Button>
                    </div>
                </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
