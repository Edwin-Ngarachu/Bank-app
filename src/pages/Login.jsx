import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      // Navigation is now handled by the useEffect above
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
      
      // Updated error codes (Firebase v9+ uses slightly different codes)
      if (err.code === 'auth/invalid-login-credentials') {
        errorMessage = 'Invalid email or password';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Account temporarily locked. Try again later or reset password';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 py-6 px-8 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-blue-100 mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 flex items-center">
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaEnvelope className="text-blue-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLock className="text-blue-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  minLength="6"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg font-medium text-white ${
                authLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } transition duration-200`}
            >
              {authLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-blue-800">
            Don't have an account?{' '}
            <a 
              href="/signup" 
              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate('/signup');
              }}
            >
              Create one
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}