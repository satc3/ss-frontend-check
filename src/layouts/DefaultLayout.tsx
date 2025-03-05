import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

export default function DefaultLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="py-6">
                <Outlet />
            </main>
        </div>
    );
} 