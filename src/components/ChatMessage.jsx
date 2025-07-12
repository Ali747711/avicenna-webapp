import { useTranslation } from 'react-i18next';
import { User, AlertTriangle, Clock, Zap } from 'lucide-react';
import { getUrgencyStyle, getUrgencyText } from '../utils/api';
import SunIcon from './SunIcon';

const ChatMessage = ({ message, isUser, isLoading = false }) => {
  const { t, i18n } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-start space-x-2 md:space-x-4 animate-slide-in">
        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center shadow-soft">
          <SunIcon className="w-4 h-4 md:w-6 md:h-6" color="#F59E0B" />
        </div>
        <div className="glass-message-bubble ai-message p-3 md:p-4 max-w-xs md:max-w-2xl">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-xs md:text-sm text-secondary-600 font-medium">Analyzing...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex items-start space-x-2 md:space-x-4 justify-end animate-slide-in">
        <div className="glass-message-bubble user-message p-3 md:p-4 max-w-xs md:max-w-lg">
          <p className="text-xs md:text-sm text-white leading-relaxed">{message.content}</p>
        </div>
        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-soft">
          <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
      </div>
    );
  }

  // AI Response
  const response = message.data;
  const urgencyIcon = {
    monitor_at_home: Clock,
    see_doctor_soon: AlertTriangle,
    emergency_care: Zap
  };

  const UrgencyIcon = urgencyIcon[response?.urgency] || Clock;

  return (
    <div className="flex items-start space-x-2 md:space-x-4 animate-slide-in">
      <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center shadow-soft">
        <SunIcon className="w-4 h-4 md:w-6 md:h-6" color="#F59E0B" />
      </div>
      <div className="glass-message-bubble ai-message p-0 max-w-xs md:max-w-2xl overflow-hidden">
        {/* Urgency Level */}
        {response?.urgency && (
          <div className={`px-3 py-2 md:px-4 md:py-3 border-b border-white/20 flex items-center space-x-2 md:space-x-3 ${getUrgencyStyle(response.urgency)}`}>
            <UrgencyIcon className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-medium text-xs md:text-sm">
              {getUrgencyText(response.urgency, i18n.language)}
            </span>
          </div>
        )}
        
        <div className="p-3 md:p-4">
          {/* Conditions */}
          {response?.conditions && response.conditions.length > 0 && (
            <div className="mb-4 md:mb-6">
              <h4 className="font-semibold text-secondary-900 mb-2 md:mb-3 flex items-center text-sm md:text-base">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary-500 rounded-full mr-2"></span>
                Possible Conditions
              </h4>
              <div className="space-y-2 md:space-y-3">
                {response.conditions.map((condition, index) => (
                  <div key={index} className="condition-card bg-white/50 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 border border-white/30">
                    <h5 className="font-medium text-secondary-900 mb-1 md:mb-2 text-sm md:text-base">{condition.name}</h5>
                    <p className="text-xs md:text-sm text-secondary-700 leading-relaxed">{condition.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doctor Recommendation */}
          {response?.doctor_type && (
            <div className="mb-4 md:mb-6">
              <h4 className="font-semibold text-secondary-900 mb-2 md:mb-3 flex items-center text-sm md:text-base">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full mr-2"></span>
                Recommended Specialist
              </h4>
              <div className="doctor-card bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-lg md:rounded-xl p-3 md:p-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-blue-900 text-sm md:text-base">{response.doctor_type}</span>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {response?.recommendations && response.recommendations.length > 0 && (
            <div className="mb-4 md:mb-6">
              <h4 className="font-semibold text-secondary-900 mb-2 md:mb-3 flex items-center text-sm md:text-base">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full mr-2"></span>
                Recommendations
              </h4>
              <div className="space-y-1 md:space-y-2">
                {response.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2 md:space-x-3 p-1.5 md:p-2 rounded-lg hover:bg-white/30 transition-colors">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-green-500 rounded-full mt-1.5 md:mt-2 flex-shrink-0"></div>
                    <span className="text-xs md:text-sm text-secondary-700 leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          {response?.disclaimer && (
            <div className="disclaimer-card bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 rounded-lg md:rounded-xl p-3 md:p-4 border-l-2 md:border-l-4 border-l-amber-400">
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-500 rounded-full mt-1 md:mt-2 flex-shrink-0"></div>
                <div>
                  <span className="text-xs font-semibold text-amber-900 uppercase tracking-wide">Important:</span>
                  <p className="text-xs md:text-xs text-amber-800 mt-1 leading-relaxed">{response.disclaimer}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 