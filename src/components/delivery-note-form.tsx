
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
import type SignatureCanvas from 'react-signature-canvas';
import dynamic from 'next/dynamic';
import { createClient } from '@/utils/supabase/client';
import { checkDocumentLimit } from '@/utils/subscription-limits';
import { useRouter } from 'next/navigation';

const DynamicSignatureCanvas = dynamic(() => import('react-signature-canvas'), {
  ssr: false,
  loading: () => <p>Loading signature pad...</p>,
});

type LineItem = {
  id: string;
  description: string;
  quantity: number;
};

type Template = "swiss" | "formal" | "playful" | "tech" | "elegant" | "modern" | "minimalist" | "creative" | "corporate" | "friendly" | "bold" | "vintage" | "geometric" | "industrial" | "luxury";
type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

interface DeliveryNoteFormProps {
  clients: Client[];
  items: Item[];
  initialDocument?: ExpandedInvoice | null;
}

export function DeliveryNoteForm({ clients, items, initialDocument = null }: DeliveryNoteFormProps) {
  const { toast } = useToast()
  const router = useRouter();
  const supabase = createClient();
  
  const [docId, setDocId] = useState<string | null>(initialDocument?.id || null);
  const [docNumber, setDocNumber] = useState('');
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState('');
  const [poNumber, setPoNumber] = useState('');
  
  const [profile, setProfile] = useState<Profile | null>(null);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  
  const [template, setTemplate] = useState<Template>("swiss");
  const [senderSignature, setSenderSignature] = useState<string | null>(null);
  const [receiverSignature, setReceiverSignature] = useState<string | null>(null);
  const [isSenderSigDialogOpen, setSenderSigDialogOpen] = useState(false);
  const [isReceiverSigDialogOpen, setReceiverSigDialogOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const senderSigRef = useRef<SignatureCanvas>(null);
  const receiverSigRef = useRef<SignatureCanvas>(null);

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
        } else if (error && error.code !== 'PGRST116') {
             console.error("Error fetching profile:", error.message || error);
        }
    }
    getProfile();
  }, [supabase]);


  useEffect(() => {
    if (initialDocument) {
      setDocId(initialDocument.id);
      setDocNumber(initialDocument.invoice_number);
      setIssueDate(initialDocument.issue_date ? parseISO(initialDocument.issue_date) : undefined);
      setNotes(initialDocument.notes || '');
      setDeliveryAddress(initialDocument.delivery_address || '');
      
      const client = clients.find(c => c.id === initialDocument.client_id) || null;
      setSelectedClient(client);

      if (initialDocument.invoice_items && initialDocument.invoice_items.length > 0) {
        setLineItems(initialDocument.invoice_items.map(item => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
        })));
      } else {
         setLineItems([{ id: `item-${Date.now()}`, description: '', quantity: 1 }]);
      }

    } else {
      setDocNumber(`DN-${Math.floor(1000 + Math.random() * 9000)}`);
      if(clients.length > 0) {
        const defaultClient = clients[0];
        setSelectedClient(defaultClient);
        setDeliveryAddress(defaultClient.address || '');
      }
      setLineItems([
        { id: `item-${Date.now()}`, description: '', quantity: 1 },
      ])
    }
  }, [initialDocument, clients]);

  const handleAddItem = () => {
    setLineItems([...lineItems, { id: `item-${Date.now()}`, description: '', quantity: 1 }]);
  };

  const handleRemoveItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof Omit<LineItem, 'id'>, value: string | number) => {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleItemSelect = (id: string, item: Item) => {
    setLineItems(lineItems.map(lineItem =>
      lineItem.id === id ? { ...lineItem, description: item.description } : lineItem
    ));
  };
  
  const handlePrint = async () => {
    if (isPrinting) return; // Prevent multiple clicks
    
    setIsPrinting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsPrinting(false);
        toast({
          title: "Not authenticated",
          description: "You need to be logged in to download a PDF.",
          variant: "destructive",
        });
        return;
      }

      const limitResult = await checkDocumentLimit(user.id, 'Delivery note');
      if (!limitResult.ok) {
        setIsPrinting(false);
        toast({
          title: "Limit reached",
          description: limitResult.message,
          variant: "destructive",
        });
        return;
      }

      // Use requestAnimationFrame to allow UI to update before printing
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.print();
          setIsPrinting(false);
        }, 100);
      });
    } catch (error) {
      setIsPrinting(false);
      toast({
        title: "Error",
        description: "Failed to prepare print preview. Please try again.",
        variant: "destructive",
      });
    }
  };

  const saveDocument = async (status: InvoiceStatus) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        toast({ title: "Not authenticated", description: "You need to be logged in to save a document.", variant: "destructive" });
        return;
    }
    if (!selectedClient) {
        toast({ title: "Client not selected", description: "Please select a client.", variant: "destructive" });
        return;
    }

    // Enforce free-plan limits when creating new delivery notes.
    if (!docId) {
      const limitResult = await checkDocumentLimit(user.id, 'Delivery note');
      if (!limitResult.ok) {
        toast({
          title: "Limit reached",
          description: limitResult.message,
          variant: "destructive",
        });
        return;
      }
    }

    const docPayload = {
        user_id: user.id,
        client_id: selectedClient.id,
        invoice_number: docNumber,
        issue_date: issueDate?.toISOString().split('T')[0],
        status,
        notes,
        delivery_address: deliveryAddress,
        document_type: 'Delivery note',
        total: 0, // Not a financial document
        amount: 0,
        tax_percent: 0,
        discount_percent: 0,
    };
    
    let savedDocId = docId;

    if (docId) {
        const { error } = await supabase
            .from('invoices')
            .update(docPayload)
            .eq('id', docId);

        if (error) {
            toast({ title: "Error updating document", description: error.message, variant: "destructive" });
            return;
        }

        const { error: deleteError } = await supabase.from('invoice_items').delete().eq('invoice_id', docId);
        if (deleteError) {
             toast({ title: "Error updating items", description: deleteError.message, variant: "destructive" });
            return;
        }

    } else {
        const { data, error } = await supabase
            .from('invoices')
            .insert(docPayload)
            .select()
            .single();

        if (error || !data) {
            toast({ title: "Error saving document", description: error?.message, variant: "destructive" });
            return;
        }
        savedDocId = data.id;
        setDocId(data.id);
    }

    if (!savedDocId) return;

    const itemsToInsert = lineItems.map(item => ({
        invoice_id: savedDocId,
        description: item.description,
        quantity: item.quantity,
        rate: 0, // Not a financial document
        user_id: user.id
    }));

    const { error: itemsError } = await supabase.from('invoice_items').insert(itemsToInsert);

    if (itemsError) {
        toast({ title: "Error saving items", description: itemsError.message, variant: "destructive" });
        return;
    }

    toast({
      title: `Delivery Note ${initialDocument ? 'Updated' : 'Saved'}`,
      description: `Your delivery note has been saved as a ${status}.`,
    });
    router.push('/delivery_notes');
    router.refresh();
  }

  const handleSaveDraft = () => saveDocument('draft');
  const handleSend = () => saveDocument('sent');

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id.toString() === clientId.toString()) || null;
    setSelectedClient(client);
    if (client) {
      setDeliveryAddress(client.address || ''); // Default delivery address to client's address, but it's editable
    }
  };
  
  const handleSaveSignature = (type: 'sender' | 'receiver') => {
    const ref = type === 'sender' ? senderSigRef : receiverSigRef;
    if (ref.current) {
      if(ref.current.isEmpty()){
        toast({ title: "Signature is empty", description: "Please provide a signature.", variant: "destructive" });
        return;
      }
      const setSignature = type === 'sender' ? setSenderSignature : setReceiverSignature;
      setSignature(ref.current.toDataURL('image/png'));
      if(type === 'sender') setSenderSigDialogOpen(false);
      else setReceiverSigDialogOpen(false);
    }
  };

  const handleClearSignature = (type: 'sender' | 'receiver') => {
    const ref = type === 'sender' ? senderSigRef : receiverSigRef;
    ref.current?.clear();
  };


  return (
    <div className="space-y-4 px-3 sm:px-4">
      <Card className="no-print">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                 <h1 className="text-2xl font-bold">{initialDocument ? `Edit Delivery Note` : `New Delivery Note`}</h1>
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
        </CardContent>
      </Card>
      
      <div className={cn('invoice-container', `template-${template}`)}>
        <header className="template-header">
            <div>
                <h1 className="invoice-title">DELIVERY NOTE</h1>
                <p className="text-muted-foreground"># {docNumber}</p>
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
        </header>
        
        <main className="main-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                    <Label className="font-semibold text-base">From:</Label>
                     <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <p className="font-bold text-foreground">{profile?.company_name || 'Your Company'}</p>
                        <p>{profile?.company_address || '123 Main St, Anytown USA'}</p>
                    </div>
                </div>
                <div>
                     <Label className="font-semibold text-base">Deliver To:</Label>
                    <div className="no-print mt-2">
                         <Select onValueChange={handleClientChange} value={selectedClient?.id}>
                            <SelectTrigger>
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
                        <Textarea
                            placeholder="Delivery Address"
                            className="mt-2"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                        />
                    </div>
                    <div className="print-only mt-4 space-y-2 text-sm text-muted-foreground">
                       {selectedClient && <p className="font-bold text-foreground">{selectedClient.name}</p>}
                       <p className="whitespace-pre-wrap">{deliveryAddress}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-8">
                <div>
                    <Label htmlFor="issue-date" className="font-semibold">Date of Issue</Label>
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
            </div>
            
            <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-4/5">Description</TableHead>
                    <TableHead className="text-right">Quantity Delivered</TableHead>
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
                    <TableCell className="text-right">
                        <Input className="no-print w-24 ml-auto" type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)} />
                        <p className="print-only">{item.quantity}</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                    <Label className="font-semibold">Delivery Notes / Instructions</Label>
                    <Textarea placeholder="e.g. Handle with care, leave at front porch..." className="mt-2 no-print h-28" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    <div className="print-only mt-2 p-3 text-sm text-muted-foreground whitespace-pre-wrap break-words leading-relaxed">{notes}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <Label className="font-semibold">Sender Signature</Label>
                        <div className="mt-2 border rounded-md p-2 h-28 flex items-center justify-start print:border-none">
                            {senderSignature ? (
                                <div className="flex flex-col items-start">
                                    <Image src={senderSignature} alt="Sender Signature" width={100} height={100} className="object-contain" data-ai-hint="signature" />
                                </div>
                            ) : (
                                <Dialog open={isSenderSigDialogOpen} onOpenChange={setSenderSigDialogOpen}>
                                    <DialogTrigger asChild><Button variant="outline" className="no-print">Add Signature</Button></DialogTrigger>
                                    <SignatureDialogContent
                                        ref={senderSigRef}
                                        onSave={() => handleSaveSignature('sender')}
                                        onClear={() => handleClearSignature('sender')}
                                    />
                                </Dialog>
                            )}
                        </div>
                    </div>
                     <div>
                        <Label className="font-semibold">Receiver Signature</Label>
                        <div className="mt-2 border rounded-md p-2 h-28 flex items-center justify-start print:border-none">
                            {receiverSignature ? (
                                <div className="flex flex-col items-start">
                                    <Image src={receiverSignature} alt="Receiver Signature" width={100} height={100} className="object-contain" data-ai-hint="signature" />
                                </div>
                            ) : (
                                <Dialog open={isReceiverSigDialogOpen} onOpenChange={setReceiverSigDialogOpen}>
                                    <DialogTrigger asChild><Button variant="outline" className="no-print">Add Signature</Button></DialogTrigger>
                                     <SignatureDialogContent
                                        ref={receiverSigRef}
                                        onSave={() => handleSaveSignature('receiver')}
                                        onClear={() => handleClearSignature('receiver')}
                                    />
                                </Dialog>
                            )}
                        </div>
                        <p className="text-center text-xs text-muted-foreground mt-1">Date & Time of Receipt: {format(new Date(), "PPP, p")}</p>
                    </div>
                </div>
            </div>

        </main>
        <CardFooter className="p-4 bg-muted/50 border-t flex justify-end gap-2 no-print">
            <Button variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
            <Button onClick={handlePrint} variant="secondary" disabled={isPrinting}>
              <Download className="mr-2 h-4 w-4" /> 
              {isPrinting ? 'Preparing...' : 'Download PDF'}
            </Button>
            <Button onClick={handleSend}><Send className="mr-2 h-4 w-4" /> Send Delivery Note</Button>
        </CardFooter>
      </div>
    </div>
  );
}

const SignatureDialogContent = React.forwardRef<SignatureCanvas, { onSave: () => void, onClear: () => void }>(({ onSave, onClear }, ref) => (
    <DialogContent>
        <DialogHeader><DialogTitle>Add Signature</DialogTitle></DialogHeader>
        <div className="border rounded-md bg-muted/20 my-4">
            <DynamicSignatureCanvas ref={ref} penColor='black' canvasProps={{className: 'w-full h-48'}} />
        </div>
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClear}>Clear</Button>
            <Button onClick={onSave}>Save</Button>
        </div>
    </DialogContent>
));
SignatureDialogContent.displayName = 'SignatureDialogContent';

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
