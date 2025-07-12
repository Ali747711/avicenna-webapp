import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, Mail, Calendar, Settings, Bell, Globe, Save, AlertCircle, CheckCircle, Edit3 } from 'lucide-react';
import { useAuth } from '../contexts/FirebaseAuthContext';
import SunIcon from '../components/SunIcon';

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, userProfile, updateProfile, signOut, isAuthenticated, isLoading } = useAuth();
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    language: 'en',
    notifications: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Initialize form data when user data loads
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        language: userProfile.preferences?.language || 'en',
        notifications: userProfile.preferences?.notifications || true
      });
    }
  }, [userProfile]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateProfile({
        name: formData.name,
        preferences: {
          language: formData.language,
          notifications: formData.notifications
        }
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setEditMode(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred while updating profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user || !userProfile) return null;

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
        <div className="flex items-center justify-between max-w-4xl mx-auto">
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
      <div className="relative z-10 px-3 md:px-4 pb-6 md:pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="enhanced-glass-card rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 md:space-x-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center shadow-2xl">
                  <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-display font-bold text-white mb-1 md:mb-2">
                    {userProfile.name || 'User'}
                  </h1>
                  <p className="text-white/70 text-sm md:text-lg">
                    Member since {formatDate(userProfile.createdAt?.toDate ? userProfile.createdAt.toDate() : userProfile.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className="mobile-btn flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-4 py-3 md:px-6 md:py-3 rounded-full hover:bg-white/20 hover:border-white/30 hover:scale-105 active:scale-95 transition-all duration-300 font-medium min-h-[48px] w-full md:w-auto"
              >
                <Edit3 className="w-4 h-4" />
                <span>{editMode ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
                message.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
                <p className={`text-sm ${message.type === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                  {message.text}
                </p>
              </div>
            )}

            {/* Profile Information */}
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Name Field */}
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
                      disabled={!editMode}
                      className={`mobile-form-input w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300 ${
                        !editMode ? 'opacity-60 cursor-not-allowed' : 'hover:border-white/30'
                      }`}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      autoCorrect="off"
                    />
                  </div>
                </div>

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
                      disabled={true}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 opacity-60 cursor-not-allowed"
                      placeholder="Email cannot be changed"
                    />
                  </div>
                  <p className="mt-1 text-xs text-white/50">
                    Contact support to change your email address
                  </p>
                </div>

                {/* Language Preference */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Preferred Language
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-white/50" />
                    </div>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      disabled={!editMode}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300 ${
                        !editMode ? 'opacity-60 cursor-not-allowed' : 'hover:border-white/30'
                      }`}
                    >
                      <option value="en" className="bg-gray-800 text-white">English</option>
                      <option value="ko" className="bg-gray-800 text-white">한국어</option>
                      <option value="uz" className="bg-gray-800 text-white">O'zbek</option>
                    </select>
                  </div>
                </div>

                {/* Member Since */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Member Since
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-white/50" />
                    </div>
                    <input
                      type="text"
                      value={formatDate(userProfile.createdAt?.toDate ? userProfile.createdAt.toDate() : userProfile.createdAt)}
                      disabled={true}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white opacity-60 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Preferences</h3>
                <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-white/70" />
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-white/60 text-sm">Receive health tips and updates</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleChange}
                      disabled={!editMode}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600 ${
                      !editMode ? 'opacity-60 cursor-not-allowed' : ''
                    }`}></div>
                  </label>
                </div>
              </div>

              {/* Save Button */}
              {editMode && (
                <div className="flex flex-col md:flex-row justify-end space-y-3 md:space-y-0 md:space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="mobile-btn px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 active:scale-95 transition-all duration-300 font-medium min-h-[48px] w-full md:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mobile-btn px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 min-h-[48px] w-full md:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Account Actions */}
          <div className="enhanced-glass-card rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20">
            <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 md:mb-6">Account Actions</h2>
            
            <div className="space-y-3 md:space-y-4">
              <Link
                to="/medical-history"
                className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Medical History</p>
                    <p className="text-white/60 text-sm">View your saved conversations and analyses</p>
                  </div>
                </div>
                <div className="w-6 h-6 text-white/40 group-hover:text-white/60 transition-colors">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              <Link
                to="/chat"
                className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <Settings className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Start Health Chat</p>
                    <p className="text-white/60 text-sm">Analyze your symptoms with AI</p>
                  </div>
                </div>
                <div className="w-6 h-6 text-white/40 group-hover:text-white/60 transition-colors">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-between p-4 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/40 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <ArrowLeft className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Sign Out</p>
                    <p className="text-white/60 text-sm">Sign out of your account</p>
                  </div>
                </div>
                <div className="w-6 h-6 text-white/40 group-hover:text-white/60 transition-colors">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 