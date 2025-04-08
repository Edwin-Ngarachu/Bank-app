import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserShield, FaSpinner } from 'react-icons/fa';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { signup, currentUser, loading: authLoading } = useAuth();
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
      await signup(email, password, name, role);
      // Navigation is now handled by the useEffect above
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password must be at least 6 characters';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address';
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 py-6 px-8 text-center">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-blue-100 mt-1">Join our banking platform</p>
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
              <label className="block text-sm font-medium text-blue-800 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaUser className="text-blue-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                  required
                  minLength="2"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                />
              </div>
              <p className="mt-1 text-xs text-blue-500">At least 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Account Type</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaUserShield className="text-blue-400" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 appearance-none border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  required
                >
                  <option value="user">Regular User</option>
                  <option value="admin">Administrator</option>
                </select>
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
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-blue-800">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}