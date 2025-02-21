import { useState, useEffect, useMemo } from 'react';
import { 
  format, 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  getMonth, 
  subDays, 
  subWeeks, 
  subMonths,
  subYears,
  startOfYear,
  endOfYear,
  eachDayOfInterval 
} from 'date-fns';
import { useStore } from '../store/useStore';
import { getKPIs, getKPIValues, getSchoolDailyMetrics, getSchools } from '../lib/api';
import { School, SchoolMetrics } from '../types';

// Helper to check if a date is a holiday
const isHoliday = (date: Date) => {
  const holidays = [
    '2024-12-25', '2024-12-24', '2024-12-23',  // Winter Break
    '2024-11-28', '2024-11-29',                 // Thanksgiving
    '2024-01-01',                               // New Year
    '2024-01-15',                               // MLK Day
    '2024-02-19',                               // Presidents Day
    '2024-03-11', '2024-03-12', '2024-03-13',  // Spring Break
    '2024-03-14', '2024-03-15',
    '2024-05-27'                                // Memorial Day
  ];
  return holidays.includes(format(date, 'yyyy-MM-dd'));
};

// Helper to check if a date is a non-serving day
const isNonServingDay = (date: Date) => {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6 || isHoliday(date);
};

// Helper to get non-serving day reason
const getNonServingDayReason = (date: Date) => {
  if (isHoliday(date)) return 'holiday';
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6 ? 'weekend' : null;
};

// Helper to count serving days in a date range
const countServingDays = (start: Date, end: Date) => {
  const days = eachDayOfInterval({ start, end });
  return days.filter(day => !isNonServingDay(day)).length;
};

const useDashboardData = (selectedSchool: string) => {
  const { user, selectedTimeframe, customDateRange } = useStore();
  const [kpis, setKpis] = useState([]);
  const [kpiValues, setKpiValues] = useState([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolMetrics, setSchoolMetrics] = useState<SchoolMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const refreshData = () => {
    setLastRefresh(Date.now());
  };

  const dateRange = useMemo(() => {
    const now = new Date();
    const currentMonth = getMonth(now);
    let start, end = endOfDay(now);

    switch (selectedTimeframe) {
      case 'prior-day': {
        let priorDate = subDays(now, 1);
        while (isNonServingDay(priorDate)) {
          priorDate = subDays(priorDate, 1);
        }
        start = startOfDay(priorDate);
        end = endOfDay(priorDate);
        break;
      }
      case 'day':
        if (isNonServingDay(now)) {
          let priorDate = subDays(now, 1);
          while (isNonServingDay(priorDate)) {
            priorDate = subDays(priorDate, 1);
          }
          start = startOfDay(priorDate);
          end = endOfDay(priorDate);
        } else {
          start = startOfDay(now);
        }
        break;
      case 'week': {
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        start = weekStart;
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      }
      case 'last-week': {
        const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        start = lastWeekStart;
        end = endOfWeek(lastWeekStart, { weekStartsOn: 1 });
        break;
      }
      case 'month':
        start = startOfMonth(now);
        break;
      case 'last-month': {
        const lastMonth = subMonths(now, 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
      }
      case 'year': {
        const isCurrentAcademicYear = currentMonth >= 6;
        start = new Date(isCurrentAcademicYear ? now.getFullYear() : now.getFullYear() - 1, 6, 1);
        end = new Date(isCurrentAcademicYear ? now.getFullYear() + 1 : now.getFullYear(), 5, 30);
        break;
      }
      case 'prior-year': {
        const isCurrentAcademicYear = currentMonth >= 6;
        const priorYear = isCurrentAcademicYear ? now.getFullYear() - 1 : now.getFullYear() - 2;
        start = new Date(priorYear, 6, 1); // July 1st of prior year
        end = new Date(priorYear + 1, 5, 30); // June 30th of next year
        break;
      }
      case 'all-years': {
        // Start from July 1st, 2020 (or your system's start date)
        start = new Date(2020, 6, 1);
        // End at current academic year
        const isCurrentAcademicYear = currentMonth >= 6;
        end = new Date(isCurrentAcademicYear ? now.getFullYear() + 1 : now.getFullYear(), 5, 30);
        break;
      }
      case 'custom': {
        if (customDateRange?.start && customDateRange?.end) {
          start = startOfDay(customDateRange.start);
          end = endOfDay(customDateRange.end);
        } else {
          start = startOfDay(now);
        }
        break;
      }
      default:
        start = startOfDay(now);
    }
    return { start, end };
  }, [selectedTimeframe, customDateRange]);

  const isNonServingPeriod = useMemo(() => {
    if (['prior-day', 'day'].includes(selectedTimeframe)) {
      return isNonServingDay(dateRange.start);
    }
    return false;
  }, [selectedTimeframe, dateRange]);

  const nonServingReason = useMemo(() => {
    if (!isNonServingPeriod) return null;
    return getNonServingDayReason(dateRange.start);
  }, [isNonServingPeriod, dateRange]);

  const servingDays = useMemo(() => {
    return countServingDays(dateRange.start, dateRange.end);
  }, [dateRange]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        
        const fetchedSchools = await getSchools(user.district_id);
        setSchools(fetchedSchools);

        const fetchedKPIs = await getKPIs(user.district_id);
        setKpis(fetchedKPIs);

        // Fetch metrics data for the entire date range
        const metricsData = await getSchoolDailyMetrics(user.district_id, dateRange);
        setSchoolMetrics(metricsData);

        if (!isNonServingPeriod) {
          const kpiValuesPromises = fetchedKPIs.map(kpi =>
            getKPIValues(
              kpi.id, 
              dateRange.start, 
              dateRange.end, 
              selectedSchool !== 'district' ? selectedSchool : undefined
            )
          );
          const allKPIValues = await Promise.all(kpiValuesPromises);
          setKpiValues(allKPIValues.flat());
        } else {
          setKpiValues([]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch dashboard data'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, dateRange, selectedSchool, isNonServingPeriod, lastRefresh]);

  const getAggregatedKPIValue = (kpiId: string) => {
    if (!kpiValues?.length && !schoolMetrics?.length) return null;

    const kpi = kpis?.find(k => k.id === kpiId);
    if (!kpi) return null;

    // For Food Waste KPI, calculate financial impact
    if (kpi.name === 'Food Waste') {
      const relevantMetrics = selectedSchool === 'district' 
        ? schoolMetrics 
        : schoolMetrics.filter(m => m.school_id === selectedSchool);
      
      if (!relevantMetrics.length) return 0;

      // Filter metrics for the selected date range
      const dateFilteredMetrics = relevantMetrics.filter(metric => {
        const metricDate = new Date(metric.date);
        return metricDate >= dateRange.start && metricDate <= dateRange.end;
      });

      // Calculate waste value (assuming $2.50 per portion)
      const costPerPortion = 2.50;
      const totalWaste = dateFilteredMetrics.reduce((sum, metric) => {
        const wastedPortions = metric.produced_meals - metric.served_meals;
        return sum + (wastedPortions > 0 ? wastedPortions : 0);
      }, 0);

      return totalWaste * costPerPortion;
    }

    // For Program Access KPI, use the schools data
    if (kpi.name === 'Program Access') {
      if (selectedSchool === 'district') {
        const totalEnrollment = schools.reduce((sum, school) => sum + (school.total_enrollment || 0), 0);
        const totalFreeReduced = schools.reduce((sum, school) => sum + ((school.free_count || 0) + (school.reduced_count || 0)), 0);
        return totalEnrollment > 0 ? (totalFreeReduced / totalEnrollment) * 100 : 0;
      }
      const school = schools.find(s => s.id === selectedSchool);
      if (!school) return 0;
      const freeReduced = (school.free_count || 0) + (school.reduced_count || 0);
      return school.total_enrollment > 0 ? (freeReduced / school.total_enrollment) * 100 : 0;
    }

    // For Meals Served, calculate from metrics
    if (kpi.name === 'Meals Served') {
      const relevantMetrics = selectedSchool === 'district' 
        ? schoolMetrics 
        : schoolMetrics.filter(m => m.school_id === selectedSchool);
      
      if (!relevantMetrics.length) return 0;

      // Filter metrics for the selected date range
      const dateFilteredMetrics = relevantMetrics.filter(metric => {
        const metricDate = new Date(metric.date);
        return metricDate >= dateRange.start && metricDate <= dateRange.end;
      });

      // Sum all meal types
      return dateFilteredMetrics.reduce((sum, metric) => {
        const breakfastCount = metric.breakfast_count || 0;
        const lunchCount = metric.lunch_count || 0;
        const snackCount = metric.snack_count || 0;
        return sum + breakfastCount + lunchCount + snackCount;
      }, 0);
    }

    // For Lunch/Breakfast/Snack Participation, calculate ADP
    if (['Lunch Participation', 'Breakfast Participation', 'Snack Participation'].includes(kpi.name)) {
      const relevantMetrics = selectedSchool === 'district' 
        ? schoolMetrics 
        : schoolMetrics.filter(m => m.school_id === selectedSchool);
      
      if (!relevantMetrics.length) return 0;

      // Filter metrics for the selected date range
      const dateFilteredMetrics = relevantMetrics.filter(metric => {
        const metricDate = new Date(metric.date);
        return metricDate >= dateRange.start && metricDate <= dateRange.end;
      });

      // Get total meals for the period
      let totalMeals = 0;

      // Get the school's enrollment from the Schools table
      const school = schools.find(s => s.id === relevantMetrics[0].school_id);
      if (!school) return 0;

      // Use the school's total enrollment from Schools table
      const enrollment = school.total_enrollment || 0;

      // Calculate attendance adjusted enrollment
      const attendanceAdjustedEnrollment = enrollment * 0.93; // Apply 93% attendance factor

      dateFilteredMetrics.forEach(metric => {
        // Sum up meals by type
        if (kpi.name === 'Breakfast Participation') {
          totalMeals += (metric.free_meal_breakfast || 0) + 
                       (metric.reduced_meal_breakfast || 0) + 
                       (metric.paid_meal_breakfast || 0);
        } else if (kpi.name === 'Lunch Participation') {
          totalMeals += (metric.free_meal_lunch || 0) + 
                       (metric.reduced_meal_lunch || 0) + 
                       (metric.paid_meal_lunch || 0);
        } else if (kpi.name === 'Snack Participation') {
          totalMeals += (metric.free_meal_snack || 0) + 
                       (metric.reduced_meal_snack || 0) + 
                       (metric.paid_meal_snack || 0);
        }
      });

      // Calculate ADP percentage
      // ADP = (Total meals served / (attendance adjusted enrollment × serving days)) × 100
      return attendanceAdjustedEnrollment > 0 
        ? (totalMeals / (attendanceAdjustedEnrollment * servingDays)) * 100 
        : 0;
    }

    // For Revenue KPI, calculate from metrics
    if (kpi.name === 'Revenue') {
      const relevantMetrics = selectedSchool === 'district' 
        ? schoolMetrics 
        : schoolMetrics.filter(m => m.school_id === selectedSchool);
      
      if (!relevantMetrics.length) return 0;

      // Filter metrics for the selected date range
      const dateFilteredMetrics = relevantMetrics.filter(metric => {
        const metricDate = new Date(metric.date);
        return metricDate >= dateRange.start && metricDate <= dateRange.end;
      });

      // Calculate total revenue
      return dateFilteredMetrics.reduce((sum, metric) => {
        // Reimbursable meals revenue
        const breakfastRevenue = 
          (metric.free_meal_breakfast || 0) * 2.50 +    // Free breakfast
          (metric.reduced_meal_breakfast || 0) * 2.30 + // Reduced breakfast
          (metric.paid_meal_breakfast || 0) * 0.75;     // Paid breakfast

        const lunchRevenue = 
          (metric.free_meal_lunch || 0) * 3.75 +    // Free lunch
          (metric.reduced_meal_lunch || 0) * 3.35 + // Reduced lunch
          (metric.paid_meal_lunch || 0) * 0.50;     // Paid lunch

        const snackRevenue = 
          (metric.free_meal_snack || 0) * 1.00 +    // Free snack
          (metric.reduced_meal_snack || 0) * 0.50 + // Reduced snack
          (metric.paid_meal_snack || 0) * 0.25;     // Paid snack

        // A la carte revenue
        const aLaCarteRevenue = metric.alc_revenue || 0;

        return sum + breakfastRevenue + lunchRevenue + snackRevenue + aLaCarteRevenue;
      }, 0);
    }

    const values = kpiValues.filter(v => {
      const valueDate = new Date(v.date);
      return v.kpi_id === kpiId && 
             valueDate >= dateRange.start && 
             valueDate <= dateRange.end &&
             (selectedSchool === 'district' || v.school_id === selectedSchool);
    });

    if (!values.length) return null;

    if (selectedSchool !== 'district' && ['prior-day', 'day'].includes(selectedTimeframe)) {
      const latestValue = values.reduce((latest, current) => {
        const latestDate = new Date(latest.date);
        const currentDate = new Date(current.date);
        return currentDate > latestDate ? current : latest;
      });
      return latestValue.value;
    }

    if (kpi.unit === '%') {
      return values.reduce((sum, v) => sum + v.value, 0) / values.length;
    }

    if (['#', '$'].includes(kpi.unit)) {
      return values.reduce((sum, v) => sum + v.value, 0);
    }

    return values.reduce((sum, v) => sum + v.value, 0) / values.length;
  };

  const getKPITrend = (kpiId: string) => {
    if (isNonServingPeriod) return 0;
    
    if (!kpiValues?.length && !schoolMetrics?.length) return 0;

    const kpi = kpis?.find(k => k.id === kpiId);
    if (!kpi) return 0;

    // For Food Waste KPI, calculate trend in financial impact
    if (kpi.name === 'Food Waste') {
      const relevantMetrics = selectedSchool === 'district' 
        ? schoolMetrics 
        : schoolMetrics.filter(m => m.school_id === selectedSchool);
      
      if (relevantMetrics.length < 2) return 0;

      // Calculate current period waste value
      const currentPeriodMetrics = relevantMetrics.filter(metric => {
        const metricDate = new Date(metric.date);
        return metricDate >= dateRange.start && metricDate <= dateRange.end;
      });

      // Calculate previous period waste value
      const previousPeriodStart = new Date(dateRange.start);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));

      const previousPeriodMetrics = relevantMetrics.filter(metric => {
        const metricDate = new Date(metric.date);
        return metricDate >= previousPeriodStart && metricDate < dateRange.start;
      });

      const costPerPortion = 2.50;
      const currentWasteValue = currentPeriodMetrics.reduce((sum, metric) => {
        const wastedPortions = metric.produced_meals - metric.served_meals;
        return sum + (wastedPortions > 0 ? wastedPortions : 0);
      }, 0) * costPerPortion;

      const previousWasteValue = previousPeriodMetrics.reduce((sum, metric) => {
        const wastedPortions = metric.produced_meals - metric.served_meals;
        return sum + (wastedPortions > 0 ? wastedPortions : 0);
      }, 0) * costPerPortion;

      return currentWasteValue - previousWasteValue;
    }

    // For Program Access KPI, trend is always 0 since it's current snapshot
    if (kpi.name === 'Program Access') return 0;

    // For Meals Served, calculate trend from metrics
    if (kpi.name === 'Meals Served') {
      const relevantMetrics = selectedSchool === 'district' 
        ? schoolMetrics 
        : schoolMetrics.filter(m => m.school_id === selectedSchool);
      
      if (relevantMetrics.length < 2) return 0;

      // Filter metrics for current and previous periods
      const currentPeriodMetrics = relevantMetrics.filter(metric => {
        const metricDate = new Date(metric.date);
        return metricDate >= dateRange.start && metricDate <= dateRange.end;
      });

      const previousPeriodStart = new Date(dateRange.start);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));

      const previousPeriodMetrics = relevantMetrics.filter(metric => {
        const metricDate = new Date(metric.date);
        return metricDate >= previousPeriodStart && metricDate < dateRange.start;
      });

      const currentValue = currentPeriodMetrics.reduce((sum, metric) => {
        return sum + (metric.breakfast_count || 0) + (metric.lunch_count || 0) + (metric.snack_count || 0);
      }, 0);

      const previousValue = previousPeriodMetrics.reduce((sum, metric) => {
        return sum + (metric.breakfast_count || 0) + (metric.lunch_count || 0) + (metric.snack_count || 0);
      }, 0);

      return currentValue - previousValue;
    }

    // For Lunch/Breakfast/Snack Participation, calculate trend from metrics
    if (['Lunch Participation', 'Breakfast Participation', 'Snack Participation'].includes(kpi.name)) {
      const relevantMetrics = selectedSchool === 'district' 
        ? schoolMetrics 
        : schoolMetrics.filter(m => m.school_id === selectedSchool);
      
      if (relevantMetrics.length < 2) return 0;

      // Calculate current period ADP
      const currentPeriodMetrics = relevantMetrics.filter(metric => {
        const metricDate = new Date(metric.date);
        return metricDate >= dateRange.start && metricDate <= dateRange.end;
      });

      // Calculate previous period ADP
      const previousPeriodStart = new Date(dateRange.start);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));

      const previousPeriodMetrics = relevantMetrics.filter(metric => {
        const metricDate = new Date(metric.date);
        return metricDate >= previousPeriodStart && metricDate < dateRange.start;
      });

      // Get total meals for each period
      let currentTotalMeals = 0;
      let previousTotalMeals = 0;

      // Get the school's enrollment
      const school = schools.find(s => s.id === relevantMetrics[0].school_id);
      if (!school) return 0;

      const enrollment = school.total_enrollment || 0;
      const attendanceAdjustedEnrollment = enrollment * 0.93;

      // Calculate meals for current period
      currentPeriodMetrics.forEach(metric => {
        if (kpi.name === 'Breakfast Participation') {
          currentTotalMeals += (metric.free_meal_breakfast || 0) + 
                             (metric.reduced_meal_breakfast || 0) + 
                             (metric.paid_meal_breakfast || 0);
        } else if (kpi.name === 'Lunch Participation') {
          currentTotalMeals += (metric.free_meal_lunch || 0) + 
                             (metric.reduced_meal_lunch || 0) + 
                             (metric.paid_meal_lunch || 0);
        } else if (kpi.name === 'Snack Participation') {
          currentTotalMeals += (metric.free_meal_snack || 0) + 
                             (metric.reduced_meal_snack || 0) + 
                             (metric.paid_meal_snack || 0);
        }
      });

      // Calculate meals for previous period
      previousPeriodMetrics.forEach(metric => {
        if (kpi.name === 'Breakfast Participation') {
          previousTotalMeals += (metric.free_meal_breakfast || 0) + 
                              (metric.reduced_meal_breakfast || 0) + 
                              (metric.paid_meal_breakfast || 0);
        } else if (kpi.name === 'Lunch Participation') {
          previousTotalMeals += (metric.free_meal_lunch || 0) + 
                              (metric.reduced_meal_lunch || 0) + 
                              (metric.paid_meal_lunch || 0);
        } else if (kpi.name === 'Snack Participation') {
          previousTotalMeals += (metric.free_meal_snack || 0) + 
                              (metric.reduced_meal_snack || 0) + 
                              (metric.paid_meal_snack || 0);
        }
      });

      // Calculate ADP for both periods
      const currentADP = attendanceAdjustedEnrollment > 0 
        ? (currentTotalMeals / (attendanceAdjustedEnrollment * servingDays)) * 100 
        : 0;

      const previousADP = attendanceAdjustedEnrollment > 0 
        ? (previousTotalMeals / (attendanceAdjustedEnrollment * servingDays)) * 100 
        : 0;

      return currentADP - previousADP;
    }

    // For Revenue, calculate trend from metrics
    if (kpi.name === 'Revenue') {
      const relevantMetrics = selectedSchool === 'district' 
        ? schoolMetrics 
        : schoolMetrics.filter(m => m.school_id === selectedSchool);
      
      if (relevantMetrics.length < 2) return 0;

      // Filter metrics for current and previous periods
      const currentPeriodMetrics = relevantMetrics.filter(metric => {
        const metricDate = new Date(metric.date);
        return metricDate >= dateRange.start && metricDate <= dateRange.end;
      });

      const previousPeriodStart = new Date(dateRange.start);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));

      const previousPeriodMetrics = relevantMetrics.filter(metric => {
        const metricDate = new Date(metric.date);
        return metricDate >= previousPeriodStart && metricDate < dateRange.start;
      });

      const currentValue = currentPeriodMetrics.reduce((sum, metric) => {
        return sum + (metric.reimbursement_amount || 0) + (metric.alc_revenue || 0);
      }, 0);

      const previousValue = previousPeriodMetrics.reduce((sum, metric) => {
        return sum + (metric.reimbursement_amount || 0) + (metric.alc_revenue || 0);
      }, 0);

      return currentValue - previousValue;
    }

    const values = kpiValues
      .filter(v => v.kpi_id === kpiId && (selectedSchool === 'district' || v.school_id === selectedSchool))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (values.length < 2) return 0;

    if (selectedSchool !== 'district' && ['prior-day', 'day'].includes(selectedTimeframe)) {
      return values[values.length - 1].value - values[values.length - 2].value;
    }

    const currentPeriodValues = values.filter(v => {
      const valueDate = new Date(v.date);
      return valueDate >= dateRange.start && valueDate <= dateRange.end;
    });

    const previousPeriodStart = new Date(dateRange.start);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    
    const previousPeriodValues = values.filter(v => {
      const valueDate = new Date(v.date);
      return valueDate >= previousPeriodStart && valueDate < dateRange.start;
    });

    if (!currentPeriodValues.length || !previousPeriodValues.length) return 0;

    const currentValue = kpi.unit === '%'
      ? currentPeriodValues.reduce((sum, v) => sum + v.value, 0) / currentPeriodValues.length
      : currentPeriodValues.reduce((sum, v) => sum + v.value, 0);

    const previousValue = kpi.unit === '%'
      ? previousPeriodValues.reduce((sum, v) => sum + v.value, 0) / previousPeriodValues.length
      : previousPeriodValues.reduce((sum, v) => sum + v.value, 0);

    return currentValue - previousValue;
  };

  const getExpectedBenchmark = (kpi: any, schoolBenchmark?: number) => {
    const dailyBenchmark = schoolBenchmark ?? kpi.benchmark;

    // For Program Access KPI, benchmark is static
    if (kpi.name === 'Program Access') return dailyBenchmark;

    if (kpi.unit === '%') return dailyBenchmark;

    if (['#', '$'].includes(kpi.unit)) {
      return dailyBenchmark * servingDays;
    }

    return dailyBenchmark;
  };

  return {
    schools,
    kpis,
    kpiValues,
    schoolMetrics,
    loading,
    error,
    dateRange,
    isNonServingPeriod,
    nonServingReason,
    servingDays,
    getAggregatedKPIValue,
    getKPITrend,
    getExpectedBenchmark,
    refreshData
  };
};

export default useDashboardData;

export { useDashboardData };