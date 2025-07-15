import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Clock, X } from 'lucide-react';
import { useAuth } from '../contexts/FirebaseAuthContext';

const SessionWarning = () => {
  const { t } = useTranslation();
  const { sessionWarning, extendSession } = useAuth();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (sessionWarning) {
      setIsVisible(true);
      setTimeLeft(300); // Reset to 5 minutes
    } else {
      setIsVisible(false);
    }
  }, [sessionWarning]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  const handleExtendSession = () => {
    extendSession();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-amber-500/95 backdrop-blur-md border border-amber-400/30 rounded-xl p-4 shadow-lg animate-slide-in">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-200" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-amber-100">
                Session Expiring Soon
              </h3>
              <button
                onClick={handleDismiss}
                className="text-amber-300 hover:text-amber-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-amber-200/90 mb-3">
              Your session will expire in <span className="font-mono font-semibold">{formatTime(timeLeft)}</span> due to inactivity.
            </p>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-300" />
              <span className="text-xs text-amber-200/80">
                Click anywhere or use the app to stay logged in
              </span>
            </div>
            
            <div className="mt-3 flex space-x-2">
              <button
                onClick={handleExtendSession}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
              >
                Stay Logged In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionWarning; 