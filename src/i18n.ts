import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 翻訳リソースの定義
const resources = {
  ja: {
    translation: {
      common: {
        loading: '読み込み中...',
        error: 'エラーが発生しました',
        retry: '再試行',
        save: '保存',
        cancel: 'キャンセル',
        delete: '削除',
        edit: '編集',
        create: '作成',
        submit: '送信',
        search: '検索',
        filter: 'フィルター',
        noData: 'データがありません',
        back: '戻る',
        close: '閉じる',
        more: 'もっと見る',
        yes: 'はい',
        no: 'いいえ',
        confirm: '確認',
      },
      validation: {
        required: '{{field}}は必須です',
        email: '有効なメールアドレスを入力してください',
        minLength: '{{field}}は{{min}}文字以上で入力してください',
        maxLength: '{{field}}は{{max}}文字以下で入力してください',
        min: '{{field}}は{{min}}以上で入力してください',
        max: '{{field}}は{{max}}以下で入力してください',
        pattern: '{{field}}の形式が正しくありません',
        passwordMatch: 'パスワードが一致しません',
      },
      auth: {
        login: {
          title: 'ログイン',
          subtitle: 'アカウントにログインしてください',
          email: 'メールアドレス',
          password: 'パスワード',
          submit: 'ログイン',
          forgotPassword: 'パスワードをお忘れですか？',
          createAccount: 'アカウント作成',
          rememberMe: 'ログイン状態を保持する',
          success: 'ログインに成功しました',
          error: 'ログインに失敗しました'
        },
        register: {
          title: 'アカウント作成',
          subtitle: '新しいアカウントを作成します',
          name: '名前',
          email: 'メールアドレス',
          password: 'パスワード',
          confirmPassword: 'パスワード（確認）',
          submit: '登録',
          haveAccount: 'すでにアカウントをお持ちですか？',
          success: 'アカウントが作成されました',
          error: 'アカウント作成に失敗しました'
        },
        forgotPassword: {
          title: 'パスワードをリセット',
          subtitle: 'パスワードリセット用のリンクを送信します',
          email: 'メールアドレス',
          submit: '送信',
          backToLogin: 'ログインに戻る',
          success: 'パスワードリセット用のリンクを送信しました',
          error: 'リンクの送信に失敗しました'
        },
        resetPassword: {
          title: '新しいパスワードを設定',
          password: '新しいパスワード',
          confirmPassword: '新しいパスワード（確認）',
          submit: 'パスワードを更新',
          success: 'パスワードが更新されました',
          error: 'パスワードの更新に失敗しました'
        },
        logout: {
          success: 'ログアウトしました',
          error: 'ログアウト中にエラーが発生しました'
        }
      },
      expense: {
        title: '支出',
        amount: '金額',
        date: '日付',
        category: 'カテゴリー',
        description: '説明',
        paymentMethod: '支払い方法',
        receipt: 'レシート',
        tags: 'タグ',
        shop: '店舗',
        list: {
          title: '支出一覧',
          create: '支出を追加',
          filter: '支出をフィルター',
          noData: '支出データがありません',
          total: '合計: {{amount}}円'
        },
        detail: {
          title: '支出詳細',
          edit: '支出を編集',
          delete: '支出を削除',
          deleteConfirm: 'この支出を削除してもよろしいですか？'
        },
        form: {
          title: '支出を{{action}}',
          success: '支出が{{action}}されました',
          error: '支出の{{action}}に失敗しました'
        }
      },
      income: {
        title: '収入',
        amount: '金額',
        date: '日付',
        category: 'カテゴリー',
        description: '説明',
        list: {
          title: '収入一覧',
          create: '収入を追加',
          filter: '収入をフィルター',
          noData: '収入データがありません',
          total: '合計: {{amount}}円'
        },
        detail: {
          title: '収入詳細',
          edit: '収入を編集',
          delete: '収入を削除',
          deleteConfirm: 'この収入を削除してもよろしいですか？'
        },
        form: {
          title: '収入を{{action}}',
          success: '収入が{{action}}されました',
          error: '収入の{{action}}に失敗しました'
        }
      },
      category: {
        title: 'カテゴリー',
        name: 'カテゴリー名',
        type: 'タイプ',
        icon: 'アイコン',
        color: '色',
        list: {
          title: 'カテゴリー一覧',
          create: 'カテゴリーを追加',
          noData: 'カテゴリーがありません'
        },
        form: {
          title: 'カテゴリーを{{action}}',
          success: 'カテゴリーが{{action}}されました',
          error: 'カテゴリーの{{action}}に失敗しました'
        }
      },
      report: {
        title: 'レポート',
        period: '期間',
        category: 'カテゴリー別',
        monthly: '月別',
        comparison: '比較',
        trend: 'トレンド',
        summary: '概要',
        income: '収入',
        expense: '支出',
        balance: '収支',
        noData: 'データがありません'
      },
      settings: {
        title: '設定',
        profile: 'プロフィール',
        account: 'アカウント',
        preferences: '環境設定',
        notifications: '通知',
        language: '言語',
        theme: 'テーマ',
        currency: '通貨',
        backup: 'バックアップ',
        form: {
          success: '設定が更新されました',
          error: '設定の更新に失敗しました'
        }
      }
    }
  },
  en: {
    translation: {
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        retry: 'Retry',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
        submit: 'Submit',
        search: 'Search',
        filter: 'Filter',
        noData: 'No data available',
        back: 'Back',
        close: 'Close',
        more: 'View More',
        yes: 'Yes',
        no: 'No',
        confirm: 'Confirm',
      },
      validation: {
        required: '{{field}} is required',
        email: 'Please enter a valid email address',
        minLength: '{{field}} must be at least {{min}} characters',
        maxLength: '{{field}} must be less than {{max}} characters',
        min: '{{field}} must be at least {{min}}',
        max: '{{field}} must be less than {{max}}',
        pattern: '{{field}} format is invalid',
        passwordMatch: 'Passwords do not match',
      },
      auth: {
        login: {
          title: 'Login',
          subtitle: 'Sign in to your account',
          email: 'Email',
          password: 'Password',
          submit: 'Sign in',
          forgotPassword: 'Forgot password?',
          createAccount: 'Create an account',
          rememberMe: 'Remember me',
          success: 'Login successful',
          error: 'Login failed'
        },
        register: {
          title: 'Create Account',
          subtitle: 'Register a new account',
          name: 'Name',
          email: 'Email',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          submit: 'Register',
          haveAccount: 'Already have an account?',
          success: 'Account created successfully',
          error: 'Failed to create account'
        },
        forgotPassword: {
          title: 'Reset Password',
          subtitle: 'We will send you a link to reset your password',
          email: 'Email',
          submit: 'Send Reset Link',
          backToLogin: 'Back to login',
          success: 'Password reset link sent',
          error: 'Failed to send reset link'
        },
        resetPassword: {
          title: 'Set New Password',
          password: 'New Password',
          confirmPassword: 'Confirm New Password',
          submit: 'Update Password',
          success: 'Password updated successfully',
          error: 'Failed to update password'
        },
        logout: {
          success: 'Logged out successfully',
          error: 'Error while logging out'
        }
      },
      expense: {
        title: 'Expense',
        amount: 'Amount',
        date: 'Date',
        category: 'Category',
        description: 'Description',
        paymentMethod: 'Payment Method',
        receipt: 'Receipt',
        tags: 'Tags',
        shop: 'Shop',
        list: {
          title: 'Expenses',
          create: 'Add Expense',
          filter: 'Filter Expenses',
          noData: 'No expenses found',
          total: 'Total: {{amount}}'
        },
        detail: {
          title: 'Expense Details',
          edit: 'Edit Expense',
          delete: 'Delete Expense',
          deleteConfirm: 'Are you sure you want to delete this expense?'
        },
        form: {
          title: '{{action}} Expense',
          success: 'Expense {{action}}d successfully',
          error: 'Failed to {{action}} expense'
        }
      },
      income: {
        title: 'Income',
        amount: 'Amount',
        date: 'Date',
        category: 'Category',
        description: 'Description',
        list: {
          title: 'Incomes',
          create: 'Add Income',
          filter: 'Filter Incomes',
          noData: 'No incomes found',
          total: 'Total: {{amount}}'
        },
        detail: {
          title: 'Income Details',
          edit: 'Edit Income',
          delete: 'Delete Income',
          deleteConfirm: 'Are you sure you want to delete this income?'
        },
        form: {
          title: '{{action}} Income',
          success: 'Income {{action}}d successfully',
          error: 'Failed to {{action}} income'
        }
      },
      category: {
        title: 'Category',
        name: 'Category Name',
        type: 'Type',
        icon: 'Icon',
        color: 'Color',
        list: {
          title: 'Categories',
          create: 'Add Category',
          noData: 'No categories found'
        },
        form: {
          title: '{{action}} Category',
          success: 'Category {{action}}d successfully',
          error: 'Failed to {{action}} category'
        }
      },
      report: {
        title: 'Reports',
        period: 'Period',
        category: 'By Category',
        monthly: 'Monthly',
        comparison: 'Comparison',
        trend: 'Trend',
        summary: 'Summary',
        income: 'Income',
        expense: 'Expense',
        balance: 'Balance',
        noData: 'No data available'
      },
      settings: {
        title: 'Settings',
        profile: 'Profile',
        account: 'Account',
        preferences: 'Preferences',
        notifications: 'Notifications',
        language: 'Language',
        theme: 'Theme',
        currency: 'Currency',
        backup: 'Backup',
        form: {
          success: 'Settings updated successfully',
          error: 'Failed to update settings'
        }
      }
    }
  }
};

// i18nの初期化
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ja', // デフォルト言語
    fallbackLng: 'ja', // フォールバック言語
    interpolation: {
      escapeValue: false, // ReactはXSS対策を行うため、エスケープ不要
    }
  });

export default i18n; 