import { useMemo } from 'react';
import { KPI, KPIValue } from '../types';

interface UseKPICalculationsProps {
  kpis: KPI[];
  kpiValues: KPIValue[];
  dateRange: {
    start: Date;
    end: Date;
  };
  selectedSchool: string;
}

export const useKPICalculations = ({
  kpis,
  kpiValues,
  dateRange,
  selectedSchool
}: UseKPICalculationsProps) => {
  const getAggregatedKPIValue = (kpiId: string) => {
    const values = kpiValues.filter(v => {
      const valueDate = new Date(v.date);
      return v.kpi_id === kpiId && 
             valueDate >= dateRange.start && 
             valueDate <= dateRange.end;
    });

    if (!values.length) return null;

    const kpi = kpis.find(k => k.id === kpiId);
    if (!kpi) return null;

    if (kpi.unit === '%') {
      return values.reduce((sum, v) => sum + v.value, 0) / values.length;
    }

    if (['#', '$'].includes(kpi.unit)) {
      return values.reduce((sum, v) => sum + v.value, 0);
    }

    return values[values.length - 1].value;
  };

  const getKPITrend = (kpiId: string) => {
    const values = kpiValues
      .filter(v => v.kpi_id === kpiId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (values.length < 2) return 0;

    const kpi = kpis.find(k => k.id === kpiId);
    if (!kpi) return 0;

    if (kpi.unit === '%') {
      const currentValue = getAggregatedKPIValue(kpiId) || 0;
      const previousValue = values[values.length - 2].value;
      return currentValue - previousValue;
    }

    if (['#', '$'].includes(kpi.unit)) {
      const currentValue = getAggregatedKPIValue(kpiId) || 0;
      const previousValue = values[values.length - 2].value;
      return currentValue - previousValue;
    }

    return values[values.length - 1].value - values[values.length - 2].value;
  };

  const formatKPIValue = (value: number, unit: string) => {
    if (unit === '%') return `${Math.round(value)}%`;
    if (unit === '$') return `$${value.toFixed(2)}`;
    return value.toLocaleString();
  };

  return {
    getAggregatedKPIValue,
    getKPITrend,
    formatKPIValue
  };
};