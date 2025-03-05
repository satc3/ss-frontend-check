import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { getUser } from '../../store/auth/authSlice';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface TodayExpense {
  id: number;
  description: string;
  amount: number;
  category: string;
  category_color: string;
  payment_method: string | null;
}

interface ExpenseData {
  total: number;
  date: string;
  expenses: TodayExpense[];
}

interface WeeklyData {
  date: string;
  amount: number;
  full_date: string;
}

export const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [todayData, setTodayData] = useState<ExpenseData | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'おはようございます';
    if (hour < 18) return 'こんにちは';
    return 'こんばんは';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 現在はexpenseServiceが削除されているため、データ取得は行いません
        // 代わりにダミーデータを設定します
        setTodayData({
          total: 0,
          date: new Date().toISOString().split('T')[0],
          expenses: []
        });
        
        setWeeklyData([
          { date: '月', amount: 0, full_date: '2023-01-01' },
          { date: '火', amount: 0, full_date: '2023-01-02' },
          { date: '水', amount: 0, full_date: '2023-01-03' },
          { date: '木', amount: 0, full_date: '2023-01-04' },
          { date: '金', amount: 0, full_date: '2023-01-05' },
          { date: '土', amount: 0, full_date: '2023-01-06' },
          { date: '日', amount: 0, full_date: '2023-01-07' }
        ]);
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError('データの取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user?.name}
              className="h-16 w-16 rounded-full border-2 border-white object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}、{user?.name}さん
        </h1>
            <p className="text-white/80">
              今日も一緒に家計を管理しましょう！
        </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* 週間支出推移グラフ */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center pb-4 border-b border-gray-200">
              <span className="bg-indigo-100 text-indigo-600 p-2 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </span>
              週間支出推移
            </h2>
            <div className="mt-6" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={(value) => `¥${value.toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: number) => [`¥${value.toLocaleString()}`, '支出']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 本日の支出詳細 */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center pb-4 border-b border-gray-200">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </span>
              本日の支出
              <span className="ml-auto text-2xl font-bold text-indigo-600">
                {formatCurrency(todayData?.total || 0)}
              </span>
            </h2>

            {todayData?.expenses && todayData.expenses.length > 0 ? (
              <div className="mt-6">
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-100">
                    {todayData.expenses.map((expense) => (
                      <li key={expense.id} className="py-5 px-4 -mx-4 hover:bg-gray-50/50 rounded-lg transition-all duration-200 group">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: expense.category_color }}>
                              <span className="text-white text-xs font-medium">
                                {expense.category.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {expense.description}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {expense.category}
                              {expense.payment_method && ` • ${expense.payment_method}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(expense.amount)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center py-10">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">支出がありません</h3>
                <p className="mt-1 text-sm text-gray-500">
                  今日はまだ支出が記録されていません。
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 支出サマリー */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white shadow-lg rounded-lg p-6 transform transition-all hover:scale-105">
            <h2 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
              <span className="bg-green-100 text-green-600 p-2 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </span>
            今月の支出
          </h2>
            <p className="text-3xl font-bold text-green-600">
            ¥0
          </p>
        </div>

          <div className="bg-white shadow-lg rounded-lg p-6 transform transition-all hover:scale-105">
            <h2 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
              <span className="bg-purple-100 text-purple-600 p-2 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </span>
            先月の支出
          </h2>
            <p className="text-3xl font-bold text-purple-600">
            ¥0
          </p>
        </div>

          <div className="bg-white shadow-lg rounded-lg p-6 transform transition-all hover:scale-105">
            <h2 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
              <span className="bg-yellow-100 text-yellow-600 p-2 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </span>
            年間の支出
          </h2>
            <p className="text-3xl font-bold text-yellow-600">
            ¥0
          </p>
          </div>
        </div>
      </div>
    </>
  );
}; 