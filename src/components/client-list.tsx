
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
import type { Client } from '@/types';
import { PlusCircle } from 'lucide-react';

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().optional(),
  vat_number: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export function ClientList({ initialClients }: { initialClients: Client[] }) {
    const [clients, setClients] = useState(initialClients);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: '',
            email: '',
            address: '',
            vat_number: '',
        }
    });

    const { register, handleSubmit, formState: { errors }, reset } = form;

    const onSubmit = async (values: ClientFormValues) => {
        const { data, error } = await supabase.from('clients').insert([values]).select();
        
        if (error) {
            toast({
                title: "Error creating client",
                description: error.message,
                variant: 'destructive',
            });
        } else if (data) {
            toast({
                title: "Client created",
                description: "The new client has been added successfully.",
            });
            setClients(prev => [...prev, ...data]);
            setDialogOpen(false);
            reset();
            router.refresh(); 
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Clients</h1>
                    <p className="text-muted-foreground">Manage your clients here.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2" />
                            Add Client
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Client</DialogTitle>
                            <DialogDescription>
                                Enter the details of the new client.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" {...register('name')} />
                                    {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" {...register('email')} />
                                     {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" {...register('address')} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="vat_number">VAT Number</Label>
                                    <Input id="vat_number" {...register('vat_number')} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Save Client</Button>
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
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>VAT Number</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.length > 0 ? (
                                clients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell className="font-medium">{client.name}</TableCell>
                                        <TableCell>{client.email}</TableCell>
                                        <TableCell>{client.address}</TableCell>
                                        <TableCell>{client.vat_number}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No clients found. Add one to get started.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
