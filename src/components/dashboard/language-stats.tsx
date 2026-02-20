"use client";

import type { LanguageStat } from '@/lib/types';
import { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from '@/components/ui/chart';

type LanguageStatsProps = {
  stats: LanguageStat[];
};

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function LanguageStats({ stats }: LanguageStatsProps) {
  const chartData = useMemo(() => {
    return stats.slice(0, 5).map(stat => ({ name: stat.language, value: stat.count }));
  }, [stats]);
  
  const chartConfig = useMemo(() => {
    if (!chartData) return {};
    return Object.fromEntries(
        chartData.map(item => [
            item.name,
            { label: item.name },
        ])
    )
  }, [chartData]);


  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <PieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel indicator="dot" />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              paddingAngle={2}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
}
