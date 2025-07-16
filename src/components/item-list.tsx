
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
import type { Item } from '@/types';
import { PlusCircle } from 'lucide-react';
import { Textarea } from './ui/textarea';

const itemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  rate: z.coerce.number().min(0, 'Rate must be a positive number'),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export function ItemList({ initialItems }: { initialItems: Item[] }) {
    const [items, setItems] = useState(initialItems);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<ItemFormValues>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            description: '',
            rate: 0,
        }
    });

    const { register, handleSubmit, formState: { errors }, reset } = form;

    const onSubmit = async (values: ItemFormValues) => {
        // Items are public, no user_id needed
        const { data, error } = await supabase.from('items').insert([values]).select();
        
        if (error) {
            toast({
                title: "Error creating item",
                description: error.message,
                variant: 'destructive',
            });
        } else if (data) {
            toast({
                title: "Item created",
                description: "The new item has been added successfully.",
            });
            setItems(prev => [...prev, ...data]);
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
                    <h1 className="text-2xl font-bold">Items</h1>
                    <p className="text-muted-foreground">Manage your products and services here.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2" />
                            Add Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Item</DialogTitle>
                            <DialogDescription>
                                Enter the details of the new item or service.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" {...register('description')} />
                                    {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="rate">Rate</Label>
                                    <Input id="rate" type="number" step="0.01" {...register('rate')} />
                                     {errors.rate && <p className="text-destructive text-sm">{errors.rate.message}</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Save Item</Button>
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
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Rate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.description}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center">No items found. Add one to get started.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
