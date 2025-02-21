import React from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/common/Card';
import { 
  Users, 
  Clock, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Utensils, 
  Star, 
  Trash2, 
  Calculator, 
  PieChart, 
  Coffee, 
  UserCheck, 
  ShoppingCart, 
  CheckSquare 
} from 'lucide-react';

interface KPICard {
  kpi_name: string;
  kpi_summary: string;
  calculation_formula: string;
  kpi_data_type: string;
  contributing_factors_success: string[];
  contributing_factors_failure: string[];
  expected_benchmark_value: string;
  required_data_points: string[];
  icon: React.ElementType;
}

const kpiCards: KPICard[] = [
  {
    kpi_name: "Participation Rate",
    kpi_summary: "Measures the percentage of enrolled students participating in school meal programs. A higher participation rate indicates strong program engagement and financial stability.",
    calculation_formula: "(Total Meals Served / (Total Enrolled Students × Operating Days)) × 100",
    kpi_data_type: "Percentage",
    contributing_factors_success: [
      "Appealing and diverse menu options",
      "Efficient service lines and adequate serving time",
      "Effective marketing and communication",
      "Positive cafeteria environment",
      "High-quality food presentation"
    ],
    contributing_factors_failure: [
      "Limited menu variety",
      "Long wait times",
      "Poor food quality or presentation",
      "Inadequate serving time",
      "Negative perception of school meals"
    ],
    expected_benchmark_value: "Breakfast: 35-50%, Lunch: 75-85%",
    required_data_points: [
      "Total meals served",
      "Total enrolled students",
      "Number of operating days",
      "Meal type (breakfast/lunch)"
    ],
    icon: Users
  },
  {
    kpi_name: "Meals Per Labor Hour (MPLH)",
    kpi_summary: "Measures operational efficiency by calculating the number of meal equivalents produced per labor hour worked.",
    calculation_formula: "Total Meal Equivalents / Total Labor Hours",
    kpi_data_type: "Ratio",
    contributing_factors_success: [
      "Efficient kitchen layout",
      "Well-trained staff",
      "Proper equipment utilization",
      "Effective scheduling",
      "Streamlined processes"
    ],
    contributing_factors_failure: [
      "Poor kitchen workflow",
      "Inadequate training",
      "Equipment issues",
      "Inefficient scheduling",
      "Process bottlenecks"
    ],
    expected_benchmark_value: "Conventional: 14-18 MPLH, Convenience: 16-20 MPLH",
    required_data_points: [
      "Total meal equivalents",
      "Total labor hours",
      "Production system type"
    ],
    icon: Clock
  },
  {
    kpi_name: "Food Cost Per Meal",
    kpi_summary: "Tracks the average cost of food ingredients used per meal served, crucial for budget management and menu planning.",
    calculation_formula: "Total Food Cost / Total Meal Equivalents",
    kpi_data_type: "Currency",
    contributing_factors_success: [
      "Effective procurement practices",
      "Menu optimization",
      "Proper inventory management",
      "Accurate forecasting",
      "Waste reduction"
    ],
    contributing_factors_failure: [
      "Poor purchasing practices",
      "High food waste",
      "Inefficient inventory management",
      "Inaccurate forecasting",
      "Menu inefficiencies"
    ],
    expected_benchmark_value: "$1.50-$2.00 per meal",
    required_data_points: [
      "Total food costs",
      "Total meal equivalents",
      "Inventory levels",
      "Food waste data"
    ],
    icon: DollarSign
  },
  {
    kpi_name: "Labor Cost Per Meal",
    kpi_summary: "Measures the average labor cost associated with producing each meal, including wages and benefits.",
    calculation_formula: "Total Labor Cost / Total Meal Equivalents",
    kpi_data_type: "Currency",
    contributing_factors_success: [
      "Efficient staffing levels",
      "Effective scheduling",
      "Cross-trained employees",
      "Automated processes",
      "High productivity"
    ],
    contributing_factors_failure: [
      "Overstaffing",
      "Inefficient scheduling",
      "High turnover",
      "Limited cross-training",
      "Low productivity"
    ],
    expected_benchmark_value: "$1.75-$2.25 per meal",
    required_data_points: [
      "Total labor costs",
      "Employee hours",
      "Benefit costs",
      "Total meal equivalents"
    ],
    icon: Calculator
  },
  {
    kpi_name: "Revenue Per Meal",
    kpi_summary: "Calculates the average revenue generated per meal, including reimbursements and paid meals.",
    calculation_formula: "Total Revenue / Total Meals Served",
    kpi_data_type: "Currency",
    contributing_factors_success: [
      "Optimal pricing strategy",
      "High participation rates",
      "Effective à la carte sales",
      "Maximized reimbursements",
      "Additional revenue streams"
    ],
    contributing_factors_failure: [
      "Suboptimal pricing",
      "Low participation",
      "Poor à la carte performance",
      "Missed reimbursements",
      "Limited revenue sources"
    ],
    expected_benchmark_value: "$3.50-$4.00 per meal",
    required_data_points: [
      "Total revenue",
      "Meal counts by category",
      "À la carte sales",
      "Reimbursement data"
    ],
    icon: TrendingUp
  },
  {
    kpi_name: "Reimbursable Meal Compliance Rate",
    kpi_summary: "Measures the percentage of meals that meet USDA requirements for reimbursement.",
    calculation_formula: "(Compliant Meals / Total Meals Served) × 100",
    kpi_data_type: "Percentage",
    contributing_factors_success: [
      "Strong menu planning",
      "Staff training",
      "Clear procedures",
      "Regular audits",
      "Updated documentation"
    ],
    contributing_factors_failure: [
      "Poor menu planning",
      "Inadequate training",
      "Unclear procedures",
      "Infrequent audits",
      "Missing documentation"
    ],
    expected_benchmark_value: "98-100%",
    required_data_points: [
      "Total meals served",
      "Compliant meals count",
      "Audit results",
      "Menu documentation"
    ],
    icon: CheckSquare
  },
  {
    kpi_name: "Student Satisfaction Score",
    kpi_summary: "Tracks student satisfaction with meal program through surveys and feedback.",
    calculation_formula: "(Total Satisfaction Points / Total Possible Points) × 100",
    kpi_data_type: "Percentage",
    contributing_factors_success: [
      "Quality food",
      "Menu variety",
      "Pleasant environment",
      "Good service",
      "Student engagement"
    ],
    contributing_factors_failure: [
      "Poor food quality",
      "Limited choices",
      "Negative environment",
      "Poor service",
      "Lack of engagement"
    ],
    expected_benchmark_value: "85-90%",
    required_data_points: [
      "Survey responses",
      "Satisfaction ratings",
      "Comments/feedback",
      "Participation trends"
    ],
    icon: Star
  },
  {
    kpi_name: "Food Waste Percentage",
    kpi_summary: "Measures the percentage of prepared food that goes to waste, indicating production efficiency.",
    calculation_formula: "(Weight of Food Waste / Total Food Prepared) × 100",
    kpi_data_type: "Percentage",
    contributing_factors_success: [
      "Accurate forecasting",
      "Proper portion control",
      "Efficient production",
      "Student acceptance",
      "Quality control"
    ],
    contributing_factors_failure: [
      "Poor forecasting",
      "Inconsistent portions",
      "Overproduction",
      "Low acceptance",
      "Quality issues"
    ],
    expected_benchmark_value: "≤ 5%",
    required_data_points: [
      "Food waste weight",
      "Production amounts",
      "Serving records",
      "Student counts"
    ],
    icon: Trash2
  },
  {
    kpi_name: "Average Cost Per Meal",
    kpi_summary: "Combines all costs associated with meal production to determine total cost per meal served.",
    calculation_formula: "(Total Food Cost + Total Labor Cost + Direct Costs) / Total Meals Served",
    kpi_data_type: "Currency",
    contributing_factors_success: [
      "Cost control measures",
      "Efficient operations",
      "Bulk purchasing",
      "Waste reduction",
      "Process optimization"
    ],
    contributing_factors_failure: [
      "Poor cost control",
      "Inefficient operations",
      "Small orders",
      "High waste",
      "Process inefficiencies"
    ],
    expected_benchmark_value: "$3.25-$3.75 per meal",
    required_data_points: [
      "Food costs",
      "Labor costs",
      "Direct costs",
      "Meal counts"
    ],
    icon: PieChart
  },
  {
    kpi_name: "Breakfast-to-Lunch Ratio",
    kpi_summary: "Compares breakfast participation to lunch participation to identify program balance.",
    calculation_formula: "(Total Breakfast Meals / Total Lunch Meals) × 100",
    kpi_data_type: "Ratio",
    contributing_factors_success: [
      "Breakfast promotion",
      "Alternative service models",
      "Schedule accommodation",
      "Menu appeal",
      "Easy access"
    ],
    contributing_factors_failure: [
      "Limited promotion",
      "Traditional service only",
      "Schedule conflicts",
      "Unappealing options",
      "Access barriers"
    ],
    expected_benchmark_value: "50-60%",
    required_data_points: [
      "Breakfast meal counts",
      "Lunch meal counts",
      "Service models",
      "Timing data"
    ],
    icon: Coffee
  },
  {
    kpi_name: "Free & Reduced Meal Utilization Rate",
    kpi_summary: "Measures participation rate among students eligible for free and reduced-price meals.",
    calculation_formula: "(F&R Meals Served / Total F&R Eligible Students) × 100",
    kpi_data_type: "Percentage",
    contributing_factors_success: [
      "Effective outreach",
      "Reduced stigma",
      "Easy application process",
      "Direct certification",
      "Family engagement"
    ],
    contributing_factors_failure: [
      "Poor outreach",
      "Stigma issues",
      "Complex application",
      "Missing certifications",
      "Low engagement"
    ],
    expected_benchmark_value: "85-95%",
    required_data_points: [
      "F&R eligible students",
      "F&R meals served",
      "Application data",
      "Direct certification data"
    ],
    icon: UserCheck
  },
  {
    kpi_name: "A La Carte Sales Percentage",
    kpi_summary: "Tracks the percentage of total revenue from à la carte sales.",
    calculation_formula: "(À La Carte Revenue / Total Revenue) × 100",
    kpi_data_type: "Percentage",
    contributing_factors_success: [
      "Popular items",
      "Competitive pricing",
      "Efficient service",
      "Strategic marketing",
      "Quality products"
    ],
    contributing_factors_failure: [
      "Unpopular items",
      "Poor pricing",
      "Slow service",
      "Limited marketing",
      "Quality issues"
    ],
    expected_benchmark_value: "15-25%",
    required_data_points: [
      "À la carte sales",
      "Total revenue",
      "Item sales data",
      "Pricing data"
    ],
    icon: ShoppingCart
  },
  {
    kpi_name: "Menu Compliance Score",
    kpi_summary: "Evaluates menu compliance with USDA meal pattern requirements and nutritional standards.",
    calculation_formula: "(Compliant Menu Components / Total Required Components) × 100",
    kpi_data_type: "Percentage",
    contributing_factors_success: [
      "Menu planning expertise",
      "Recipe standardization",
      "Regular reviews",
      "Staff training",
      "Documentation"
    ],
    contributing_factors_failure: [
      "Poor planning",
      "Unstandardized recipes",
      "Infrequent reviews",
      "Limited training",
      "Missing documentation"
    ],
    expected_benchmark_value: "95-100%",
    required_data_points: [
      "Menu components",
      "Nutritional analysis",
      "Recipe data",
      "Production records"
    ],
    icon: Utensils
  }
];

const Performance = () => {
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Performance Metrics
        </h1>
      </div>

      <div className="grid gap-6">
        {kpiCards.map((card) => (
          <Card key={card.kpi_name}>
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <card.icon className={`w-6 h-6 ${
                      darkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                  </div>
                  <div>
                    <h2 className={`text-lg font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {card.kpi_name}
                    </h2>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {card.kpi_data_type}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  {card.expected_benchmark_value}
                </div>
              </div>

              {/* Description */}
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {card.kpi_summary}
              </p>

              {/* Formula */}
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <h3 className={`text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Calculation Formula
                </h3>
                <p className={`text-sm font-mono ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {card.calculation_formula}
                </p>
              </div>

              {/* Contributing Factors */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className={`text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Success Factors
                  </h3>
                  <ul className={`text-sm space-y-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {card.contributing_factors_success.map((factor, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className={`text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Risk Factors
                  </h3>
                  <ul className={`text-sm space-y-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {card.contributing_factors_failure.map((factor, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Required Data */}
              <div>
                <h3 className={`text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Required Data Points
                </h3>
                <div className="flex flex-wrap gap-2">
                  {card.required_data_points.map((point, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-md text-xs ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Performance;