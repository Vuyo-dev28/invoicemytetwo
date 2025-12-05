'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '@/lib/currency-utils';

type GrowthMetric = {
  label: string;
  current: number;
  previous: number;
  isCurrency?: boolean;
  icon?: React.ReactNode;
};

export function GrowthMetrics({ metrics, currency }: { metrics: GrowthMetric[]; currency: string }) {
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const growth = calculateGrowth(metric.current, metric.previous);
        const isPositive = growth >= 0;
        
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.isCurrency 
                  ? formatCurrency(metric.current, currency)
                  : metric.current.toLocaleString()
                }
              </div>
              <div className="flex items-center gap-1 text-xs mt-1">
                {isPositive ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                )}
                <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(growth).toFixed(1)}%
                </span>
                <span className="text-muted-foreground">vs previous period</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

