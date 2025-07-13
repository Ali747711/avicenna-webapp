import { useTranslation } from 'react-i18next';
import { User, AlertTriangle, Clock, Zap } from 'lucide-react';
import { getUrgencyStyle, getUrgencyText } from '../utils/api';
import SunIcon from './SunIcon';

const ChatMessage = ({ message, isUser, isLoading = false }) => {
  const { t, i18n } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-start space-x-4">
        <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
          <SunIcon className="w-4 h-4" color="#FFFFFF" />
        </div>
        <div className="bg-slate-800 text-white p-4 rounded-2xl rounded-tl-md max-w-xs md:max-w-2xl">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-sm text-white/80">Analyzing your symptoms...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex items-start space-x-4 justify-end">
        <div className="bg-primary-600 text-white p-4 rounded-2xl rounded-tr-md max-w-xs md:max-w-2xl">
          <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
        </div>
        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
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
    <div className="flex items-start space-x-4">
      <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
        <SunIcon className="w-4 h-4" color="#FFFFFF" />
      </div>
      <div className="bg-slate-800 text-white p-6 rounded-2xl rounded-tl-md max-w-xs md:max-w-4xl flex-1">
        {/* Urgency Level */}
        {response?.urgency && (
          <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
            response.urgency === 'emergency_care' ? 'bg-red-500/20 border border-red-400/30' :
            response.urgency === 'see_doctor_soon' ? 'bg-orange-500/20 border border-orange-400/30' :
            'bg-green-500/20 border border-green-400/30'
          }`}>
            <UrgencyIcon className={`w-5 h-5 ${
              response.urgency === 'emergency_care' ? 'text-red-400' :
              response.urgency === 'see_doctor_soon' ? 'text-orange-400' :
              'text-green-400'
            }`} />
            <span className={`font-semibold ${
              response.urgency === 'emergency_care' ? 'text-red-300' :
              response.urgency === 'see_doctor_soon' ? 'text-orange-300' :
              'text-green-300'
            }`}>
              {getUrgencyText(response.urgency, i18n.language)}
            </span>
          </div>
        )}
        
        {/* Conditions */}
        {response?.conditions && response.conditions.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-white mb-4 text-lg">Possible Conditions</h4>
            <div className="space-y-3">
              {response.conditions.map((condition, index) => (
                <div key={index} className="border-l-4 border-primary-400 pl-4 py-2">
                  <h5 className="font-medium text-white mb-1">{condition.name}</h5>
                  <p className="text-sm text-white/80 leading-relaxed">{condition.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctor Recommendation */}
        {response?.doctor_type && (
          <div className="mb-6">
            <h4 className="font-semibold text-white mb-4 text-lg">Recommended Specialist</h4>
            <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-blue-300">{response.doctor_type}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {response?.recommendations && response.recommendations.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-white mb-4 text-lg">Recommendations</h4>
            <ul className="space-y-2">
              {response.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-white/90 leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer */}
        {response?.disclaimer && (
          <div className="bg-amber-500/10 border border-amber-400/20 rounded-lg p-4 border-l-4 border-l-amber-400">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-semibold text-amber-300 block mb-1">Medical Disclaimer</span>
                <p className="text-sm text-amber-200/90 leading-relaxed">{response.disclaimer}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage; 