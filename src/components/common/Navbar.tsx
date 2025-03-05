import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-white shadow">
            <div className="container mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold text-primary">
                                SmartSpend
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/expenses"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-primary text-sm font-medium text-gray-900"
                            >
                                支出管理
                            </Link>
                            <Link
                                to="/budgets"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            >
                                予算設定
                            </Link>
                            <Link
                                to="/reports"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            >
                                レポート
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <Link
                            to="/profile"
                            className="text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                            プロフィール
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
} 