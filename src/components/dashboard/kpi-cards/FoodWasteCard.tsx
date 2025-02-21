import React from 'react';
import { BaseKPICard } from './BaseKPICard';
import { KPI } from '../../../types';

interface FoodWasteCardProps {
  kpi: KPI;
  value: number;
  trend: number;
  schoolBenchmark?: number;
  expectedBenchmark: number;
}

export const FoodWasteCard: React.FC<FoodWasteCardProps> = (props) => {
  const formatValue = (val: number) => `${Math.round(val)}%`;

  return (
    <BaseKPICard
      {...props}
      formatValue={formatValue}
      isLowerBetter={true}
    />
  );
};