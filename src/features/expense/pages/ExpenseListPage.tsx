import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getExpenses, deleteExpense, getCategories, getPaymentMethods, getShops } from '../../../services/expenseService';
import { Expense, ExpenseFilters, Category, PaymentMethod, Shop } from '../../../types/expense';
import { format, subMonths, addMonths, subDays, addDays, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

export const ExpenseListPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month'); // 表示モード（月別または日別）
  const [filters, setFilters] = useState<ExpenseFilters>({
    page: 1,
    per_page: 10,
    sort_by: 'expense_date',
    sort_direction: 'desc',
    year_month: format(new Date(), 'yyyy-MM'), // デフォルトで現在の月を選択
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // フィルターの変更ハンドラー
  const handleFilterChange = (name: string, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1, // フィルター変更時はページを1に戻す
    }));
  };

  // 表示モードの切り替え
  const toggleViewMode = () => {
    if (viewMode === 'month') {
      // 月別から日別に切り替え
      const today = format(new Date(), 'yyyy-MM-dd');
      setFilters(prev => ({
        ...prev,
        year_month: undefined,
        date: today,
      }));
      setViewMode('day');
    } else {
      // 日別から月別に切り替え
      const currentMonth = format(new Date(), 'yyyy-MM');
      setFilters(prev => ({
        ...prev,
        date: undefined,
        year_month: currentMonth,
      }));
      setViewMode('month');
    }
  };

  // 月の変更ハンドラー
  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (!filters.year_month) return;
    
    const currentDate = new Date(`${filters.year_month}-01`);
    let newDate;
    
    if (direction === 'prev') {
      newDate = subMonths(currentDate, 1);
    } else {
      newDate = addMonths(currentDate, 1);
    }
    
    const newYearMonth = format(newDate, 'yyyy-MM');
    handleFilterChange('year_month', newYearMonth);
  };

  // 日の変更ハンドラー
  const handleDateChange = (direction: 'prev' | 'next') => {
    if (!filters.date) return;
    
    const currentDate = parseISO(filters.date);
    let newDate;
    
    if (direction === 'prev') {
      newDate = subDays(currentDate, 1);
    } else {
      newDate = addDays(currentDate, 1);
    }
    
    const newDateStr = format(newDate, 'yyyy-MM-dd');
    handleFilterChange('date', newDateStr);
  };

  // ページネーションハンドラー
  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  // 支出データの取得
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getExpenses(filters);
      setExpenses(response.data);
      setTotalPages(response.meta.last_page);
      
      // 合計金額の計算
      const total = response.data.reduce((sum, expense) => sum + Number(expense.amount), 0);
      setTotalAmount(total);
    } catch (err) {
      setError('支出データの取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // マスターデータの取得
  const fetchMasterData = async () => {
    try {
      const [categoriesData, paymentMethodsData, shopsData] = await Promise.all([
        getCategories(),
        getPaymentMethods(),
        getShops(),
      ]);
      setCategories(categoriesData);
      setPaymentMethods(paymentMethodsData);
      setShops(shopsData);
    } catch (err) {
      console.error('マスターデータの取得に失敗しました', err);
    }
  };

  // 支出の削除
  const handleDelete = async (id: number) => {
    if (!window.confirm('この支出を削除してもよろしいですか？')) {
      return;
    }

    try {
      await deleteExpense(id);
      // 削除後にリストを更新
      fetchExpenses();
    } catch (err) {
      console.error('支出の削除に失敗しました', err);
      alert('支出の削除に失敗しました');
    }
  };

  // 初回レンダリング時にデータを取得
  useEffect(() => {
    fetchMasterData();
  }, []);

  // フィルター変更時にデータを再取得
  useEffect(() => {
    fetchExpenses();
  }, [filters, fetchExpenses]);

  // 金額のフォーマット
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日', { locale: ja });
  };

  // 月のフォーマット
  const formatMonth = (yearMonth: string) => {
    return format(new Date(`${yearMonth}-01`), 'yyyy年MM月', { locale: ja });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">支出一覧</h1>
        <div className="flex space-x-4">
          <button
            onClick={toggleViewMode}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            {viewMode === 'month' ? '日別表示に切り替え' : '月別表示に切り替え'}
          </button>
          <Link
            to="/expenses/create"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            新規支出を追加
          </Link>
        </div>
      </div>

      {/* 月別/日別フィルターセクション */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => viewMode === 'month' ? handleMonthChange('prev') : handleDateChange('prev')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            {viewMode === 'month' ? '前月' : '前日'}
          </button>
          
          <h2 className="text-xl font-semibold">
            {viewMode === 'month' && filters.year_month ? formatMonth(filters.year_month) : ''}
            {viewMode === 'day' && filters.date ? formatDate(filters.date) : ''}
            <span className="ml-4 text-lg font-normal">
              合計: {formatAmount(totalAmount)}
            </span>
          </h2>
          
          <button
            onClick={() => viewMode === 'month' ? handleMonthChange('next') : handleDateChange('next')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            {viewMode === 'month' ? '翌月' : '翌日'}
          </button>
        </div>
      </div>

      {/* フィルターセクション */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">検索フィルター</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリー
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={filters.category_id || ''}
              onChange={(e) => handleFilterChange('category_id', e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">すべてのカテゴリー</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              支払い方法
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={filters.payment_method_id || ''}
              onChange={(e) => handleFilterChange('payment_method_id', e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">すべての支払い方法</option>
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              店舗
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={filters.shop_id || ''}
              onChange={(e) => handleFilterChange('shop_id', e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">すべての店舗</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              検索
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="タイトルまたは説明で検索"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
            onClick={() => {
              if (viewMode === 'month') {
                setFilters({
                  page: 1,
                  per_page: 10,
                  sort_by: 'expense_date',
                  sort_direction: 'desc',
                  year_month: format(new Date(), 'yyyy-MM'),
                });
              } else {
                setFilters({
                  page: 1,
                  per_page: 10,
                  sort_by: 'expense_date',
                  sort_direction: 'desc',
                  date: format(new Date(), 'yyyy-MM-dd'),
                });
              }
            }}
          >
            リセット
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => fetchExpenses()}
          >
            検索
          </button>
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* ローディング表示 */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">読み込み中...</p>
        </div>
      ) : (
        <>
          {/* 支出一覧テーブル */}
          {expenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日付
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      タイトル
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      カテゴリー
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      金額
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      支払い方法
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      定期支出
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(expense.expense_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.category?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatAmount(expense.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.payment_method?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.is_recurring ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {expense.recurring_type === 'daily' && '毎日'}
                            {expense.recurring_type === 'weekly' && '毎週'}
                            {expense.recurring_type === 'monthly' && '毎月'}
                            {expense.recurring_type === 'yearly' && '毎年'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            一回限り
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <Link
                            to={`/expenses/${expense.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            詳細
                          </Link>
                          <Link
                            to={`/expenses/${expense.id}/edit`}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            編集
                          </Link>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-white shadow rounded-lg">
              <p className="text-gray-500">支出データがありません</p>
            </div>
          )}

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center">
                <button
                  onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
                  disabled={(filters.page || 1) <= 1}
                  className={`mx-1 px-3 py-1 rounded ${
                    (filters.page || 1) <= 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  前へ
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`mx-1 px-3 py-1 rounded ${
                      page === (filters.page || 1)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, (filters.page || 1) + 1))}
                  disabled={(filters.page || 1) >= totalPages}
                  className={`mx-1 px-3 py-1 rounded ${
                    (filters.page || 1) >= totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  次へ
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}; 