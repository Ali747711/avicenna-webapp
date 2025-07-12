import { useTranslation } from 'react-i18next';
import { User, Bot, AlertTriangle, Clock, Zap } from 'lucide-react';
import { getUrgencyStyle, getUrgencyText } from '../utils/api';

const ChatMessage = ({ message, isUser, isLoading = false }) => {
  const { t, i18n } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-start space-x-3 mb-6">
        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary-600" />
        </div>
        <div className="chat-bubble chat-bubble-ai p-4">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-secondary-500">Analyzing your symptoms...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex items-start space-x-3 mb-6 justify-end">
        <div className="chat-bubble chat-bubble-user p-4 max-w-md">
          <p className="text-sm">{message.content}</p>
        </div>
        <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
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
    <div className="flex items-start space-x-3 mb-6">
      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
        <Bot className="w-4 h-4 text-primary-600" />
      </div>
      <div className="chat-bubble chat-bubble-ai p-0 max-w-2xl">
        {/* Urgency Level */}
        {response?.urgency && (
          <div className={`px-4 py-2 border-b border-secondary-100 flex items-center space-x-2 ${getUrgencyStyle(response.urgency)}`}>
            <UrgencyIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              {getUrgencyText(response.urgency, i18n.language)}
            </span>
          </div>
        )}
        
        <div className="p-4">
          {/* Conditions */}
          {response?.conditions && response.conditions.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-secondary-900 mb-2">Possible Conditions:</h4>
              <div className="space-y-3">
                {response.conditions.map((condition, index) => (
                  <div key={index} className="bg-secondary-50 rounded-lg p-3">
                    <h5 className="font-medium text-secondary-900 mb-1">{condition.name}</h5>
                    <p className="text-sm text-secondary-600">{condition.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {response?.recommendations && response.recommendations.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-secondary-900 mb-2">Recommendations:</h4>
              <ul className="space-y-1">
                {response.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-secondary-600 flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          {response?.disclaimer && (
            <div className="text-xs text-secondary-500 bg-secondary-50 rounded-lg p-3 border-l-4 border-secondary-300">
              <strong>Important:</strong> {response.disclaimer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 