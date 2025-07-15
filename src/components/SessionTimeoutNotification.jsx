import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/FirebaseAuthContext';
import { Link } from 'react-router-dom';

const SessionTimeoutNotification = () => {
  const { t } = useTranslation();
  const { sessionTimeout, clearError } = useAuth();

  if (!sessionTimeout) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="bg-red-500/95 backdrop-blur-md border border-red-400/30 rounded-xl p-4 shadow-lg animate-slide-in">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-200" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-red-100 mb-2">
              Session Expired
            </h3>
            
            <p className="text-xs text-red-200/90 mb-3">
              Your session has expired due to inactivity. Please sign in again to continue using the app.
            </p>
            
            <div className="flex space-x-2">
              <Link
                to="/auth"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1"
                onClick={clearError}
              >
                <LogIn className="w-3 h-3" />
                <span>Sign In</span>
              </Link>
              
              <button
                onClick={clearError}
                className="px-3 py-2 text-xs text-red-300 hover:text-red-100 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutNotification; 