import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getExpense, deleteExpense } from '../../../services/expenseService';
import { Expense } from '../../../types/expense';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const ExpenseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpense = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await getExpense(parseInt(id, 10));
        setExpense(data);
      } catch (err) {
        setError('支出データの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleDelete = async () => {
    if (!expense) return;
    
    if (!window.confirm('この支出を削除してもよろしいですか？')) {
      return;
    }

    try {
      await deleteExpense(expense.id);
      navigate('/expenses');
    } catch (err) {
      console.error('支出の削除に失敗しました', err);
      alert('支出の削除に失敗しました');
    }
  };

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

  // 定期支出の種類を日本語に変換
  const getRecurringTypeText = (type?: string) => {
    switch (type) {
      case 'daily':
        return '毎日';
      case 'weekly':
        return '毎週';
      case 'monthly':
        return '毎月';
      case 'yearly':
        return '毎年';
      default:
        return '-';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/expenses" className="text-blue-500 hover:text-blue-700 mr-4">
          ← 支出一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold">支出詳細</h1>
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
      ) : expense ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{expense.title}</h2>
              <div className="text-2xl font-bold text-blue-600">
                {formatAmount(expense.amount)}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">基本情報</h3>
                <dl className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">支出日</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {formatDate(expense.expense_date)}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">カテゴリー</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {expense.category?.name || '-'}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">支払い方法</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {expense.payment_method?.name || '-'}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">店舗</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {expense.shop?.name || '-'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">追加情報</h3>
                <dl className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">定期支出</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {expense.is_recurring ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {getRecurringTypeText(expense.recurring_type)}
                          {expense.recurring_day && ` (${expense.recurring_day}日)`}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          一回限り
                        </span>
                      )}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">作成日</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {formatDate(expense.created_at)}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">更新日</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {formatDate(expense.updated_at)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {expense.description && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">説明</h3>
                <p className="text-gray-700 whitespace-pre-line">{expense.description}</p>
              </div>
            )}

            <div className="mt-8 flex justify-end space-x-4">
              <Link
                to={`/expenses/${expense.id}/edit`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                編集
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-white shadow rounded-lg">
          <p className="text-gray-500">支出データが見つかりません</p>
        </div>
      )}
    </div>
  );
}; 