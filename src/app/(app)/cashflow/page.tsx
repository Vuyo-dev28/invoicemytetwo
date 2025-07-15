
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, RefreshCw } from 'lucide-react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

const chartData = [
  { month: 'Aug', income: 1800, expense: 1200, net: 600 },
  { month: 'Sep', income: 2200, expense: 1500, net: 700 },
  { month: 'Oct', income: 3000, expense: 1800, net: 1200 },
  { month: 'Nov', income: 2500, expense: 2000, net: 500 },
  { month: 'Dec', income: 4500, expense: 2500, net: 2000 },
  { month: 'Jan', income: 3200, expense: 1700, net: 1500 },
  { month: 'Feb', income: 3500, expense: 2100, net: 1400 },
  { month: 'Mar', income: 4000, expense: 2300, net: 1700 },
  { month: 'Apr', income: 3800, expense: 2600, net: 1200 },
  { month: 'May', income: 4200, expense: 2800, net: 1400 },
  { month: 'Jun', income: 5000, expense: 3000, net: 2000 },
  { month: 'Jul', income: 4800, expense: 3200, net: 1600 },
];

export default function CashflowPage() {
  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold">Cashflow</h1>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BarChart className="h-6 w-6" />
              <CardTitle>Income & expense</CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-muted-foreground whitespace-nowrap">Aug 1, 2024 - Jul 31</p>
              <Select defaultValue="12m">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">Past 3 months</SelectItem>
                  <SelectItem value="6m">Past 6 months</SelectItem>
                  <SelectItem value="12m">Past 12 months</SelectItem>
                </SelectContent>
              </Select>
               <Select defaultValue="monthly">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Invoice data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Income
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[0].value}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Expense
                              </span>
                              <span className="font-bold text-muted-foreground">
                                 {payload[1].value}
                              </span>
                            </div>
                             <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Net
                              </span>
                              <span className="font-bold text-foreground">
                                 {payload[2].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Income" />
                <Line type="monotone" dataKey="expense" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Expense"/>
                <Line type="monotone" dataKey="net" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Net cashflow"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
           <div className="flex items-center justify-between">
            <CardTitle>Expenses</CardTitle>
             <Select defaultValue="this-month">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This month</SelectItem>
                  <SelectItem value="last-month">Last month</SelectItem>
                </SelectContent>
              </Select>
           </div>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center h-48 text-center">
                 <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <BarChart className="h-8 w-8 text-muted-foreground"/>
                 </div>
                <p className="text-muted-foreground">No expenses recorded for this period yet.</p>
                <Button variant="link" asChild>
                    <a href="/expenses">Add an expense</a>
                </Button>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
