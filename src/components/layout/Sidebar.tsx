import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  HomeIcon,
  CurrencyYenIcon,
  ChartPieIcon,
  WalletIcon,
  DocumentTextIcon,
  CogIcon,
  BanknotesIcon,
  ListBulletIcon,
  BuildingStorefrontIcon,
  TagIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  subItems?: NavItem[];
}

const navigation: NavItem[] = [
  { name: 'ダッシュボード', path: '/dashboard', icon: HomeIcon },
  { 
    name: '支出管理', 
    path: '/expenses', 
    icon: CurrencyYenIcon,
    subItems: [
      { name: '支出一覧', path: '/expenses', icon: ListBulletIcon },
      { name: '店舗管理', path: '/expenses/shops', icon: BuildingStorefrontIcon },
      { name: 'カテゴリー管理', path: '/expenses/categories', icon: TagIcon },
      { name: '商品管理', path: '/expenses/items', icon: ShoppingBagIcon },
      // 以下は将来的に実装予定
      // { name: '決済方法設定', path: '/expenses/payment-methods', icon: CreditCardIcon },
    ]
  },
  { name: '収入管理', path: '/income', icon: BanknotesIcon },
  { name: '予算設定', path: '/budget', icon: WalletIcon },
  { name: 'レポート', path: '/reports', icon: ChartPieIcon },
  { name: '請求書・領収書', path: '/documents', icon: DocumentTextIcon },
  { name: '設定', path: '/settings', icon: CogIcon },
];

export const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const [activeParent, setActiveParent] = useState<string | null>(null);

  // 現在のパスに基づいて親メニューのアクティブ状態を設定
  useEffect(() => {
    for (const item of navigation) {
      if (
        location.pathname === item.path || 
        (item.subItems && item.subItems.some(subItem => location.pathname.startsWith(subItem.path)))
      ) {
        setActiveParent(item.name);
        return;
      }
    }
    setActiveParent(null);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (item: NavItem) => {
    if (isActive(item.path)) return true;
    return item.subItems?.some(subItem => location.pathname.startsWith(subItem.path)) ?? false;
  };

  const renderNavItem = (item: NavItem) => {
    const active = isParentActive(item);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const showSubItems = activeParent === item.name && hasSubItems;

    return (
      <div key={item.name}>
        <Link
          to={item.path}
          className={`${
            active
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
          onClick={() => {
            if (!hasSubItems) {
              setIsSidebarOpen(false);
            }
          }}
        >
          <item.icon
            className={`${
              active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
            } mr-3 flex-shrink-0 h-6 w-6`}
            aria-hidden="true"
          />
          {item.name}
        </Link>
        
        {showSubItems && (
          <div className="ml-8 mt-1 space-y-1">
            {item.subItems!.map((subItem) => (
              <Link
                key={subItem.name}
                to={subItem.path}
                className={`${
                  location.pathname === subItem.path
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <subItem.icon
                  className={`${
                    location.pathname === subItem.path ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 flex-shrink-0 h-5 w-5`}
                  aria-hidden="true"
                />
                {subItem.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* オーバーレイ */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* サイドバー */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out fixed w-64 h-[calc(100vh-4rem)] bg-white shadow-sm z-10 overflow-y-auto`}
      >
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map(renderNavItem)}
          </div>
        </nav>
      </aside>
    </>
  );
}; 