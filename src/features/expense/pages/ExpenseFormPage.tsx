import { format } from 'date-fns';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  createExpense, 
  getExpense, 
  updateExpense,
  getCategories,
  getPaymentMethods, 
  getShops 
} from '../../../services/expenseService';
import { getItems, createItem } from '../../../services/itemService';
import {
  ExpenseFormData,
  Category,
  PaymentMethod,
  Shop,
  ExpenseItemData,
  ReceiptItem
} from '../../../types/expense';
import { Item, ItemFormData } from '../../../types/item';
import { Autocomplete } from '../../../components/ui/Autocomplete';
import { XCircleIcon } from '@heroicons/react/24/outline';

export const ExpenseFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // フォームデータの初期値
  const initialFormData = useMemo<ExpenseFormData>(() => ({
    title: '',
    description: '',
    amount: 0,
    expense_date: format(new Date(), 'yyyy-MM-dd'),
    category_id: undefined,
    payment_method_id: undefined,
    shop_id: undefined,
    item_id: undefined,
    is_recurring: false,
    recurring_type: undefined,
    recurring_day: undefined,
    items: [],
  }), []);

  // 空の商品アイテムの初期値
  const emptyItemData: ExpenseItemData = {
    name: '',
    quantity: 1,
    price: 0,
    subtotal: 0,
    category_id: undefined,
  };

  const [formData, setFormData] = useState<ExpenseFormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState(false); // データ取得済みフラグを追加
  
  // 商品管理関連の状態
  const [itemName, setItemName] = useState<string>('');
  const [registerToItemManagement, setRegisterToItemManagement] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<number | undefined>(undefined);
  
  // 複数商品管理関連の状態
  const [useMultipleItems, setUseMultipleItems] = useState<boolean>(false);
  const [expenseItems, setExpenseItems] = useState<ExpenseItemData[]>([]);
  const [tempItem, setTempItem] = useState<ExpenseItemData | null>(null);

  // 商品名が変更されたときにタイトルを更新
  useEffect(() => {
    if (itemName && !useMultipleItems) {
      setFormData(prev => ({
        ...prev,
        title: itemName
      }));
    }
  }, [itemName, useMultipleItems]);

  // 商品アイテムが変更されたときに合計金額を更新
  useEffect(() => {
    if (useMultipleItems && expenseItems.length > 0) {
      const totalAmount = expenseItems.reduce((sum, item) => sum + item.subtotal, 0);
      setFormData(prev => ({
        ...prev,
        amount: totalAmount,
        title: expenseItems.length === 1 
          ? expenseItems[0].name 
          : `${expenseItems[0].name} 他${expenseItems.length - 1}点`
      }));
    }
  }, [expenseItems, useMultipleItems]);

  // マスターデータと既存の支出データを取得
  useEffect(() => {
    // データ取得済みの場合は再取得しない
    if (dataFetched) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // マスターデータを取得
        const [categoriesData, paymentMethodsData, shopsData, itemsData] = await Promise.all([
          getCategories(),
          getPaymentMethods(),
          getShops(),
          getItems(),
        ]);
        
        setCategories(categoriesData);
        setPaymentMethods(paymentMethodsData);
        setShops(shopsData);
        setItems(itemsData.data || []); // data配列を取り出す

        // 編集モードの場合、既存の支出データを取得
        if (isEditMode && id) {
          const expenseData = await getExpense(parseInt(id, 10));
          console.log('編集用データ取得:', expenseData);
          
          // 日付のフォーマットを調整
          const formattedData: ExpenseFormData = {
            title: expenseData.title,
            description: expenseData.description || '',
            amount: expenseData.amount,
            expense_date: format(new Date(expenseData.expense_date), 'yyyy-MM-dd'),
            category_id: expenseData.category_id ? Number(expenseData.category_id) : undefined,
            payment_method_id: expenseData.payment_method_id ? Number(expenseData.payment_method_id) : undefined,
            shop_id: expenseData.shop_id ? Number(expenseData.shop_id) : undefined,
            item_id: expenseData.item_id ? Number(expenseData.item_id) : undefined,
            is_recurring: expenseData.is_recurring,
            recurring_type: expenseData.recurring_type,
            recurring_day: expenseData.recurring_day ? Number(expenseData.recurring_day) : undefined,
            items: expenseData.items || [],
          };
          
          setFormData(formattedData);
          
          // ローカルストレージに保存
          localStorage.setItem('expenseFormData', JSON.stringify(formattedData));
          
          // 既存のタイトルを商品名として設定
          setItemName(expenseData.title);
          
          // 商品IDがある場合は設定
          if (expenseData.item_id) {
            setSelectedItemId(Number(expenseData.item_id));
          }
          
          // レシートから商品情報を取得する
          if (expenseData.receipt && expenseData.receipt.items && expenseData.receipt.items.length > 0) {
            // レシートの商品情報をExpenseItemData形式に変換
            const receiptItems = expenseData.receipt.items.map((item: ReceiptItem) => ({
              item_id: item.item_id,
              name: item.name,
              quantity: Number(item.quantity),
              price: Number(item.unit_price),
              subtotal: Number(item.subtotal),
              category_id: item.category_id
            }));
            
            setUseMultipleItems(true);
            setExpenseItems(receiptItems);
            console.log('レシートからの商品データ:', receiptItems);
          } 
          // 複数商品データが直接保存されている場合
          else if (expenseData.items && expenseData.items.length > 0) {
            setUseMultipleItems(true);
            setExpenseItems(expenseData.items);
            console.log('直接保存された商品データ:', expenseData.items);
          }
        } else {
          // 新規作成モードの場合、ローカルストレージから復元を試みる
          const savedData = localStorage.getItem('expenseFormData');
          if (savedData) {
            try {
              const parsedData = JSON.parse(savedData);
              // カテゴリ、支払い方法、店舗のIDだけを保持する
              const restoredData: ExpenseFormData = {
                ...initialFormData,
                category_id: parsedData.category_id,
                payment_method_id: parsedData.payment_method_id,
                shop_id: parsedData.shop_id,
                // 他のフィールドはデフォルト値を使用
              };
              setFormData(restoredData);
              console.log('ローカルストレージからフォームデータを復元:', restoredData);
            } catch (e) {
              console.error('保存されたデータの解析に失敗:', e);
            }
          }
        }
        // データ取得完了フラグをセット
        setDataFetched(true);
      } catch (err) {
        console.error('データの取得に失敗しました', err);
        setError('データの取得に失敗しました。しばらく待ってから再試行してください。');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode, initialFormData, dataFetched]);

  // フォームデータの変更時にローカルストレージに保存
  useEffect(() => {
    // 初期化中は保存しない
    if (loading) return;
    
    // 選択されたカテゴリ、支払い方法、店舗のIDだけを保存
    const dataToSave = {
      category_id: formData.category_id,
      payment_method_id: formData.payment_method_id,
      shop_id: formData.shop_id
    };
    localStorage.setItem('expenseFormData', JSON.stringify(dataToSave));
  }, [formData.category_id, formData.payment_method_id, formData.shop_id, loading]);

  // フォーム入力の変更ハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        // チェックボックスがオフになった場合、関連フィールドをリセット
        ...(name === 'is_recurring' && !checked ? { recurring_type: undefined, recurring_day: undefined } : {}),
      }));
    } else if (name === 'amount' && !useMultipleItems) {
      // 金額は数値に変換（複数商品モードでない場合のみ手動で変更可能）
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : parseInt(value, 10),
      }));
    } else if (name === 'category_id' || name === 'payment_method_id' || name === 'shop_id' || name === 'recurring_day') {
      // IDフィールドは数値に変換するか、空の場合はundefinedに
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? undefined : parseInt(value, 10),
      }));
    } else if (name === 'item_id') {
      // 商品が選択された場合
      if (value) {
        const selectedItem = items.find(item => item.id === parseInt(value, 10));
        if (selectedItem) {
          setItemName(selectedItem.name);
          setSelectedItemId(parseInt(value, 10));
          setRegisterToItemManagement(false); // 既存の商品を選択した場合は登録不要
          
          // 商品名をタイトルとして設定
          setFormData(prev => ({
            ...prev,
            title: selectedItem.name
          }));
        }
      } else {
        setSelectedItemId(undefined);
      }
    } else {
      // その他のフィールドは文字列として扱う
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  // 商品名の変更ハンドラー
  const handleItemNameChange = (value: string) => {
    setItemName(value);
    // 商品名が変更されたら、選択されている商品IDをクリア
    setSelectedItemId(undefined);
    
    // 複数商品モードでない場合、商品名をタイトルとして設定
    if (!useMultipleItems) {
      setFormData(prev => ({
        ...prev,
        title: value
      }));
    }
  };
  
  // 商品選択ハンドラー
  const handleItemSelect = (value: string) => {
    setItemName(value);
    
    // 選択された商品名に一致する商品IDを設定
    const selectedItem = items.find(item => item.name === value);
    if (selectedItem) {
      setSelectedItemId(selectedItem.id);
    } else {
      setSelectedItemId(undefined);
      // 新しい商品の場合は商品管理への登録をデフォルトでオン
      setRegisterToItemManagement(true);
    }
    
    // 複数商品モードでない場合、商品名をタイトルとして設定
    if (!useMultipleItems) {
      setFormData(prev => ({
        ...prev,
        title: value
      }));
    }
  };
  
  // 商品管理への登録チェックボックスの変更ハンドラー
  const handleRegisterItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterToItemManagement(e.target.checked);
  };

  // 複数商品モードの切り替えハンドラー
  const handleUseMultipleItemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setUseMultipleItems(isChecked);
    
    if (isChecked) {
      // 単一商品モードから複数商品モードに切り替える場合
      if (itemName) {
        // 現在の商品名を使用して最初の商品アイテムを作成
        const newItem: ExpenseItemData = {
          name: itemName,
          item_id: selectedItemId,
          quantity: 1,
          price: formData.amount,
          subtotal: formData.amount,
          category_id: formData.category_id
        };
        setExpenseItems([newItem]);
      } else {
        // 商品名がない場合は空の商品アイテムを追加
        setExpenseItems([{...emptyItemData}]);
      }
    } else {
      // 複数商品モードから単一商品モードに切り替える場合
      // 最初の商品があれば、その情報を使用
      if (expenseItems.length > 0) {
        const firstItem = expenseItems[0];
        setItemName(firstItem.name);
        setSelectedItemId(firstItem.item_id);
        setFormData(prev => ({
          ...prev,
          title: firstItem.name,
          amount: firstItem.subtotal
        }));
      }
    }
  };

  // 特定の商品を追加
  const handleAddSpecificItem = (item: ExpenseItemData) => {
    const newItems = [...expenseItems, item];
    setExpenseItems(newItems);
    updateTotalAmount(newItems);
  };

  // 商品の削除
  const handleRemoveItem = (index: number) => {
    const newItems = [...expenseItems];
    newItems.splice(index, 1);
    
    // 少なくとも1つの商品は残す
    if (newItems.length === 0) {
      newItems.push({
        name: '',
        quantity: 1,
        price: 0,
        subtotal: 0
      });
    }
    
    setExpenseItems(newItems);
    updateTotalAmount(newItems);
  };

  // 商品情報の変更（名前、数量、価格など）
  // const handleItemChange = (index: number, field: keyof ExpenseItemData, value: string | number) => {
  //   const newItems = [...expenseItems];
  //   newItems[index] = {
  //     ...newItems[index],
  //     [field]: value
  //   };
  //   
  //   // 数量または価格が変更された場合、小計を更新
  //   if (field === 'quantity' || field === 'price') {
  //     const quantity = field === 'quantity' ? Number(value) : Number(newItems[index].quantity);
  //     const price = field === 'price' ? Number(value) : Number(newItems[index].price);
  //     newItems[index].subtotal = quantity * price;
  //   }
  //   
  //   setExpenseItems(newItems);
  //   updateTotalAmount(newItems);
  // };

  // 商品アイテムの選択ハンドラー
  // const handleItemNameSelect = (index: number, value: string) => {
  //   const selectedItem = items.find(item => item.name === value);
  //   
  //   setExpenseItems(prev => {
  //     const newItems = [...prev];
  //     newItems[index] = {
  //       ...newItems[index],
  //       name: value,
  //       item_id: selectedItem?.id || null
  //     };
  //     return newItems;
  //   });
  // };

  // 合計金額の更新
  const updateTotalAmount = (items: ExpenseItemData[]) => {
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    setFormData(prev => ({
      ...prev,
      amount: total
    }));
  };

  // フォーム送信ハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null); // 成功メッセージをリセット

    try {
      // 必須項目のバリデーション
      if (!formData.expense_date || !formData.category_id || !formData.payment_method_id) {
        throw new Error('必須項目を入力してください');
      }
      
      // 複数商品モードの場合
      if (useMultipleItems) {
        if (expenseItems.length === 0) {
          throw new Error('少なくとも1つの商品を追加してください');
        }
        
        for (const item of expenseItems) {
          if (!item.name || item.quantity <= 0 || item.price <= 0) {
            throw new Error('すべての商品に名前、数量、価格を入力してください');
          }
        }
        
        // 複数商品を設定
        formData.items = expenseItems;
      } else {
        // 単一商品の場合
        if (!itemName) {
          throw new Error('商品名を入力してください');
        }
        
        // 在庫管理に商品を登録
        if (registerToItemManagement && !selectedItemId) {
          try {
            const newItemData: ItemFormData = {
              name: itemName,
              description: '',
              category_id: formData.category_id,
            };
            
            const createdItem = await createItem(newItemData);
            formData.item_id = createdItem.id;
          } catch (err) {
            console.error('商品の登録に失敗しました', err);
            throw new Error('商品の登録に失敗しました');
          }
        } else if (selectedItemId) {
          formData.item_id = selectedItemId;
        }
        
        // タイトルを商品名に設定
        formData.title = itemName;
      }
      
      // 金額が0の場合エラー
      if (formData.amount <= 0) {
        throw new Error('金額は0より大きい値を入力してください');
      }
      
      // データを送信
      if (isEditMode && id) {
        await updateExpense(parseInt(id, 10), formData);
      } else {
        await createExpense(formData);
      }
      
      // 成功メッセージを表示
      setSuccess(`支出を${isEditMode ? '更新' : '登録'}しました`);
      
      // ローカルストレージをクリア
      localStorage.removeItem('expenseFormData');
      
      // 支出一覧ページにリダイレクト（遅延を入れて成功メッセージを表示）
      setTimeout(() => {
        navigate('/expenses');
      }, 1500);
    } catch (err) {
      console.error('送信エラー:', err);
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/expenses" className="text-blue-500 hover:text-blue-700 mr-4">
          ← 支出一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold">
          {isEditMode ? '支出を編集' : '新規支出を追加'}
        </h1>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 成功メッセージ */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* ローディング表示 */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">読み込み中...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本情報 */}
            <div>
              <h2 className="text-lg font-semibold mb-4">基本情報</h2>
              
              {/* 複数商品モード切り替え */}
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="use_multiple_items"
                    checked={useMultipleItems}
                    onChange={handleUseMultipleItemsChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="use_multiple_items" className="ml-2 block text-sm text-gray-700">
                    複数商品を登録する
                  </label>
                </div>
              </div>
              
              {!useMultipleItems ? (
                /* 単一商品の入力フィールド */
                <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      商品 <span className="text-red-500">*</span>
                    </label>
                  </div>
                  
                  <div>
                    <Autocomplete
                      id="item_name"
                      name="item_name"
                      label=""
                      value={itemName}
                      onChange={handleItemNameChange}
                      onSelect={handleItemSelect}
                      suggestions={items.map(item => item.name)}
                      placeholder="商品名を入力または選択"
                      className="mb-0"
                    />
                    {!selectedItemId && itemName && (
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id="register_item"
                          checked={registerToItemManagement}
                          onChange={handleRegisterItemChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor="register_item" className="ml-2 block text-sm text-gray-700">
                          この商品を商品管理に登録する
                        </label>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      金額 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="例: 1000"
                    />
                  </div>
                </div>
              ) : (
                /* 複数商品の入力フィールド */
                <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      商品登録 <span className="text-red-500">*</span>
                    </label>
                  </div>
                  
                  {/* 商品登録フォーム - 新しく追加 */}
                  <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-white">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">新しい商品を登録</h4>
                    
                    <div className="mt-2">
                      <Autocomplete
                        id="new_item_name"
                        name="new_item_name"
                        label="商品名"
                        value={itemName}
                        onChange={handleItemNameChange}
                        onSelect={handleItemSelect}
                        suggestions={items.map(item => item.name)}
                        placeholder="商品名を入力または選択"
                        className="mb-0"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label htmlFor="new_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                          数量
                        </label>
                        <input
                          type="number"
                          id="new_quantity"
                          name="new_quantity"
                          value={tempItem ? tempItem.quantity : 1}
                          onChange={(e) => setTempItem(prev => prev ? { ...prev, quantity: Number(e.target.value) } : { name: '', quantity: Number(e.target.value), price: 0, subtotal: 0 })}
                          min="1"
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label htmlFor="new_price" className="block text-sm font-medium text-gray-700 mb-1">
                          単価
                        </label>
                        <input
                          type="number"
                          id="new_price"
                          name="new_price"
                          value={tempItem ? tempItem.price : 0}
                          onChange={(e) => setTempItem(prev => prev ? { ...prev, price: Number(e.target.value) } : { name: '', quantity: 1, price: Number(e.target.value), subtotal: 0 })}
                          min="0"
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (itemName && tempItem) {
                            const newItem = {
                              name: itemName,
                              quantity: tempItem.quantity || 1,
                              price: tempItem.price || 0,
                              subtotal: (tempItem.quantity || 1) * (tempItem.price || 0)
                            };
                            handleAddSpecificItem(newItem);
                            setItemName('');
                            setTempItem(null);
                          }
                        }}
                        disabled={!itemName}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        追加
                      </button>
                    </div>
                  </div>
                  
                  {/* 登録済み商品リスト */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">登録済み商品リスト</h4>
                    
                    {expenseItems.length > 0 ? (
                      expenseItems.map((item, index) => (
                        <div key={index} className="mb-3 p-3 border border-gray-200 rounded-lg bg-white">
                          <div className="flex justify-between">
                            <div>
                              <span className="text-sm font-medium">{item.name}</span>
                              <div className="text-xs text-gray-500 mt-1">
                                {item.quantity}個 × {item.price.toLocaleString()}円 = {item.subtotal.toLocaleString()}円
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <p className="text-gray-500">商品が登録されていません</p>
                      </div>
                    )}
                  </div>
                  
                  {/* 合計金額表示 */}
                  <div className="mt-4 flex justify-between items-center p-2 bg-gray-100 rounded">
                    <span className="font-medium">合計金額:</span>
                    <span className="text-lg font-bold text-blue-700">{formData.amount.toLocaleString()}円</span>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="expense_date" className="block text-sm font-medium text-gray-700 mb-1">
                  支出日 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="expense_date"
                  name="expense_date"
                  value={formData.expense_date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                  カテゴリー <span className="text-red-500">*</span>
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id || ''}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">カテゴリーを選択</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="payment_method_id" className="block text-sm font-medium text-gray-700 mb-1">
                  支払い方法 <span className="text-red-500">*</span>
                </label>
                <select
                  id="payment_method_id"
                  name="payment_method_id"
                  value={formData.payment_method_id || ''}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">支払い方法を選択</option>
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="shop_id" className="block text-sm font-medium text-gray-700 mb-1">
                  店舗
                </label>
                <select
                  id="shop_id"
                  name="shop_id"
                  value={formData.shop_id || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">店舗を選択</option>
                  {shops.map(shop => (
                    <option key={shop.id} value={shop.id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* 追加情報 */}
            <div>
              <h2 className="text-lg font-semibold mb-4">追加情報</h2>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  説明
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="支出の詳細を入力してください"
                />
              </div>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_recurring"
                    name="is_recurring"
                    checked={formData.is_recurring}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="is_recurring" className="ml-2 block text-sm text-gray-700">
                    定期支出
                  </label>
                </div>
              </div>
              
              {formData.is_recurring && (
                <>
                  <div className="mb-4">
                    <label htmlFor="recurring_type" className="block text-sm font-medium text-gray-700 mb-1">
                      繰り返しの種類 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="recurring_type"
                      name="recurring_type"
                      value={formData.recurring_type || ''}
                      onChange={handleChange}
                      required={formData.is_recurring}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="">繰り返しの種類を選択</option>
                      <option value="daily">毎日</option>
                      <option value="weekly">毎週</option>
                      <option value="monthly">毎月</option>
                      <option value="yearly">毎年</option>
                    </select>
                  </div>
                  
                  {formData.recurring_type === 'monthly' && (
                    <div className="mb-4">
                      <label htmlFor="recurring_day" className="block text-sm font-medium text-gray-700 mb-1">
                        毎月の日付 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="recurring_day"
                        name="recurring_day"
                        value={formData.recurring_day || ''}
                        onChange={handleChange}
                        min="1"
                        max="31"
                        required={formData.recurring_type === 'monthly'}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="例: 15（15日）"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              to="/expenses"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? '保存中...' : isEditMode ? '更新する' : '保存する'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}; 