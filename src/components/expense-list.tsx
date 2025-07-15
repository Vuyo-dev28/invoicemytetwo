
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Expense } from '@/types';
import { PlusCircle } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.coerce.number().min(0, 'Amount must be a positive number'),
  date: z.date({ required_error: "A date is required." }),
  category: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export function ExpenseList({ initialExpenses }: { initialExpenses: Expense[] }) {
    const [expenses, setExpenses] = useState(initialExpenses);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            description: '',
            amount: 0,
            date: new Date(),
            category: ''
        }
    });

    const { register, handleSubmit, formState: { errors }, reset, control } = form;

    const onSubmit = async (values: ExpenseFormValues) => {
        const { data, error } = await supabase.from('expenses').insert([{
            ...values,
            date: values.date.toISOString(),
        }]).select();
        
        if (error) {
            toast({
                title: "Error creating expense",
                description: error.message,
                variant: 'destructive',
            });
        } else if (data) {
            toast({
                title: "Expense created",
                description: "The new expense has been added successfully.",
            });
            setExpenses(prev => [...prev, ...data]);
            setDialogOpen(false);
            reset();
            router.refresh(); 
        }
    };
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Expenses</h1>
                    <p className="text-muted-foreground">Track and manage your business expenses.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2" />
                            Add Expense
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Expense</DialogTitle>
                            <DialogDescription>
                                Enter the details of the new expense.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" {...register('description')} />
                                    {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
                                </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="amount">Amount</Label>
                                        <Input id="amount" type="number" step="0.01" {...register('amount')} />
                                        {errors.amount && <p className="text-destructive text-sm">{errors.amount.message}</p>}
                                    </div>
                                     <div className="grid gap-2">
                                        <Label htmlFor="date">Date</Label>
                                         <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="font-normal justify-start">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {form.watch('date') ? format(form.watch('date'), "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={form.watch('date')}
                                                    onSelect={(date) => form.setValue('date', date as Date)}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                         {errors.date && <p className="text-destructive text-sm">{errors.date.message}</p>}
                                    </div>
                                 </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Category (Optional)</Label>
                                    <Input id="category" {...register('category')} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Save Expense</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.length > 0 ? (
                                expenses.map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell>{format(new Date(expense.date), "PPP")}</TableCell>
                                        <TableCell className="font-medium">{expense.description}</TableCell>
                                        <TableCell>{expense.category}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No expenses found. Add one to get started.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}

