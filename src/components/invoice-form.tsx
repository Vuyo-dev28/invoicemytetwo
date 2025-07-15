
"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Calendar as CalendarIcon, PlusCircle, Trash2, Download, Send, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast"
import Image from 'next/image';
import { Client, Item } from '@/types';
import { cn } from '@/lib/utils';

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

type Profile = {
  company_name: string;
  company_address: string;
  logo_url: string;
}

type Template = "swiss" | "formal" | "playful" | "tech" | "elegant";
type DocumentType = "Invoice" | "Estimate" | "Credit note" | "Delivery note" | "Purchase order";

export function InvoiceForm({ clients, items, documentType }: { clients: Client[], items: Item[], documentType: DocumentType }) {
  const { toast } = useToast()
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>();
  
  const [profile, setProfile] = useState<Profile | null>({
    company_name: 'Your Company',
    company_address: '123 Main St, Anytown, USA',
    logo_url: 'https://placehold.co/100x100.png'
  });

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const [currency, setCurrency] = useState('USD');
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  
  const [paymentTerms, setPaymentTerms] = useState("net30");
  const [template, setTemplate] = useState<Template>("swiss");

  const documentTypePrefixes = {
    "Invoice": "INV",
    "Estimate": "EST",
    "Credit note": "CN",
    "Delivery note": "DN",
    "Purchase order": "PO",
  }

  useEffect(() => {
    setInvoiceNumber(`${documentTypePrefixes[documentType]}-${Math.floor(1000 + Math.random() * 9000)}`);
    if(clients.length > 0) {
      setSelectedClient(clients[0]);
    }
    setLineItems([
      { id: `item-${Date.now()}`, description: '', quantity: 1, rate: 0 },
    ])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentType, clients]);


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

  const handleItemSelect = (id: string, item: Item) => {
    setLineItems(lineItems.map(lineItem =>
      lineItem.id === id ? { ...lineItem, description: item.description, rate: item.rate } : lineItem
    ));
  };
  
  const handlePrint = () => {
    window.print();
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: `Your ${documentType.toLowerCase()} has been saved as a draft.`,
    });
  };

  const handleSend = () => {
    toast({
      title: `${documentType} Sent`,
      description: `Your ${documentType.toLowerCase()} has been sent to the client.`,
      variant: 'default',
    });
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id.toString() === clientId.toString()) || null;
    setSelectedClient(client);
  };

  const isFinancialDocument = ["Invoice", "Credit note"].includes(documentType);

  return (
    <div className="space-y-4">
      <Card className="no-print">
        <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                 <h1 className="text-2xl font-bold">{documentType}</h1>
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
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>
      
      <div className={cn('invoice-container', `template-${template}`)}>
        <header className="template-header">
          {template === 'formal' ? (
              <div className="company-details">
                  {profile?.logo_url && <Image src={profile.logo_url} alt="Company Logo" width={100} height={100} className="mb-4 mx-auto" data-ai-hint="logo" />}
                  <h2>{profile?.company_name || 'Your Company'}</h2>
                  <p>{profile?.company_address || 'Your Address'}</p>
              </div>
          ) : template === 'elegant' ? (
            <div className="w-full flex flex-col items-center">
              <div className="company-details flex flex-col items-center">
                {profile?.logo_url && <Image src={profile.logo_url} alt="Company Logo" width={100} height={100} className="mb-4" data-ai-hint="logo" />}
              </div>
              <div>
                <h1 className="invoice-title">{documentType.toUpperCase()}</h1>
              </div>
             <div className="company-details">
                 <h2>{profile?.company_name || 'Your Company'}</h2>
                 <p>{profile?.company_address || 'Your Address'}</p>
             </div>
            </div>
          ) : (
            <>
              <div>
                  <h1 className="invoice-title">{documentType.toUpperCase()}</h1>
                  <p className="text-muted-foreground"># {invoiceNumber}</p>
              </div>
              <div className="company-details">
                {profile?.logo_url && <Image src={profile.logo_url} alt="Company Logo" width={100} height={100} className="mb-4" data-ai-hint="logo" />}
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
        
        {template === 'formal' && (
            <div className="invoice-title-section">
                <h2 className="invoice-title">{documentType.toUpperCase()}</h2>
                <p className="text-sm text-muted-foreground"># {invoiceNumber}</p>
            </div>
        )}
        
        <main className="main-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
                <Label className="font-semibold text-base">Bill To:</Label>
                <div className="no-print">
                    <Select onValueChange={handleClientChange} defaultValue={selectedClient?.id}>
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
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground print-only">{selectedClient.name}</p>
                    <p className="font-bold text-foreground">{selectedClient.name}</p>
                    <p>{selectedClient.address}</p>
                    <p>{selectedClient.email}</p>
                    <p>VAT: {selectedClient.vat_number}</p>
                </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
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
                {isFinancialDocument && (
                  <>
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
                    <div>
                        <Label htmlFor="payment-terms" className="font-semibold">Payment Terms</Label>
                        <div className="no-print">
                            <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                            <SelectTrigger id="payment-terms" className="mt-2">
                                <SelectValue placeholder="Select terms" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="net15">Net 15</SelectItem>
                                <SelectItem value="net30">Net 30</SelectItem>
                                <SelectItem value="net60">Net 60</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                        <p className="print-only mt-2">{paymentTerms.replace('net', 'Net ')}</p>
                    </div>
                  </>
                )}
                <div>
                    <Label htmlFor="currency" className="font-semibold">Currency</Label>
                    <div className="no-print">
                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger id="currency" className="mt-2">
                            <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="JPY">JPY</SelectItem>
                            <SelectItem value="AUD">AUD</SelectItem>
                            <SelectItem value="CAD">CAD</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <p className="print-only mt-2">{currency}</p>
                </div>
            </div>
            </div>
            
            <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-2/5">Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Rate</TableHead>
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
                    <TableCell>
                        <Input className="no-print w-20" type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)} />
                        <p className="print-only">{item.quantity}</p>
                    </TableCell>
                    <TableCell>
                        <Input className="no-print w-24" type="number" value={item.rate} onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)} />
                        <p className="print-only">{formatCurrency(item.rate)}</p>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(item.quantity * item.rate)}</TableCell>
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
                    <Label className="font-semibold">Notes</Label>
                    <Textarea placeholder="Any additional notes..." className="mt-2 no-print" />
                </div>
                <div className="flex justify-end">
                    <div className="w-full max-w-sm space-y-4 totals-section">
                        <div className={cn("flex justify-between items-center", template === 'elegant' && 'elegant-total-row', template === 'formal' && 'elegant-total-row')}>
                            <span>Subtotal</span>
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className={cn("flex justify-between items-center", template === 'elegant' && 'elegant-total-row', template === 'formal' && 'elegant-total-row')}>
                            <Label htmlFor="discount" className="no-print">Discount (%)</Label>
                            <span className="print-only">Discount ({discount}%)</span>
                            <Input id="discount" type="number" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} className="w-24 no-print" />
                        </div>
                        <div className={cn("flex justify-between items-center", template === 'elegant' && 'elegant-total-row', template === 'formal' && 'elegant-total-row')}>
                            <Label htmlFor="tax" className="no-print">Tax (%)</Label>
                            <span className="print-only">Tax ({tax}%)</span>
                            <Input id="tax" type="number" value={tax} onChange={(e) => setTax(parseFloat(e.target.value) || 0)} className="w-24 no-print" />
                        </div>
                         <div className={cn("flex justify-between items-center border-t pt-4 text-lg", template === 'elegant' ? 'elegant-total' : 'font-bold' )}>
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>
            </div>

        </main>
        <CardFooter className="p-6 bg-muted/50 border-t flex justify-end gap-2 no-print">
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
  const [open, setOpen] = React.useState(false)

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
