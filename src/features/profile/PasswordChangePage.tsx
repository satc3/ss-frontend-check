import { PasswordChangeForm } from './components/PasswordChangeForm';

export const PasswordChangePage = () => {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              パスワードの変更
            </h2>
            <PasswordChangeForm />
          </div>
        </div>
      </div>
    </div>
  );
}; 