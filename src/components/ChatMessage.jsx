import { useTranslation } from 'react-i18next';
import { User, AlertTriangle, Clock, Zap } from 'lucide-react';
import { getUrgencyStyle, getUrgencyText } from '../utils/api';
import SunIcon from './SunIcon';

const ChatMessage = ({ message, isUser, isLoading = false }) => {
  const { t, i18n } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-start space-x-3 md:space-x-4">
        <div className="w-7 h-7 md:w-8 md:h-8 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
          <SunIcon className="w-3 h-3 md:w-4 md:h-4" color="#FFFFFF" />
        </div>
        <div className="bg-slate-800 text-white p-3 md:p-4 rounded-2xl rounded-tl-md max-w-xs md:max-w-2xl">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-xs md:text-sm text-white/80">{t('chat.analyzing')}</span>
          </div>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex items-start space-x-3 md:space-x-4 justify-end">
        <div className="bg-primary-600 text-white p-3 md:p-4 rounded-2xl rounded-tr-md max-w-xs md:max-w-2xl">
          <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
        </div>
        <div className="w-7 h-7 md:w-8 md:h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
        </div>
      </div>
    );
  }

  // AI Response - Enhanced Medical Analysis
  const response = message.data;
  const urgencyLevel = response?.urgencyAssessment?.level || response?.urgency; // Backward compatibility
  
  const urgencyIcon = {
    monitor_at_home: Clock,
    see_doctor_soon: AlertTriangle,
    emergency_care: Zap
  };

  const UrgencyIcon = urgencyIcon[urgencyLevel] || Clock;

  return (
    <div className="flex items-start space-x-3 md:space-x-4">
      <div className="w-7 h-7 md:w-8 md:h-8 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
        <SunIcon className="w-3 h-3 md:w-4 md:h-4" color="#FFFFFF" />
      </div>
      <div className="bg-slate-800 text-white p-4 md:p-6 rounded-2xl rounded-tl-md max-w-xs md:max-w-5xl flex-1">
        
        {/* Primary Analysis */}
        {response?.primaryAnalysis && (
          <div className="mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-accent-300 flex items-center">
              📋 Clinical Assessment
            </h3>
            <div className="bg-slate-700/40 p-3 md:p-4 rounded-lg border border-slate-600/30">
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-2 md:mb-3">
                <strong>Clinical Impression:</strong> {response.primaryAnalysis.clinicalImpression}
              </p>
              {response.primaryAnalysis.presentingSymptoms && (
                <div>
                  <p className="text-xs md:text-sm font-medium text-slate-200 mb-2">Key Symptoms Identified:</p>
                  <div className="flex flex-wrap gap-2">
                    {response.primaryAnalysis.presentingSymptoms.map((symptom, index) => (
                      <span key={index} className="px-2 py-1 bg-accent-500/20 text-accent-300 text-xs rounded-full">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Urgency Assessment */}
        {(response?.urgencyAssessment || response?.urgency) && (
          <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-xl border ${
            urgencyLevel === 'emergency_care' ? 'bg-red-500/20 border-red-400/30' :
            urgencyLevel === 'see_doctor_soon' ? 'bg-orange-500/20 border-orange-400/30' :
            'bg-green-500/20 border-green-400/30'
          }`}>
            <div className="flex items-center space-x-3 mb-2 md:mb-3">
              <UrgencyIcon className={`w-4 h-4 md:w-5 md:h-5 ${
                urgencyLevel === 'emergency_care' ? 'text-red-400' :
                urgencyLevel === 'see_doctor_soon' ? 'text-orange-400' :
                'text-green-400'
              }`} />
              <span className={`font-semibold text-sm md:text-base ${
                urgencyLevel === 'emergency_care' ? 'text-red-400' :
                urgencyLevel === 'see_doctor_soon' ? 'text-orange-400' :
                'text-green-400'
              }`}>
                {getUrgencyText(urgencyLevel, i18n.language)}
              </span>
            </div>
            {response?.urgencyAssessment && (
              <>
                <p className="text-xs md:text-sm text-slate-300 mb-2">
                  <strong>Reasoning:</strong> {response.urgencyAssessment.reasoning}
                </p>
                <p className="text-xs md:text-sm text-slate-300 mb-2">
                  <strong>Timeframe:</strong> {response.urgencyAssessment.timeframe}
                </p>
                {response.urgencyAssessment.redFlags && response.urgencyAssessment.redFlags.length > 0 && (
                  <div>
                    <p className="text-xs md:text-sm font-medium text-red-300 mb-1">⚠️ Warning Signs to Watch:</p>
                    <ul className="text-xs text-slate-300 ml-4">
                      {response.urgencyAssessment.redFlags.map((flag, index) => (
                        <li key={index} className="mb-1">• {flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Differential Diagnosis */}
        {response?.differentialDiagnosis && response.differentialDiagnosis.length > 0 && (
          <div className="mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-accent-300 flex items-center">
              🔍 Possible Conditions
            </h3>
            <div className="space-y-3">
              {response.differentialDiagnosis.map((condition, index) => (
                <div key={index} className="bg-slate-700/40 p-3 md:p-4 rounded-lg border border-slate-600/30">
                  <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                    <h4 className="font-medium text-white text-sm md:text-base">{condition.condition}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                      condition.likelihood === 'high' ? 'bg-red-500/20 text-red-300' :
                      condition.likelihood === 'moderate' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {condition.likelihood} likelihood
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-2">{condition.explanation}</p>
                  {condition.keyFeatures && condition.keyFeatures.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-400 mb-1">Supporting Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {condition.keyFeatures.map((feature, idx) => (
                          <span key={idx} className="px-1 py-0.5 bg-slate-600/30 text-slate-400 text-xs rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {response?.recommendations && (
          <div className="mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-accent-300 flex items-center">
              💡 Recommendations
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
              {response.recommendations.immediate && response.recommendations.immediate.length > 0 && (
                <div className="bg-slate-700/40 p-3 md:p-4 rounded-lg">
                  <h4 className="font-medium text-red-300 mb-2 text-sm md:text-base">🚨 Immediate Actions</h4>
                  <ul className="space-y-1">
                    {response.recommendations.immediate.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-xs md:text-sm text-slate-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {response.recommendations.monitoring && response.recommendations.monitoring.length > 0 && (
                <div className="bg-slate-700/40 p-3 md:p-4 rounded-lg">
                  <h4 className="font-medium text-orange-300 mb-2 text-sm md:text-base">👁️ Monitor For</h4>
                  <ul className="space-y-1">
                    {response.recommendations.monitoring.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-xs md:text-sm text-slate-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {response.recommendations.lifestyle && response.recommendations.lifestyle.length > 0 && (
                <div className="bg-slate-700/40 p-3 md:p-4 rounded-lg">
                  <h4 className="font-medium text-green-300 mb-2 text-sm md:text-base">🏠 Self-Care</h4>
                  <ul className="space-y-1">
                    {response.recommendations.lifestyle.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-xs md:text-sm text-slate-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {response.recommendations.followUp && response.recommendations.followUp.length > 0 && (
                <div className="bg-slate-700/40 p-3 md:p-4 rounded-lg">
                  <h4 className="font-medium text-blue-300 mb-2 text-sm md:text-base">📅 Follow-up</h4>
                  <ul className="space-y-1">
                    {response.recommendations.followUp.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-xs md:text-sm text-slate-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Specialist Referral */}
        {response?.specialistReferral && response.specialistReferral.recommended && (
          <div className="mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-accent-300 flex items-center">
              👨‍⚕️ Specialist Referral
            </h3>
            <div className="bg-blue-500/20 p-3 md:p-4 rounded-lg border border-blue-400/30">
              <p className="text-blue-300 font-medium mb-2 text-sm md:text-base">
                Recommended: {response.specialistReferral.specialty}
              </p>
              <p className="text-xs md:text-sm text-slate-300">
                {response.specialistReferral.reasoning}
              </p>
            </div>
          </div>
        )}

        {/* Educational Content */}
        {response?.educationalContent && (
          <div className="mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-accent-300 flex items-center">
              📚 Understanding Your Condition
            </h3>
            <div className="bg-slate-700/40 p-3 md:p-4 rounded-lg border border-slate-600/30 space-y-3">
              <div>
                <h4 className="font-medium text-slate-200 mb-1 text-sm md:text-base">Overview</h4>
                <p className="text-xs md:text-sm text-slate-300">{response.educationalContent.overview}</p>
              </div>
              {response.educationalContent.whatToExpected && (
                <div>
                  <h4 className="font-medium text-slate-200 mb-1 text-sm md:text-base">What to Expect</h4>
                  <p className="text-xs md:text-sm text-slate-300">{response.educationalContent.whatToExpected}</p>
                </div>
              )}
              {response.educationalContent.prevention && (
                <div>
                  <h4 className="font-medium text-slate-200 mb-1 text-sm md:text-base">Prevention</h4>
                  <p className="text-xs md:text-sm text-slate-300">{response.educationalContent.prevention}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Backward Compatibility - Old Format */}
        {!response?.primaryAnalysis && response?.conditions && response.conditions.length > 0 && (
          <div className="mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-accent-300">Possible Conditions</h3>
            <div className="space-y-3">
              {response.conditions.map((condition, index) => (
                <div key={index} className="bg-slate-700/40 p-3 md:p-4 rounded-lg border border-slate-600/30">
                  <h4 className="font-medium text-white mb-2 text-sm md:text-base">{condition.name}</h4>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{condition.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Old format doctor type */}
        {!response?.specialistReferral && response?.doctor_type && (
          <div className="mb-4 md:mb-6">
            <h4 className="font-semibold text-white mb-3 md:mb-4 text-base md:text-lg">Recommended Specialist</h4>
            <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-3 md:p-4">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                <span className="font-medium text-blue-300 text-sm md:text-base">{response.doctor_type}</span>
              </div>
            </div>
          </div>
        )}

        {/* Old format recommendations */}
        {!response?.recommendations?.immediate && response?.recommendations && Array.isArray(response.recommendations) && (
          <div className="mb-4 md:mb-6">
            <h4 className="font-semibold text-white mb-3 md:mb-4 text-base md:text-lg">Recommendations</h4>
            <ul className="space-y-2">
              {response.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-xs md:text-sm text-white/90 leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer */}
        {response?.disclaimer && (
          <div className="bg-amber-500/10 border border-amber-400/20 rounded-lg p-3 md:p-4 border-l-4 border-l-amber-400">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs md:text-sm font-semibold text-amber-300 block mb-1">Medical Disclaimer</span>
                <p className="text-xs md:text-sm text-amber-200/90 leading-relaxed">{response.disclaimer}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage; 