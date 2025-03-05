import { Outlet } from 'react-router-dom';
import { Logo } from '../../components/ui/Logo';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Logo className="h-12 mx-auto" />
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}; 