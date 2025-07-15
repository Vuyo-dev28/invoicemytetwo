
"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
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

export function InvoiceForm({ clients, items }: { clients: Client[], items: Item[] }) {
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
  const [template, setTemplate] = useState('modern');

  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  
  const [paymentTerms, setPaymentTerms] = useState("net30");


  useEffect(() => {
    setInvoiceNumber(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
    if(clients.length > 0) {
      setSelectedClient(clients[0]);
    }
    setLineItems([
      { id: `item-${Date.now()}`, description: '', quantity: 1, rate: 0 },
    ])
  }, [clients]);

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
      description: "Your invoice has been saved as a draft.",
    });
  };

  const handleSend = () => {
    toast({
      title: "Invoice Sent",
      description: "Your invoice has been sent to the client.",
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


  const CompanyDetails = () => (
    <div className="company-details">
      {profile?.logo_url && <Image src={profile.logo_url} alt="Company Logo" width={100} height={100} className="mb-2" data-ai-hint="logo" />}
      <h2 className="text-xl font-semibold">{profile?.company_name || 'Your Company'}</h2>
      <p className="text-muted-foreground">{profile?.company_address || 'Your Address'}</p>
    </div>
  );

  return (
    <Card className={cn("template-base", `template-${template}`)}>
      <div className={cn("template-main-content", { 'pr-0': template !== 'creative' })}>
        <CardHeader className="template-header">
           {template !== 'creative' && (
             <>
                <div>
                    <CardTitle className="text-3xl font-bold template-title">Invoice</CardTitle>
                    <CardDescription>Invoice Number: {invoiceNumber}</CardDescription>
                </div>
                <CompanyDetails />
             </>
           )}
           {template === 'creative' && (
             <div>
                <CardTitle className="text-3xl font-bold template-title">Invoice</CardTitle>
                <CardDescription>Invoice Number: {invoiceNumber}</CardDescription>
             </div>
           )}
        </CardHeader>
        <CardContent className="p-6 md:p-8">
            <div className="no-print mb-8">
                <Label htmlFor="template">Invoice Template</Label>
                <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger id="template" className="mt-2 w-[200px]">
                    <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
                </Select>
            </div>

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
                    <p>{selectedClient.address}</p>
                    <p>{selectedClient.email}</p>
                    <p>VAT: {selectedClient.vat_number}</p>
                </div>
                )}
                
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                    <p className="print-only mt-2 text-sm">{issueDate ? format(issueDate, "PPP") : 'N/A'}</p>
                </div>
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
                    <p className="print-only mt-2 text-sm">{dueDate ? format(dueDate, "PPP") : 'N/A'}</p>
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
                    <p className="print-only mt-2 text-sm">{paymentTerms.replace('net', 'Net ')}</p>
                </div>
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
                    <p className="print-only mt-2 text-sm">{currency}</p>
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
                {lineItems.map((item, index) => (
                    <TableRow key={item.id}>
                    <TableCell>
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
                        <div className="flex justify-between items-center">
                            <span>Subtotal</span>
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <Label htmlFor="discount" className="no-print">Discount (%)</Label>
                            <span className="print-only">Discount ({discount}%)</span>
                            <Input id="discount" type="number" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} className="w-24 no-print" />
                        </div>
                        <div className="flex justify-between items-center">
                            <Label htmlFor="tax" className="no-print">Tax (%)</Label>
                            <span className="print-only">Tax ({tax}%)</span>
                            <Input id="tax" type="number" value={tax} onChange={(e) => setTax(parseFloat(e.target.value) || 0)} className="w-24 no-print" />
                        </div>
                        <div className="flex justify-between items-center border-t pt-4">
                            <span className="text-lg font-bold">Total</span>
                            <span className="text-lg font-bold">{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>
            </div>

        </CardContent>
        <CardFooter className="p-6 bg-muted/50 border-t flex justify-end gap-2 no-print">
            <Button variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
            <Button onClick={handlePrint} variant="secondary"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
            <Button onClick={handleSend}><Send className="mr-2 h-4 w-4" /> Send Invoice</Button>
        </CardFooter>
      </div>
      
      {template === 'creative' && (
        <div className="template-sidebar">
           <CompanyDetails />
        </div>
      )}
    </Card>
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
