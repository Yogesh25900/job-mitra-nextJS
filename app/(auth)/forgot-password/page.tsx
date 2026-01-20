export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we will send you a reset link.
        </p>
        <form className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Send reset link
          </button>
        </form>
      </div>
    </main>
  );
}
