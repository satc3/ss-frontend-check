import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';

interface DefaultLayoutProps {
  children?: React.ReactNode;
}

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-6">
        {children || <Outlet />}
      </main>
    </div>
  );
}; 