// Add display_order to KPI interface
export interface KPI {
  id: string;
  name: string;
  description?: string;
  unit: string;
  benchmark: number;
  goal: number;
  is_hidden?: boolean;
  display_order?: number;
  relationships?: {
    target_kpi_id: string;
    relationship_type: string;
    formula: string;
  }[];
}