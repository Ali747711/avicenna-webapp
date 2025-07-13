import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/FirebaseAuthContext';
import SunIcon from '../components/SunIcon';

const Auth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn, signUp, isLoading, error, clearError, isAuthenticated } = useAuth();
  
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when switching modes
  useEffect(() => {
    clearError();
    setFormErrors({});
  }, [mode, clearError]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        errors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
      }
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (mode === 'signup') {
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      let result;
      if (mode === 'signup') {
        result = await signUp(formData.email, formData.password, formData.name);
      } else {
        result = await signIn(formData.email, formData.password);
      }
      
      if (result.success) {
        navigate('/chat');
      }
    } catch (err) {
      console.error('Auth error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-indigo-900/95 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/20 via-transparent to-accent-600/20"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-400/20 rounded-full animate-float blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-accent-400/20 rounded-full animate-float blur-xl" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link 
            to="/" 
            className="text-white/80 hover:text-white transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center space-x-3">
            <SunIcon className="w-8 h-8 drop-shadow-lg" color="#F59E0B" />
            <span className="text-xl font-display font-bold text-white">
              {t('home.title')}
            </span>
          </div>
          <div className="w-10 h-10"></div> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-3 md:px-4 pb-6 md:pb-8 min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-md">
          <div className="enhanced-glass-card rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 overflow-hidden mobile-modal">
            {/* Mode Toggle */}
            <div className="p-6 pb-0">
              <div className="flex bg-white/10 backdrop-blur-sm rounded-2xl p-1 mb-8">
                <button
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    mode === 'signin'
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    mode === 'signup'
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 pt-0">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-display font-bold text-white mb-2">
                  {mode === 'signin' ? t('auth.title') : t('auth.joinTitle')}
                </h1>
                <p className="text-white/80">
                  {mode === 'signin' 
                    ? t('auth.description') 
                    : t('auth.joinDescription')
                  }
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field (Sign Up Only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-white/50" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`mobile-form-input w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300 ${
                          formErrors.name ? 'border-red-500' : 'border-white/20 hover:border-white/30'
                        }`}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        autoCorrect="off"
                      />
                    </div>
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>
                    )}
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-white/50" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`mobile-form-input w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300 ${
                        formErrors.email ? 'border-red-500' : 'border-white/20 hover:border-white/30'
                      }`}
                      placeholder="Enter your email"
                      autoComplete="email"
                      autoCorrect="off"
                      autoCapitalize="off"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white/50" />
                    </div>
                                          <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`mobile-form-input w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300 ${
                          formErrors.password ? 'border-red-500' : 'border-white/20 hover:border-white/30'
                        }`}
                        placeholder="Enter your password"
                        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('password')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-400">{formErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field (Sign Up Only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-white/50" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300 ${
                          formErrors.confirmPassword ? 'border-red-500' : 'border-white/20 hover:border-white/30'
                        }`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white/70 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-400">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="mobile-btn w-full py-4 px-6 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 min-h-[52px]"
                >
                  {isLoading || isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-base">{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-base">{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-white/60 text-sm">
                  {mode === 'signin' ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        onClick={() => setMode('signup')}
                        className="text-accent-400 hover:text-accent-300 font-medium transition-colors"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => setMode('signin')}
                        className="text-accent-400 hover:text-accent-300 font-medium transition-colors"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="mt-6 text-center">
            <p className="text-white/50 text-sm">
              Your privacy is important to us. Learn how we protect your data in our{' '}
              <Link to="/about" className="text-accent-400 hover:text-accent-300 transition-colors">
                About page
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth; 