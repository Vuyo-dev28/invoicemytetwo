"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Calendar as CalendarIcon, PlusCircle, Trash2, Download, Send } from 'lucide-react';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from '@/hooks/use-local-storage';
import Image from 'next/image';

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

export function InvoiceForm() {
  const { toast } = useToast()
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>();
  
  const [companyName] = useLocalStorage('companyName', 'Your Company Inc.');
  const [companyAddress] = useLocalStorage('companyAddress', '123 Business Rd, Suite 100, Business City, 12345');
  const [companyLogo] = useLocalStorage('companyLogo', '');

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: `item-${Date.now()}`, description: 'Web Design Services', quantity: 10, rate: 100 },
    { id: `item-${Date.now()+1}`, description: 'SEO Optimization', quantity: 5, rate: 75 },
  ]);

  const [currency, setCurrency] = useState('USD');
  const [tax, setTax] = useState(8);
  const [discount, setDiscount] = useState(5);

  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Avoid hydration error for random number
    setInvoiceNumber(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  }, []);

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

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="p-6 bg-muted/50 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl font-bold">Invoice</CardTitle>
            <CardDescription>Invoice Number: {invoiceNumber}</CardDescription>
          </div>
          <div className="text-right">
            {companyLogo && <Image src={companyLogo as string} alt="Company Logo" width={100} height={100} className="mb-2 ml-auto" />}
            <h2 className="text-xl font-semibold">{companyName}</h2>
            <p className="text-muted-foreground">{companyAddress}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <Label className="font-semibold text-base">Bill To:</Label>
            <Input placeholder="Client Name" className="mt-2" defaultValue="Client Corp" />
            <Input placeholder="Client Address" className="mt-2" defaultValue="456 Client Ave, Client Town, 54321" />
            <Input placeholder="Client Email" className="mt-2" type="email" defaultValue="contact@clientcorp.com" />
            <Input placeholder="VAT/Tax Number" className="mt-2" defaultValue="VAT12345678" />
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issue-date" className="font-semibold">Issue Date</Label>
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
              <div>
                <Label htmlFor="due-date" className="font-semibold">Due Date</Label>
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
              <div>
                <Label htmlFor="payment-terms" className="font-semibold">Payment Terms</Label>
                <Select defaultValue="net30">
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
                    <Input value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} placeholder="Item description" />
                  </TableCell>
                  <TableCell>
                    <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)} className="w-20" />
                  </TableCell>
                  <TableCell>
                    <Input type="number" value={item.rate} onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)} className="w-24" />
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
                <Textarea placeholder="Any additional notes..." className="mt-2" />
            </div>
            <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-4">
                    <div className="flex justify-between items-center">
                        <span>Subtotal</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <Label htmlFor="discount">Discount (%)</Label>
                        <Input id="discount" type="number" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} className="w-24" />
                    </div>
                    <div className="flex justify-between items-center">
                        <Label htmlFor="tax">Tax (%)</Label>
                        <Input id="tax" type="number" value={tax} onChange={(e) => setTax(parseFloat(e.target.value) || 0)} className="w-24" />
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
    </Card>
  );
}
