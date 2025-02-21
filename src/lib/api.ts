import { supabase } from './supabase';
import { KPI, KPIValue, School, Goal, User, SchoolMetrics, SchoolBenchmark } from '../types';

// User Profile
export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // Upload the file to avatars bucket
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { 
      upsert: true,
      contentType: file.type 
    });

  if (uploadError) throw uploadError;

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  // Update user profile with new avatar URL
  const { data, error: updateError } = await supabase
    .from('users')
    .update({ avatar_url: publicUrl })
    .eq('id', userId)
    .select()
    .single();

  if (updateError) throw updateError;
  return data as User;
}

// KPIs
export async function getKPIs(districtId: string, schoolId?: string) {
  try {
    const query = supabase
      .from('kpis')
      .select(`
        *,
        relationships:kpi_relationships!source_kpi_id(
          target_kpi_id,
          relationship_type,
          formula
        )
      `)
      .eq('district_id', districtId)
      .eq('is_hidden', false);

    if (schoolId) {
      query.eq('school_id', schoolId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    return [];
  }
}

export async function getKPIValues(
  kpiId: string,
  startDate: Date,
  endDate: Date,
  schoolId?: string
) {
  const query = supabase
    .from('kpi_values')
    .select('*')
    .eq('kpi_id', kpiId)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0]);

  if (schoolId) {
    query.eq('school_id', schoolId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as KPIValue[];
}

// Schools
export async function getSchools(districtId: string) {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('district_id', districtId);

  if (error) throw error;
  return data as School[];
}

// School Performance Metrics
export async function getSchoolDailyMetrics(districtId: string, dateRange: { start: Date; end: Date }): Promise<SchoolMetrics[]> {
  try {
    console.log('Fetching metrics with params:', {
      districtId,
      startDate: dateRange.start.toISOString().split('T')[0],
      endDate: dateRange.end.toISOString().split('T')[0]
    });

    const { data, error } = await supabase
      .from('school_daily_metrics')
      .select(`
        id,
        school_id,
        date,
        total_enrollment,
        free_reduced_count,
        free_count,
        reduced_count,
        breakfast_count,
        lunch_count,
        free_meal_lunch,
        reduced_meal_lunch,
        paid_meal_lunch,
        free_meal_breakfast,
        reduced_meal_breakfast,
        paid_meal_breakfast,
        reimbursement_amount,
        alc_revenue,
        meal_equivalents,
        mplh,
        program_access_rate,
        breakfast_participation_rate,
        lunch_participation_rate,
        schools (
          name
        )
      `)
      .eq('district_id', districtId)
      .gte('date', dateRange.start.toISOString().split('T')[0])
      .lte('date', dateRange.end.toISOString().split('T')[0]);

    if (error) {
      console.error('Error fetching school metrics:', error);
      throw error;
    }

    if (!data) return [];

    // Map the data to include school name and ensure all values are present
    const metrics = data.map(metric => ({
      id: metric.id,
      school_id: metric.school_id,
      school_name: metric.schools?.name || 'Unknown School',
      date: metric.date,
      total_enrollment: metric.total_enrollment || 0,
      free_reduced_count: metric.free_reduced_count || 0,
      free_count: metric.free_count || 0,
      reduced_count: metric.reduced_count || 0,
      program_access_rate: metric.program_access_rate || 0,
      breakfast_participation_rate: metric.breakfast_participation_rate || 0,
      lunch_participation_rate: metric.lunch_participation_rate || 0,
      breakfast_count: metric.breakfast_count || 0,
      lunch_count: metric.lunch_count || 0,
      free_meal_lunch: metric.free_meal_lunch || 0,
      reduced_meal_lunch: metric.reduced_meal_lunch || 0,
      paid_meal_lunch: metric.paid_meal_lunch || 0,
      free_meal_breakfast: metric.free_meal_breakfast || 0,
      reduced_meal_breakfast: metric.reduced_meal_breakfast || 0,
      paid_meal_breakfast: metric.paid_meal_breakfast || 0,
      reimbursement_amount: metric.reimbursement_amount || 0,
      alc_revenue: metric.alc_revenue || 0,
      meal_equivalents: metric.meal_equivalents || 0,
      mplh: metric.mplh || 0,
      eod_tasks_completed: true // Hardcode for now since we don't have the column yet
    }));

    console.log('Processed metrics:', metrics);
    return metrics;
  } catch (error) {
    console.error('Error in getSchoolDailyMetrics:', error);
    throw error;
  }
}

// School Benchmarks
export async function getSchoolBenchmarks(schoolId: string) {
  try {
    const { data, error } = await supabase
      .from('school_benchmarks')
      .select('*')
      .eq('school_id', schoolId);

    if (error) throw error;
    return data as SchoolBenchmark[];
  } catch (error) {
    console.error('Error fetching school benchmarks:', error);
    return [];
  }
}

export async function updateSchoolBenchmark(
  schoolId: string,
  kpiId: string,
  benchmark: number
) {
  try {
    // First, update the specified KPI benchmark
    const { data: updatedBenchmark, error: benchmarkError } = await supabase
      .from('school_benchmarks')
      .upsert(
        {
          school_id: schoolId,
          kpi_id: kpiId,
          benchmark
        },
        {
          onConflict: 'school_id,kpi_id'
        }
      )
      .select()
      .single();

    if (benchmarkError) throw benchmarkError;

    // Check if this KPI drives other KPI benchmarks
    const { data: relationships, error: relError } = await supabase
      .from('kpi_relationships')
      .select(`
        target_kpi_id,
        formula,
        kpis!target_kpi_id(*)
      `)
      .eq('source_kpi_id', kpiId)
      .eq('relationship_type', 'drives_benchmark');

    if (relError) throw relError;

    // If there are relationships, update the driven KPIs
    if (relationships?.length) {
      // Get school enrollment
      const { data: school } = await supabase
        .from('school_daily_metrics')
        .select('total_enrollment')
        .eq('school_id', schoolId)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      const enrollment = school?.total_enrollment || 0;

      // Update each driven KPI
      for (const rel of relationships) {
        // For Meals Served, calculate based on participation rate
        if (rel.kpis.name === 'Meals Served') {
          const newBenchmark = Math.round(enrollment * (benchmark / 100));
          await supabase
            .from('school_benchmarks')
            .upsert({
              school_id: schoolId,
              kpi_id: rel.target_kpi_id,
              benchmark: newBenchmark
            }, {
              onConflict: 'school_id,kpi_id'
            });
        }
      }
    }

    return updatedBenchmark;
  } catch (error) {
    console.error('Error updating school benchmark:', error);
    throw error;
  }
}

export async function getDistrictBenchmarks(districtId: string) {
  try {
    const { data: schools } = await supabase
      .from('schools')
      .select('id')
      .eq('district_id', districtId);

    if (!schools?.length) return [];

    const schoolIds = schools.map(s => s.id);

    const { data: benchmarks, error } = await supabase
      .from('school_benchmarks')
      .select(`
        school_id,
        kpi_id,
        benchmark,
        schools (
          name,
          district_id
        )
      `)
      .in('school_id', schoolIds);

    if (error) throw error;
    return benchmarks;
  } catch (error) {
    console.error('Error fetching district benchmarks:', error);
    return [];
  }
}