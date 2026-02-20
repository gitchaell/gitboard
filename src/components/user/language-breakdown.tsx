"use client";

import type { User } from '@/lib/types';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useMemo } from 'react';

type LanguageBreakdownProps = {
  languages: User['languages'];
};

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function LanguageBreakdown({ languages }: LanguageBreakdownProps) {
  const chartData = useMemo(() => {
    return Object.entries(languages)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [languages]);

  return (
    <div className="w-full h-[300px] flex flex-col items-center">
      <ResponsiveContainer width="100%" height="100%">
        <ChartContainer config={{}} className="h-full w-full">
            <PieChart>
            <Tooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                labelLine={false}
                label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
                }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                if (percent < 0.05) return null;

                return (
                    <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    className="text-xs font-bold fill-primary-foreground"
                    >
                    {`${(percent * 100).toFixed(0)}%`}
                    </text>
                );
                }}
            >
                {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            </PieChart>
        </ChartContainer>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
        {chartData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2 text-sm">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
