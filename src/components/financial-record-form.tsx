
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FinancialRecord } from '@/types';
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
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

const formSchema = z.object({
  month: z.string().min(1, 'Month is required.'),
  revenue: z.coerce.number().min(0, 'Revenue must be a positive number.'),
  expenses: z.coerce.number().min(0, 'Expenses must be a positive number.'),
  details: z.string().min(1, 'Details are required.'),
});

type FinancialRecordFormData = Omit<FinancialRecord, 'netIncome' | 'invoicePath'>;

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
        expenses: 0,
        details: '',
    },
  });

  useEffect(() => {
    if (record) {
        form.reset(record);
    } else {
        form.reset({
            month: '',
            revenue: 0,
            expenses: 0,
            details: '',
        });
    }
  }, [record, form, isOpen]);


  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };

  const handleDeleteClick = () => {
    if (record) {
        onDelete(record.month);
    }
  }

  const isEditMode = !!record;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Financial Record' : 'Add New Record'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Update the financial data for ${record.month}.` : 'Enter the financial data for a new month.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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
            <div className="grid grid-cols-2 gap-4">
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
                <FormField
                control={form.control}
                name="expenses"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Expenses ($)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 20000" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                        <Textarea placeholder="e.g., Initial server costs and software licenses." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
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
