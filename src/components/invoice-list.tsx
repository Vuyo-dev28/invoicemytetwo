
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ExpandedInvoice, InvoiceStatus } from '@/types';
import { PlusCircle, MoreHorizontal, Edit } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { createClient } from '@/utils/supabase/client';

const statusColors: Record<InvoiceStatus, string> = {
  draft: 'bg-yellow-500 hover:bg-yellow-600',
  sent: 'bg-blue-500 hover:bg-blue-600',
  paid: 'bg-green-500 hover:bg-green-600',
  overdue: 'bg-red-500 hover:bg-red-600'
};

export function InvoiceList({ initialInvoices }: { initialInvoices: ExpandedInvoice[] }) {
    const [invoices, setInvoices] = useState(initialInvoices);
    const { toast } = useToast();
    const router = useRouter();
    const supabase = createClient();

    const handleStatusChange = async (invoiceId: string, status: InvoiceStatus) => {
        const { data, error } = await supabase
            .from('invoices')
            .update({ status })
            .eq('id', invoiceId)
            .select()
            .single();

        if (error) {
            toast({
                title: "Error updating status",
                description: error.message,
                variant: 'destructive',
            });
        } else if (data) {
            toast({
                title: "Status updated",
                description: `Invoice marked as ${status}.`,
            });
            setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: data.status } : inv));
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
                    <h1 className="text-2xl font-bold">Invoices</h1>
                    <p className="text-muted-foreground">Manage all your invoices here.</p>
                </div>
                <Button asChild>
                    <Link href="/invoices/new">
                        <PlusCircle className="mr-2" />
                        New Invoice
                    </Link>
                </Button>
            </div>
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Issue Date</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.length > 0 ? (
                                invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                                        <TableCell>{invoice.client_name}</TableCell>
                                        <TableCell>{format(new Date(invoice.issue_date), "PPP")}</TableCell>
                                        <TableCell>{invoice.due_date ? format(new Date(invoice.due_date), "PPP") : 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge className={`${statusColors[invoice.status]} text-white`}>
                                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{formatCurrency(invoice.total)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem asChild disabled={invoice.status !== 'draft'}>
                                                        <Link href={`/invoices/${invoice.id}/edit`}>
                                                          <Edit className="mr-2 h-4 w-4" />
                                                          Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'paid')}>
                                                        Mark as paid
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'sent')}>
                                                        Mark as sent
                                                    </DropdownMenuItem>
                                                      <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, 'draft')}>
                                                        Mark as draft
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">No invoices found. Create one to get started.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
