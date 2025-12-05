"use client";

import { useState, useEffect } from 'react';
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
import { deleteDocumentAction } from "@/app/(app)/documents/actions";
import { ConfirmationModal } from './ui/confirmation-modal';
import { formatCurrency as formatCurrencyUtil } from '@/lib/currency-utils';

const statusColors: Record<InvoiceStatus, string> = {
  draft: 'bg-yellow-500 hover:bg-yellow-600',
  sent: 'bg-blue-500 hover:bg-blue-600',
  paid: 'bg-green-500 hover:bg-green-600',
  overdue: 'bg-red-500 hover:bg-red-600'
};

type DocumentType = "Invoice" | "Estimate" | "Credit note" | "Delivery note" | "Purchase order";

const documentTypeToPath: Record<DocumentType, string> = {
  "Invoice": "invoices",
  "Estimate": "estimates",
  "Credit note": "credit_notes",
  "Delivery note": "delivery_notes",
  "Purchase order": "purchase_orders"
};

const getPlural = (docType: DocumentType) => {
  if (docType === "Delivery note") return "Delivery Notes";
  if (docType === "Credit note") return "Credit Notes";
  if (docType === "Purchase order") return "Purchase Orders";
  return `${docType}s`;
};

export function DocumentList({ initialDocuments, documentType }: { initialDocuments: ExpandedInvoice[], documentType: DocumentType }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [userCurrency, setUserCurrency] = useState<string>('USD');
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();
  const basePath = documentTypeToPath[documentType];

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('currency')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileData?.currency) {
        setUserCurrency(profileData.currency);
      }
    };
    getProfile();
  }, [supabase]);

  const handleStatusChange = async (docId: string, status: InvoiceStatus) => {
    const { data, error } = await supabase
      .from(basePath)
      .update({ status })
      .eq('id', docId)
      .select()
      .single();

    if (error) {
      toast({ title: "Error updating status", description: error.message, variant: 'destructive' });
    } else if (data) {
      toast({ title: "Status updated", description: `${documentType} marked as ${status}.` });
      setDocuments(prev => prev.map(doc => doc.id === docId ? { ...doc, status: data.status } : doc));
      router.refresh();
    }
  };

  const handleDelete = async (docId: string) => {
    const result = await deleteDocumentAction(basePath, docId);

    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: `${documentType} deleted successfully.` });
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
    }
  };

  const formatCurrency = (amount: number) => formatCurrencyUtil(amount, userCurrency);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{getPlural(documentType)}</h1>
          <p className="text-muted-foreground">Manage all your {getPlural(documentType).toLowerCase()} here.</p>
        </div>
        <Button asChild>
          <Link href={`/${basePath}/new`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New {documentType}
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{documentType} #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.invoice_number}</TableCell>
                    <TableCell>{doc.client_name}</TableCell>
                    <TableCell>{format(new Date(doc.issue_date), "PPP")}</TableCell>
                    <TableCell>{doc.due_date ? format(new Date(doc.due_date), "PPP") : 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[doc.status]} text-white`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(doc.total)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild disabled={doc.status !== 'draft'}>
                            <Link href={`/${basePath}/${doc.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(doc.id, 'paid')}>Mark as paid</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(doc.id, 'sent')}>Mark as sent</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(doc.id, 'draft')}>Mark as draft</DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <ConfirmationModal
                              title={`Delete ${documentType}`}
                              description={`Are you sure you want to delete this ${documentType}? This action cannot be undone.`}
                              confirmText="Delete"
                              onConfirm={() => handleDelete(doc.id)}
                            />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <p className="text-lg font-medium">No {getPlural(documentType).toLowerCase()} found.</p>
                    <p className="text-muted-foreground">Create one to get started.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
