
"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Calendar as CalendarIcon, PlusCircle, Trash2, Download, Send, ChevronsUpDown, Pencil } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast"
import Image from 'next/image';
import { Client, Item, ExpandedInvoice, Profile } from '@/types';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type SignatureCanvas from 'react-signature-canvas';
import dynamic from 'next/dynamic';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { currencies } from '@/lib/currencies';
import { Switch } from './ui/switch';

const DynamicSignatureCanvas = dynamic(() => import('react-signature-canvas'), {
  ssr: false,
  loading: () => <p>Loading signature pad...</p>,
});

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

type Template = "swiss" | "formal" | "playful" | "tech" | "elegant" | "modern" | "minimalist" | "creative" | "corporate" | "friendly" | "bold" | "vintage" | "geometric" | "industrial" | "luxury";
type DocumentType = "Invoice" | "Estimate" | "Credit note" | "Purchase order";
type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
type FormType = 'basic' | 'advanced';

interface InvoiceFormProps {
  clients: Client[];
  items: Item[];
  documentType: DocumentType;
  initialInvoice?: ExpandedInvoice | null;
}

export function InvoiceForm({ clients, items, documentType, initialInvoice = null }: InvoiceFormProps) {
  const { toast } = useToast()
  const router = useRouter();
  const supabase = createClient();
  
  const [invoiceId, setInvoiceId] = useState<string | null>(initialInvoice?.id || null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [notes, setNotes] = useState('');
  const [originalInvoiceNumber, setOriginalInvoiceNumber] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  
  const [profile, setProfile] = useState<Profile | null>(null);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const [currency, setCurrency] = useState('USD');
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  
  const [paymentTerms, setPaymentTerms] = useState("net30");
  const [template, setTemplate] = useState<Template>("swiss");
  const [signature, setSignature] = useState<string | null>(null);
  const [isSignatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);

  const [formType, setFormType] = useState<FormType>('advanced');

  const documentTypePrefixes = {
    "Invoice": "INV",
    "Estimate": "EST",
    "Credit note": "CN",
    "Purchase order": "PO",
  }

  useEffect(() => {
    const getProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (profileData) {
            setProfile(profileData);
        } else if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
             console.error("Error fetching profile:", error.message || error);
        }
    }
    getProfile();
  }, [supabase]);


  useEffect(() => {
    if (initialInvoice) {
      // Pre-populate form if we're editing an existing invoice
      setInvoiceId(initialInvoice.id);
      setInvoiceNumber(initialInvoice.invoice_number);
      setIssueDate(initialInvoice.issue_date ? parseISO(initialInvoice.issue_date) : undefined);
      setDueDate(initialInvoice.due_date ? parseISO(initialInvoice.due_date) : undefined);

      if (initialInvoice.notes) {
        const notesLines = initialInvoice.notes.split('\n\n---\n\n');
        const mainNotes = notesLines.length > 1 ? notesLines[1] : '';
        const structuredPart = notesLines[0];
        let tempShippingAddress = '';

        const structuredLines = structuredPart.split('\n');

        structuredLines.forEach(line => {
          if (documentType === 'Credit note' && line.startsWith('Original Invoice: ')) {
            setOriginalInvoiceNumber(line.replace('Original Invoice: ', ''));
          } else if (line.startsWith('P.O. Number: ')) {
            setPoNumber(line.replace('P.O. Number: ', ''));
          }
        });
        
        const shipToIndex = structuredPart.indexOf('Ship To:\n');
        if (shipToIndex !== -1) {
            const afterShipTo = structuredPart.substring(shipToIndex + 'Ship To:\n'.length);
            const poIndex = afterShipTo.indexOf('P.O. Number:');
            if(poIndex !== -1) {
                tempShippingAddress = afterShipTo.substring(0, poIndex).trim();
            } else {
                tempShippingAddress = afterShipTo.trim();
            }
        }
        setShippingAddress(tempShippingAddress);
        setNotes(mainNotes);
      }

      setTax(initialInvoice.tax_percent || 0);
      setDiscount(initialInvoice.discount_percent || 0);
      setTotal(initialInvoice.total || 0);
      
      const client = clients.find(c => c.id === initialInvoice.client_id) || null;
      setSelectedClient(client);

      if (initialInvoice.invoice_items && initialInvoice.invoice_items.length > 0) {
        setLineItems(initialInvoice.invoice_items.map(item => ({
          id: item.id, // Use existing item ID
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
        })));
      } else {
         setLineItems([{ id: `item-${Date.now()}`, description: '', quantity: 1, rate: 0 }]);
      }

    } else {
      // New invoice logic
      setInvoiceNumber(`${documentTypePrefixes[documentType]}-${Math.floor(1000 + Math.random() * 9000)}`);
      if(clients.length > 0) {
        setSelectedClient(clients[0]);
      }
      setLineItems([
        { id: `item-${Date.now()}`, description: '', quantity: 1, rate: 0 },
      ])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialInvoice, documentType, clients]);


  useEffect(() => {
    const newSubtotal = lineItems.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
    setSubtotal(newSubtotal);

    const discountAmount = (newSubtotal * discount) / 100;
    const taxAmount = ((newSubtotal - discountAmount) * tax) / 100;
    const newTotal = newSubtotal - discountAmount + taxAmount;
    setTotal(newTotal);
  }, [lineItems, tax, discount]);

  const handleAddItem = () => {
    setLineItems([...lineItems, { id: `item-${Date.now()}`, description: '', quantity: 1, rate: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof Omit<LineItem, 'id'>, value: string | number) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleBasicAmountChange = (id: string, value: number) => {
    setLineItems(lineItems.map(item =>
        item.id === id ? { ...item, rate: value, quantity: 1 } : item
    ));
  }

  const handleItemSelect = (id: string, item: Item) => {
    setLineItems(lineItems.map(lineItem =>
      lineItem.id === id ? { ...lineItem, description: item.description, rate: item.rate } : lineItem
    ));
  };
  
  const handlePrint = () => {
    window.print();
  };

  const saveInvoice = async (status: InvoiceStatus) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        toast({ title: "Not authenticated", description: "You need to be logged in to save a document.", variant: "destructive" });
        return;
    }
    if (!selectedClient) {
        toast({ title: "Client not selected", description: "Please select a client.", variant: "destructive" });
        return;
    }

    let structuredNotes: string[] = [];
    if (documentType === 'Credit note' && originalInvoiceNumber) {
        structuredNotes.push(`Original Invoice: ${originalInvoiceNumber}`);
    }
    if (formType === 'advanced' && poNumber) {
        structuredNotes.push(`P.O. Number: ${poNumber}`);
    }
    if (formType === 'advanced' && shippingAddress) {
        structuredNotes.push(`Ship To:\n${shippingAddress}`);
    }
    
    // Join structured notes and add a separator before user's free-text notes
    let finalNotes = structuredNotes.join('\n');
    if (notes) {
        finalNotes += `${finalNotes ? '\n\n---\n\n' : ''}${notes}`;
    }

    const invoicePayload = {
        user_id: user.id,
        client_id: selectedClient.id,
        invoice_number: invoiceNumber,
        issue_date: issueDate?.toISOString().split('T')[0], // Format as YYYY-MM-DD
        due_date: (formType === 'advanced' && dueDate) ? dueDate?.toISOString().split('T')[0] : null, // Format as YYYY-MM-DD
        status,
        notes: finalNotes,
        tax_percent: tax,
        discount_percent: discount,
        total: total,
        document_type: documentType,
    };
    
    let savedInvoiceId = invoiceId;

    if (invoiceId) {
        // Update existing invoice
        const { data, error } = await supabase
            .from('invoices')
            .update(invoicePayload)
            .eq('id', invoiceId)
            .select()
            .single();

        if (error) {
            toast({ title: "Error updating document", description: error.message, variant: "destructive" });
            return;
        }

        // Delete existing items before inserting new ones to handle removals/updates
        const { error: deleteError } = await supabase.from('invoice_items').delete().eq('invoice_id', invoiceId);
        if (deleteError) {
             toast({ title: "Error updating items", description: deleteError.message, variant: "destructive" });
            return;
        }

    } else {
        // Insert new invoice
        const { data, error } = await supabase
            .from('invoices')
            .insert(invoicePayload)
            .select()
            .single();

        if (error || !data) {
            toast({ title: "Error saving document", description: error?.message, variant: "destructive" });
            return;
        }
        savedInvoiceId = data.id;
        setInvoiceId(data.id); // Set the new ID for future saves
    }

    if (!savedInvoiceId) return;

    const itemsToInsert = lineItems.map(item => ({
        invoice_id: savedInvoiceId,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        user_id: user.id
    }));

    const { error: itemsError } = await supabase.from('invoice_items').insert(itemsToInsert);

    if (itemsError) {
        toast({ title: "Error saving items", description: itemsError.message, variant: "destructive" });
        return;
    }

    toast({
      title: `${documentType} ${initialInvoice ? 'Updated' : 'Saved'}`,
      description: `Your ${documentType.toLowerCase()} has been saved as a ${status}.`,
    });
    router.push(`/${documentTypeToPath[documentType]}`);
    router.refresh();
  }
  
  const documentTypeToPath = {
    "Invoice": "invoices",
    "Estimate": "estimates",
    "Credit note": "credit-notes",
    "Purchase order": "purchase-orders",
    "Delivery note": "delivery-notes",
  };

  const handleSaveDraft = () => saveInvoice('draft');
  const handleSend = () => saveInvoice('sent');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id.toString() === clientId.toString()) || null;
    setSelectedClient(client);
    if (client) {
      setShippingAddress(client.address || ''); // Default shipping to billing on change
    }
  };
  
  const handleSaveSignature = () => {
    if (signatureRef.current) {
      if(signatureRef.current.isEmpty()){
        toast({ title: "Signature is empty", description: "Please draw a signature before saving.", variant: "destructive" });
        return;
      }
      setSignature(signatureRef.current.toDataURL('image/png'));
      setSignatureDialogOpen(false);
    }
  };

  const handleClearSignature = () => {
    signatureRef.current?.clear();
  };

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature(reader.result as string);
        setSignatureDialogOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="no-print">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                 <h1 className="text-2xl font-bold">{initialInvoice ? `Edit ${documentType}` : `New ${documentType}`}</h1>
            </div>
             <div className="flex items-center gap-4">
                 <div className="flex items-center space-x-2">
                    <Label htmlFor="form-type" className={formType === 'basic' ? 'text-foreground' : 'text-muted-foreground'}>Basic</Label>
                    <Switch id="form-type" checked={formType === 'advanced'} onCheckedChange={(checked) => setFormType(checked ? 'advanced' : 'basic')} />
                    <Label htmlFor="form-type" className={formType === 'advanced' ? 'text-foreground' : 'text-muted-foreground'}>Advanced</Label>
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="template">Template</Label>
                    <Select value={template} onValueChange={(value) => setTemplate(value as Template)}>
                        <SelectTrigger id="template" className="w-[180px]">
                        <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="swiss">Swiss</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="playful">Playful</SelectItem>
                          <SelectItem value="tech">Tech</SelectItem>
                          <SelectItem value="elegant">Elegant</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="minimalist">Minimalist</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                          <SelectItem value="corporate">Corporate</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                          <SelectItem value="vintage">Vintage</SelectItem>
                          <SelectItem value="geometric">Geometric</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardContent>
      </Card>
      
      <div className={cn('invoice-container', `template-${template}`)}>
        <header className="template-header">
          {template === 'formal' || template === 'elegant' ? (
            <div className="w-full flex flex-col items-center">
               <div className="company-details">
                 {profile?.logo_url && <Image src={profile.logo_url} alt="Company Logo" width={100} height={100} className="mb-4 mx-auto" data-ai-hint="logo" />}
                 <h2>{profile?.company_name || 'Your Company'}</h2>
                 <p>{profile?.company_address || 'Your Address'}</p>
               </div>
               <div className={cn("invoice-title-section", template === 'elegant' && 'mt-4')}>
                 <h1 className="invoice-title">{documentType.toUpperCase()}</h1>
                 {template === 'formal' && <p className="text-sm text-muted-foreground mt-2"># {invoiceNumber}</p>}
               </div>
            </div>
          ) : (
            <>
              <div>
                  <h1 className="invoice-title">{documentType.toUpperCase()}</h1>
                  <p className="text-muted-foreground"># {invoiceNumber}</p>
              </div>
              <div className="company-details">
                {profile?.logo_url && <Image src={profile.logo_url} alt="Company Logo" width={100} height={100} className="mb-4 ml-auto" data-ai-hint="logo" />}
                <h2 className={cn('text-xl font-semibold')}>
                  {profile?.company_name || 'Your Company'}
                </h2>
                <p className={cn('text-muted-foreground text-sm')}>
                  {profile?.company_address || 'Your Address'}
                </p>
              </div>
            </>
          )}
        </header>
        
        <main className="main-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                    <Label className="font-semibold text-base">Bill To:</Label>
                    <div className="no-print">
                        <Select onValueChange={handleClientChange} value={selectedClient?.id}>
                        <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                            {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                                {client.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                    {selectedClient && (
                    <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                        <p className="font-bold text-foreground">{selectedClient.name}</p>
                        <p>{selectedClient.address}</p>
                        <p>{selectedClient.email}</p>
                        {selectedClient.vat_number && <p>VAT: {selectedClient.vat_number}</p>}
                    </div>
                    )}
                </div>
                {formType === 'advanced' && (
                    <div>
                        <Label htmlFor="shipping-address" className="font-semibold text-base">Ship To:</Label>
                        <Textarea 
                            id="shipping-address"
                            placeholder="Enter shipping address..."
                            className="mt-2 no-print h-28"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                        />
                        <p className="print-only text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{shippingAddress || 'N/A'}</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-8">
                <div>
                    <Label htmlFor="issue-date" className="font-semibold">Issue Date</Label>
                    <div className="no-print">
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button id="issue-date" variant={"outline"} className="w-full justify-start text-left font-normal mt-2">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {issueDate ? format(issueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={issueDate} onSelect={setIssueDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                    </div>
                    <p className="print-only mt-2">{issueDate ? format(issueDate, "PPP") : 'N/A'}</p>
                </div>
                {formType === 'advanced' && (
                   <>
                    {documentType !== 'Estimate' && documentType !== 'Purchase order' && (
                      <div>
                          <Label htmlFor="due-date" className="font-semibold">Due Date</Label>
                          <div className="no-print">
                          <Popover>
                              <PopoverTrigger asChild>
                              <Button id="due-date" variant={"outline"} className="w-full justify-start text-left font-normal mt-2">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
                              </PopoverContent>
                          </Popover>
                          </div>
                          <p className="print-only mt-2">{dueDate ? format(dueDate, "PPP") : 'N/A'}</p>
                      </div>
                    )}
                     <div>
                        <Label htmlFor="po-number" className="font-semibold">P.O. Number</Label>
                        <Input 
                            id="po-number" 
                            className="mt-2 no-print" 
                            value={poNumber} 
                            onChange={(e) => setPoNumber(e.target.value)} 
                            placeholder="Optional"
                        />
                        <p className="print-only mt-2">{poNumber || 'N/A'}</p>
                    </div>
                  </>
                )}
                 {documentType === 'Credit note' && (
                    <div>
                        <Label htmlFor="original-invoice" className="font-semibold">Original Invoice #</Label>
                        <Input 
                            id="original-invoice" 
                            className="mt-2 no-print" 
                            value={originalInvoiceNumber} 
                            onChange={(e) => setOriginalInvoiceNumber(e.target.value)}
                            placeholder="e.g. INV-2023-001"
                        />
                         <p className="print-only mt-2">{originalInvoiceNumber || 'N/A'}</p>
                    </div>
                )}
                <div>
                    <Label htmlFor="currency" className="font-semibold">Currency</Label>
                    <div className="no-print mt-2">
                        <CurrencyCombobox value={currency} onValueChange={setCurrency} />
                    </div>
                    <p className="print-only mt-2">{currency}</p>
                </div>
            </div>
            
            <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className={formType === 'basic' ? 'w-4/5' : 'w-2/5'}>Description</TableHead>
                    {formType === 'advanced' && <TableHead>Quantity</TableHead>}
                    {formType === 'advanced' && <TableHead>Unit Price</TableHead>}
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-12 no-print"></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {lineItems.map((item) => (
                    <TableRow key={item.id}>
                    <TableCell className="font-medium">
                        <div className="no-print">
                        <ItemCombobox 
                            items={items}
                            lineItemId={item.id}
                            value={item.description}
                            onValueChange={(value) => handleItemChange(item.id, 'description', value)}
                            onItemSelect={handleItemSelect}
                        />
                        </div>
                        <p className="print-only">{item.description}</p>
                    </TableCell>
                    {formType === 'advanced' && (
                        <>
                        <TableCell>
                            <Input className="no-print w-20" type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)} />
                            <p className="print-only">{item.quantity}</p>
                        </TableCell>
                        <TableCell>
                            <Input className="no-print w-24" type="number" value={item.rate} onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)} />
                            <p className="print-only">{formatCurrency(item.rate)}</p>
                        </TableCell>
                        </>
                    )}
                    <TableCell className="text-right font-medium">
                       {formType === 'basic' ? (
                            <Input 
                                className="no-print w-24 ml-auto text-right" 
                                type="number" 
                                value={item.rate} 
                                onChange={(e) => handleBasicAmountChange(item.id, parseFloat(e.target.value) || 0)} 
                            />
                       ) : null}
                        <p className={formType === 'basic' ? 'print-only' : ''}>{formatCurrency(item.quantity * item.rate)}</p>
                    </TableCell>
                    <TableCell className="no-print">
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} disabled={lineItems.length === 1}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>

            <Button onClick={handleAddItem} variant="outline" className="mt-4 no-print">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <Label className="font-semibold">Terms & Conditions</Label>
                        <Textarea placeholder="Optional" className="mt-2 no-print h-28" value={notes} onChange={(e) => setNotes(e.target.value)} />
                        <p className="print-only text-sm text-muted-foreground mt-2">{notes}</p>
                    </div>
                    <div className="w-1/2">
                        <Label className="font-semibold">Signature</Label>
                        <div className="mt-2 border rounded-md p-2 h-28 flex items-center justify-center print:border-none">
                            {signature ? (
                                <div className="text-center">
                                    <Image src={signature} alt="Signature" width={100} height={100} className="object-contain" data-ai-hint="signature" />
                                    <Button variant="link" size="sm" onClick={() => setSignature(null)} className="text-destructive no-print -mt-2">Remove</Button>
                                </div>
                            ) : (
                                <Dialog open={isSignatureDialogOpen} onOpenChange={setSignatureDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="no-print">
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Add Signature
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add Your Signature</DialogTitle>
                                        </DialogHeader>
                                        <Tabs defaultValue="draw">
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="draw">Draw</TabsTrigger>
                                                <TabsTrigger value="upload">Upload</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="draw">
                                                <div className="border rounded-md bg-muted/20 my-4">
                                                     <DynamicSignatureCanvas
                                                        ref={signatureRef}
                                                        penColor='black'
                                                        canvasProps={{className: 'w-full h-48'}}
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" onClick={handleClearSignature}>Clear</Button>
                                                    <Button onClick={handleSaveSignature}>Save</Button>
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="upload">
                                                <div className="flex flex-col items-center justify-center p-8 space-y-4">
                                                    <Label htmlFor="signature-upload" className="cursor-pointer">
                                                        <Button asChild variant="outline">
                                                           <span>Upload Image</span>
                                                        </Button>
                                                    </Label>
                                                    <Input id="signature-upload" type="file" accept="image/*" className="hidden" onChange={handleSignatureUpload}/>
                                                    <p className="text-xs text-muted-foreground">Upload a PNG or JPG file.</p>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <div className="w-full max-w-sm space-y-2 totals-section">
                        <div className={cn("flex justify-between items-center elegant-total-row", template === 'formal' && 'elegant-total-row')}>
                            <span>Subtotal</span>
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className={cn("flex justify-between items-center elegant-total-row", template === 'formal' && 'elegant-total-row')}>
                            <Label htmlFor="discount" className="no-print">Discount (%)</Label>
                            <span className="print-only">Discount ({discount}%)</span>
                            <Input id="discount" type="number" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} className="w-24 no-print" />
                        </div>
                        <div className={cn("flex justify-between items-center elegant-total-row", template === 'formal' && 'elegant-total-row')}>
                            <Label htmlFor="tax" className="no-print">Tax (%)</Label>
                            <span className="print-only">Tax ({tax}%)</span>
                            <Input id="tax" type="number" value={tax} onChange={(e) => setTax(parseFloat(e.target.value) || 0)} className="w-24 no-print" />
                        </div>
                         <div className={cn("flex justify-between items-center border-t pt-2 text-lg elegant-total", template !== 'elegant' && 'font-bold' )}>
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>
            </div>

        </main>
        <CardFooter className="p-4 bg-muted/50 border-t flex justify-end gap-2 no-print">
            <Button variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
            <Button onClick={handlePrint} variant="secondary"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
            <Button onClick={handleSend}><Send className="mr-2 h-4 w-4" /> Send {documentType}</Button>
        </CardFooter>
      </div>
    </div>
  );
}

function ItemCombobox({ 
    items, 
    lineItemId,
    value, 
    onValueChange,
    onItemSelect,
  }: { 
    items: Item[], 
    lineItemId: string,
    value: string, 
    onValueChange: (value: string) => void,
    onItemSelect: (lineItemId: string, item: Item) => void
  }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {value || "Select item or add new..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={true}>
          <CommandInput 
            placeholder="Search item or add new..." 
            value={value}
            onValueChange={onValueChange}
          />
          <CommandList>
            <CommandEmpty>
                <div className="py-2 text-sm text-center">
                    No item found. You can add it as a new item.
                </div>
            </CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.description}
                  onSelect={(currentValue) => {
                    const selectedItem = items.find(i => i.description.toLowerCase() === currentValue.toLowerCase());
                    if (selectedItem) {
                      onItemSelect(lineItemId, selectedItem);
                    }
                    setOpen(false)
                  }}
                >
                  {item.description}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function CurrencyCombobox({
    value,
    onValueChange,
}: {
    value: string;
    onValueChange: (value: string) => void;
}) {
    const [open, setOpen] = React.useState(false);
    const selectedCurrency = currencies.find(c => c.code === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                >
                    <span className="truncate">
                        {value ? `${selectedCurrency?.name} (${value})` : "Select currency..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Search currency..." />
                    <CommandList>
                        <CommandEmpty>No currency found.</CommandEmpty>
                        <CommandGroup>
                            {currencies.map((currency) => (
                                <CommandItem
                                    key={currency.code}
                                    value={`${currency.code} ${currency.name}`}
                                    onSelect={() => {
                                        onValueChange(currency.code);
                                        setOpen(false);
                                    }}
                                >
                                    {currency.name} ({currency.code})
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
