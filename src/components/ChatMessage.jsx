import { useTranslation } from 'react-i18next';
import { User, AlertTriangle, Clock, Zap } from 'lucide-react';
import { getUrgencyStyle, getUrgencyText } from '../utils/api';
import SunIcon from './SunIcon';

const ChatMessage = ({ message, isUser, isLoading = false }) => {
  const { t, i18n } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-start space-x-3 md:space-x-4 animate-slide-in">
        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-accent-400/20 to-accent-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-accent-400/30 shadow-2xl">
          <SunIcon className="w-5 h-5 md:w-6 md:h-6 animate-pulse" color="#F59E0B" />
        </div>
        <div className="enhanced-glass-card p-4 md:p-6 max-w-xs md:max-w-2xl rounded-2xl">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 bg-accent-400 rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2.5 h-2.5 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-sm md:text-base text-white/90 font-medium">Analyzing your symptoms...</span>
          </div>
          <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent-400 to-accent-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex items-start space-x-3 md:space-x-4 justify-end animate-slide-in">
        <div className="enhanced-glass-card bg-gradient-to-br from-primary-500/20 to-primary-600/20 border-primary-400/30 p-4 md:p-5 max-w-xs md:max-w-lg rounded-2xl ml-8 md:ml-16">
          <p className="text-sm md:text-base text-white leading-relaxed">{message.content}</p>
          <div className="mt-2 text-xs text-white/60 text-right">
            {new Date(message.timestamp).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-2xl border border-primary-400/30">
          <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
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
    <div className="flex items-start space-x-3 md:space-x-4 animate-slide-in">
      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-accent-400/20 to-accent-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-accent-400/30 shadow-2xl">
        <SunIcon className="w-5 h-5 md:w-6 md:h-6" color="#F59E0B" />
      </div>
      <div className="enhanced-glass-card p-0 max-w-xs md:max-w-2xl overflow-hidden rounded-2xl mr-8 md:mr-16">
        {/* Urgency Level */}
        {response?.urgency && (
          <div className={`px-4 py-3 md:px-6 md:py-4 border-b border-white/20 flex items-center space-x-3 md:space-x-4 ${
            response.urgency === 'emergency_care' ? 'bg-red-500/20 border-red-400/30' :
            response.urgency === 'see_doctor_soon' ? 'bg-orange-500/20 border-orange-400/30' :
            'bg-green-500/20 border-green-400/30'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              response.urgency === 'emergency_care' ? 'bg-red-400 animate-pulse' :
              response.urgency === 'see_doctor_soon' ? 'bg-orange-400' :
              'bg-green-400'
            }`}></div>
            <UrgencyIcon className={`w-5 h-5 ${
              response.urgency === 'emergency_care' ? 'text-red-400' :
              response.urgency === 'see_doctor_soon' ? 'text-orange-400' :
              'text-green-400'
            }`} />
            <span className={`font-semibold text-sm md:text-base ${
              response.urgency === 'emergency_care' ? 'text-red-200' :
              response.urgency === 'see_doctor_soon' ? 'text-orange-200' :
              'text-green-200'
            }`}>
              {getUrgencyText(response.urgency, i18n.language)}
            </span>
          </div>
        )}
        
        <div className="p-4 md:p-6">
          {/* Conditions */}
          {response?.conditions && response.conditions.length > 0 && (
            <div className="mb-5 md:mb-6">
              <h4 className="font-semibold text-white mb-3 md:mb-4 flex items-center text-sm md:text-base">
                <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-primary-400 rounded-full mr-3 animate-pulse"></span>
                Possible Conditions
              </h4>
              <div className="space-y-3 md:space-y-4">
                {response.conditions.map((condition, index) => (
                  <div key={index} className="condition-card bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <h5 className="font-semibold text-white mb-2 text-sm md:text-base">{condition.name}</h5>
                    <p className="text-xs md:text-sm text-white/80 leading-relaxed">{condition.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doctor Recommendation */}
          {response?.doctor_type && (
            <div className="mb-5 md:mb-6">
              <h4 className="font-semibold text-white mb-3 md:mb-4 flex items-center text-sm md:text-base">
                <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-blue-400 rounded-full mr-3 animate-pulse"></span>
                Recommended Specialist
              </h4>
              <div className="doctor-card bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4 md:p-5 hover:bg-blue-500/25 transition-all duration-300">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <span className="font-semibold text-blue-200 text-sm md:text-base block">{response.doctor_type}</span>
                    <span className="text-xs text-blue-300/80">Recommended by AI</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {response?.recommendations && response.recommendations.length > 0 && (
            <div className="mb-5 md:mb-6">
              <h4 className="font-semibold text-white mb-3 md:mb-4 flex items-center text-sm md:text-base">
                <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                Recommendations
              </h4>
              <div className="space-y-2 md:space-y-3">
                {response.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 md:space-x-4 p-3 md:p-4 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-xs md:text-sm text-white/90 leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          {response?.disclaimer && (
            <div className="disclaimer-card bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-xl p-4 md:p-5 border-l-4 border-l-amber-400">
              <div className="flex items-start space-x-3 md:space-x-4">
                <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-200 uppercase tracking-wide block mb-2">Medical Disclaimer</span>
                  <p className="text-xs md:text-sm text-amber-300/90 leading-relaxed">{response.disclaimer}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Timestamp */}
          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-white/50 text-right">
            AI Analysis • {new Date(message.timestamp).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 