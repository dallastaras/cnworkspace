import React from 'react';
import { useStore } from '../../../store/useStore';
import { Users, UserCheck, UserMinus, Building } from 'lucide-react';

interface EnrollmentBreakdown {
  totalEnrollment: number;
  freeCount: number;
  reducedCount: number;
  paidCount: number;
}

interface SchoolEnrollment extends EnrollmentBreakdown {
  schoolName: string;
}

interface EnrollmentDetailsProps extends EnrollmentBreakdown {
  schoolBreakdown?: SchoolEnrollment[];
  isDistrictView: boolean;
}

export const EnrollmentDetails: React.FC<EnrollmentDetailsProps> = ({
  totalEnrollment = 0,
  freeCount = 0,
  reducedCount = 0,
  paidCount = 0,
  schoolBreakdown = [],
  isDistrictView
}) => {
  const darkMode = useStore((state) => state.darkMode);

  const calculatePercentage = (count: number) => {
    return totalEnrollment > 0 ? ((count / totalEnrollment) * 100).toFixed(1) : '0.0';
  };

  const MetricCard: React.FC<{
    label: string;
    count: number;
    icon: React.ElementType;
    color: string;
  }> = ({ label, count, icon: Icon, color }) => (
    <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className={`w-5 h-5 ${darkMode ? 'text-gray-100' : 'text-white'}`} />
          </div>
          <div>
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {label}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {calculatePercentage(count)}% of enrollment
            </p>
          </div>
        </div>
        <span className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {count.toLocaleString()}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Eligibility Breakdown */}
      <div className="space-y-3">
        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Eligibility Breakdown
        </h3>
        <div className="grid gap-3">
          <MetricCard
            label="Free Eligible"
            count={freeCount}
            icon={UserCheck}
            color={darkMode ? 'bg-green-900' : 'bg-green-600'}
          />
          <MetricCard
            label="Reduced Eligible"
            count={reducedCount}
            icon={UserMinus}
            color={darkMode ? 'bg-amber-900' : 'bg-amber-600'}
          />
          <MetricCard
            label="Paid"
            count={paidCount}
            icon={Users}
            color={darkMode ? 'bg-blue-900' : 'bg-blue-600'}
          />
        </div>
      </div>

      {/* School Breakdown - Only show in district view */}
      {isDistrictView && schoolBreakdown.length > 0 && (
        <div className="space-y-3">
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            School Breakdown
          </h3>
          <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      School
                    </th>
                    <th className={`px-4 py-3 text-right text-xs font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      Total
                    </th>
                    <th className={`px-4 py-3 text-right text-xs font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      Free
                    </th>
                    <th className={`px-4 py-3 text-right text-xs font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      Reduced
                    </th>
                    <th className={`px-4 py-3 text-right text-xs font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      Paid
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                  {schoolBreakdown.map((school) => (
                    <tr key={school.schoolName}>
                      <td className={`px-4 py-3 text-sm ${
                        darkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <Building className={`w-4 h-4 ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <span>{school.schoolName}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm text-right ${
                        darkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {school.totalEnrollment.toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right ${
                        darkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {school.freeCount.toLocaleString()}
                        <span className={`ml-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          ({((school.freeCount / school.totalEnrollment) * 100).toFixed(1)}%)
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-sm text-right ${
                        darkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {school.reducedCount.toLocaleString()}
                        <span className={`ml-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          ({((school.reducedCount / school.totalEnrollment) * 100).toFixed(1)}%)
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-sm text-right ${
                        darkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {school.paidCount.toLocaleString()}
                        <span className={`ml-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          ({((school.paidCount / school.totalEnrollment) * 100).toFixed(1)}%)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};