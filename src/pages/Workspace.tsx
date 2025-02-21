import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Clock, Star, Bell, Bot, TrendingUp, AlertCircle, Calendar, CheckSquare } from 'lucide-react';
import { getTimeBasedGreeting } from '../components/TimeOfDayIcon';
import { useDashboardData } from '../hooks/useDashboardData';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const Workspace = () => {
  const { user } = useStore();
  const darkMode = useStore((state) => state.darkMode);
  const navigate = useNavigate();
  const selectedTimeframe = useStore((state) => state.selectedTimeframe);

  const {
    kpis,
    kpiValues,
    loading,
    error,
    dateRange,
    isNonServingPeriod,
    nonServingReason,
    getAggregatedKPIValue,
    getKPITrend
  } = useDashboardData('district');

  // Generate daily summary based on KPI data
  const getDailySummary = () => {
    if (loading) return "I'm analyzing your data...";
    if (error) return "I'm having trouble accessing your data at the moment.";
    if (!kpis?.length) return "Welcome! I'm ready to help you analyze your program data.";

    const mealsServedKPI = kpis.find(k => k.name === 'Meals Served');
    const participationKPI = kpis.find(k => k.name === 'Participation Rate');
    const costPerMealKPI = kpis.find(k => k.name === 'Cost per Meal');
    const wasteKPI = kpis.find(k => k.name === 'Food Waste');
    const revenueKPI = kpis.find(k => k.name === 'Revenue Per Meal');

    if (!mealsServedKPI || !participationKPI || !costPerMealKPI || !wasteKPI || !revenueKPI) {
      return "Welcome! I'm ready to help you analyze your program data.";
    }

    const mealsServed = getAggregatedKPIValue(mealsServedKPI.id) || 0;
    const participation = getAggregatedKPIValue(participationKPI.id) || 0;
    const costPerMeal = getAggregatedKPIValue(costPerMealKPI.id) || 0;
    const waste = getAggregatedKPIValue(wasteKPI.id) || 0;
    const revenue = getAggregatedKPIValue(revenueKPI.id) || 0;
    
    const mealsTrend = getKPITrend(mealsServedKPI.id);
    const participationTrend = getKPITrend(participationKPI.id);
    const revenueTrend = getKPITrend(revenueKPI.id);

    let summary = '';

    // Add context about the time period
    if (isNonServingPeriod) {
      summary = `Since today is a ${nonServingReason}, I'm showing you data from the last serving day. `;
    } else {
      switch (selectedTimeframe) {
        case 'prior-day':
          summary = "Here's yesterday's performance summary. ";
          break;
        case 'day':
          summary = "Here's today's performance so far. ";
          break;
        case 'week':
          summary = "Here's your week-to-date performance. ";
          break;
        case 'month':
          summary = "Here's your month-to-date performance. ";
          break;
        case 'year':
          summary = "Here's your academic year performance. ";
          break;
      }
    }

    // Overall performance assessment
    if (participationTrend >= 0 && mealsTrend >= 0) {
      summary += "Your program is performing well with ";
    } else if (participationTrend < 0 && mealsTrend < 0) {
      summary += "We're seeing some challenges with ";
    } else {
      summary += "Operations are proceeding steadily with ";
    }

    // Add specific metrics
    summary += `${Math.round(mealsServed).toLocaleString()} meals served at an average participation rate of ${participation.toFixed(1)}%. `;
    
    // Add trend information
    if (participationTrend > 0) {
      summary += `Participation is up by ${participationTrend.toFixed(1)}% `;
    } else if (participationTrend < 0) {
      summary += `Participation has decreased by ${Math.abs(participationTrend).toFixed(1)}% `;
    } else {
      summary += `Participation is holding steady `;
    }
    
    summary += `with an average revenue of $${revenue.toFixed(2)} per meal. `;

    // Add recommendations
    if (waste > 10) {
      summary += `💡 Consider reviewing food waste metrics, currently at ${waste.toFixed(1)}%. `;
    } else if (costPerMeal > costPerMealKPI.benchmark) {
      summary += `💡 You might want to review meal costs, currently at $${costPerMeal.toFixed(2)} per meal. `;
    }

    return summary;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <LoadingSpinner 
          size="lg" 
          className={darkMode ? 'text-gray-400' : 'text-gray-500'} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-indigo-400' : 'bg-indigo-600'}`} />
          <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {getTimeBasedGreeting(user?.first_name || user?.name?.split(' ')[0] || user?.email?.split('@')[0])}
          </h1>
        </div>
        <button
          onClick={() => navigate('/chat')}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Bot className="w-5 h-5 mr-2" />
          Ask Schoolie
        </button>
      </div>

      <Card>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'} flex items-center justify-center`}>
              <Bot className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
          </div>
          <div className="flex-1">
            <div className="space-y-4">
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                {getDailySummary()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
        <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Recent Activity</h2>
        <div className="space-y-4">
          {[
            { text: 'Menu plan updated for next week', time: '2 hours ago' },
            { text: 'Inventory count completed', time: '4 hours ago' },
            { text: 'New eligibility applications received', time: '6 hours ago' }
          ].map((item, i) => (
            <div key={i} className="flex items-start space-x-3">
              <Clock className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'} mt-0.5`} />
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.text}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
        <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Favorites</h2>
        <div className="space-y-4">
          {[
            { text: 'Monthly Performance Report', time: 'Last viewed yesterday' },
            { text: 'Menu Planning Calendar', time: 'Last viewed 2 days ago' },
            { text: 'Inventory Dashboard', time: 'Last viewed 3 days ago' }
          ].map((item, i) => (
            <div key={i} className="flex items-start space-x-3">
              <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.text}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
        <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Notifications</h2>
        <div className="space-y-4">
          {[
            { text: 'New training module available', time: '1 day ago' },
            { text: 'System maintenance scheduled', time: '2 days ago' },
            { text: 'Policy updates published', time: '3 days ago' }
          ].map((item, i) => (
            <div key={i} className="flex items-start space-x-3">
              <Bell className="w-5 h-5 text-indigo-400 mt-0.5" />
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.text}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workspace;