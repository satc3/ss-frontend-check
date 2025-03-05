import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/ResetPasswordPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { AuthLayout } from './features/auth/AuthLayout';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { LandingPage } from './features/home/LandingPage';
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout';
import { Outlet } from 'react-router-dom';
import { PasswordChangePage } from './features/profile/PasswordChangePage';
import { ExpenseListPage } from './features/expense/pages/ExpenseListPage';
import { ExpenseDetailPage } from './features/expense/pages/ExpenseDetailPage';
import { ExpenseFormPage } from './features/expense/pages/ExpenseFormPage';
import { ShopListPage, ShopDetailPage, ShopFormPage } from './features/expense/pages/shop';
import { CategoryListPage, CategoryDetailPage, CategoryFormPage } from './features/expense/pages/category';
import { ItemListPage, ItemDetailPage, ItemFormPage } from './features/expense/pages/item';

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      // ランディングページ
      {
        index: true,
        element: <LandingPage />,
      },
      // 認証が不要なルート
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'register',
            element: <RegisterPage />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPasswordPage />,
          },
          {
            path: 'reset-password',
            element: <ResetPasswordPage />,
          },
        ],
      },
      // 認証が必要なルート
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AuthenticatedLayout>
              <Outlet />
            </AuthenticatedLayout>,
            children: [
              {
                path: 'dashboard',
                element: <DashboardPage />,
              },
              {
                path: 'profile',
                element: <ProfilePage />,
              },
              {
                path: 'settings/password',
                element: <PasswordChangePage />,
              },
              // 支出管理機能のルート
              {
                path: 'expenses',
                element: <ExpenseListPage />,
              },
              {
                path: 'expenses/create',
                element: <ExpenseFormPage />,
              },
              {
                path: 'expenses/:id',
                element: <ExpenseDetailPage />,
              },
              {
                path: 'expenses/:id/edit',
                element: <ExpenseFormPage />,
              },
              // 店舗管理機能のルート
              {
                path: 'expenses/shops',
                element: <ShopListPage />,
              },
              {
                path: 'expenses/shops/create',
                element: <ShopFormPage />,
              },
              {
                path: 'expenses/shops/:id',
                element: <ShopDetailPage />,
              },
              {
                path: 'expenses/shops/:id/edit',
                element: <ShopFormPage />,
              },
              // カテゴリー管理のルート
              {
                path: 'expenses/categories',
                element: <CategoryListPage />,
              },
              {
                path: 'expenses/categories/create',
                element: <CategoryFormPage />,
              },
              {
                path: 'expenses/categories/:id',
                element: <CategoryDetailPage />,
              },
              {
                path: 'expenses/categories/:id/edit',
                element: <CategoryFormPage />,
              },
              // 商品管理のルート
              {
                path: 'expenses/items',
                element: <ItemListPage />,
              },
              {
                path: 'expenses/items/create',
                element: <ItemFormPage />,
              },
              {
                path: 'expenses/items/:id',
                element: <ItemDetailPage />,
              },
              {
                path: 'expenses/items/:id/edit',
                element: <ItemFormPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]); 