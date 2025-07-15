
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, RefreshCw } from 'lucide-react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { CashflowData } from '@/types';

export function CashflowChart({ initialData }: { initialData: CashflowData[] }) {
  const [data, setData] = useState(initialData);
  // Add state for filters if you want client-side filtering
  // For now, we assume the data is passed pre-filtered by the server component

  return (
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BarChart className="h-6 w-6" />
              <CardTitle>Income</CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-muted-foreground whitespace-nowrap">Past 12 months</p>
              {/* Note: Selects are for display; server component handles data fetching logic */}
              <Select defaultValue="12m" disabled>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">Past 3 months</SelectItem>
                  <SelectItem value="6m">Past 6 months</SelectItem>
                  <SelectItem value="12m">Past 12 months</SelectItem>
                </SelectContent>
              </Select>
               <Select defaultValue="monthly" disabled>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" disabled>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-1 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Income
                              </span>
                              <span className="font-bold text-foreground">
                                {payload[0].value}
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
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
  );
}
