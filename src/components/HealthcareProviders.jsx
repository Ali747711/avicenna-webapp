import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  Navigation, 
  Calendar,
  Shield,
  Languages,
  GraduationCap,
  Award
} from 'lucide-react';
import { getRecommendedProviders } from '../data/healthcareProviders';

const HealthcareProviders = ({ symptoms, conditions = [], urgency = 'see_doctor_soon' }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('emergency');
  const [expandedProvider, setExpandedProvider] = useState(null);

  // Get recommended providers based on symptoms and conditions
  const recommendations = getRecommendedProviders(symptoms, conditions, urgency);

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleDirections = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency_care':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'see_doctor_soon':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      default:
        return 'text-green-500 bg-green-500/10 border-green-500/20';
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case 'emergency_care':
        return '응급 치료 필요';
      case 'see_doctor_soon':
        return '빠른 의료 상담';
      default:
        return '가정에서 관찰';
    }
  };

  const renderProviderCard = (provider, category) => {
    const isExpanded = expandedProvider === provider.id;

    return (
      <div 
        key={provider.id}
        className="bg-slate-800/40 border border-white/10 rounded-xl p-4 hover:bg-slate-800/60 transition-all duration-200"
      >
        {/* Provider Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-white text-sm md:text-base mb-1">
              {provider.name}
            </h4>
            {provider.englishName && (
              <p className="text-slate-400 text-xs mb-1">
                {provider.englishName}
              </p>
            )}
            <p className="text-slate-400 text-xs md:text-sm mb-2">
              {provider.type}
            </p>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(provider.rating) ? 'text-yellow-400 fill-current' : 'text-slate-600'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400">
                {provider.rating} ({provider.distance})
              </span>
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setExpandedProvider(isExpanded ? null : provider.id)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg 
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Basic Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <MapPin className="w-3 h-3" />
            <div>
              <div>{provider.address}</div>
              {provider.englishAddress && (
                <div className="text-slate-400 text-xs">{provider.englishAddress}</div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <Clock className="w-3 h-3" />
            <span>{provider.hours}</span>
          </div>

          {provider.waitTime && (
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <Clock className="w-3 h-3" />
              <span>Wait time: {provider.waitTime}</span>
            </div>
          )}

          {provider.availability && (
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <Calendar className="w-3 h-3" />
              <span>{provider.availability}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mb-3">
          <button
            onClick={() => handleCall(provider.phone)}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1"
          >
            <Phone className="w-3 h-3" />
            <span>전화</span>
          </button>
          
          <button
            onClick={() => handleDirections(provider.address)}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1"
          >
            <Navigation className="w-3 h-3" />
            <span>길찾기</span>
          </button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-white/10 pt-3 space-y-3">
            {/* Specialties */}
            {provider.specialties && (
              <div>
                <h5 className="text-xs font-medium text-slate-300 mb-1">전문 분야</h5>
                <div className="flex flex-wrap gap-1">
                  {provider.specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Insurance */}
            {provider.insurance && (
              <div>
                <h5 className="text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>보험</span>
                </h5>
                <div className="flex flex-wrap gap-1">
                  {provider.insurance.map((ins, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                    >
                      {ins}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {provider.languages && (
              <div>
                <h5 className="text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1">
                  <Languages className="w-3 h-3" />
                  <span>언어</span>
                </h5>
                <div className="flex flex-wrap gap-1">
                  {provider.languages.map((lang, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Experience */}
            {(provider.education || provider.experience) && (
              <div>
                <h5 className="text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1">
                  <GraduationCap className="w-3 h-3" />
                  <span>학력 및 경력</span>
                </h5>
                <div className="space-y-1 text-xs text-slate-400">
                  {provider.education && (
                    <div>{provider.education}</div>
                  )}
                  {provider.experience && (
                    <div>{provider.experience} 경력</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Filter out empty categories
  const availableCategories = Object.entries(recommendations).filter(([key, providers]) => 
    providers && providers.length > 0
  );

  if (availableCategories.length === 0) {
    return (
      <div className="bg-slate-800/40 border border-white/10 rounded-xl p-6 text-center">
        <p className="text-slate-400 text-sm">
          No specific healthcare providers found for your symptoms. 
          Please consult with your primary care physician or local healthcare directory.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Award className="w-5 h-5 text-accent-400" />
          <span>추천 의료진</span>
        </h3>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(urgency)}`}>
          {getUrgencyText(urgency)}
        </div>
      </div>

      {/* Tabs for different provider types */}
      {availableCategories.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {availableCategories.map(([category, providers]) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {category === 'emergency' && '응급실'}
              {category === 'specialists' && '전문의'}
              {category === 'primaryCare' && '가정의학과'}
              {category === 'urgentCare' && '응급의료'}
              <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                {providers.length}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Provider Cards */}
      <div className="space-y-3">
        {availableCategories.map(([category, providers]) => (
          <div key={category} className={availableCategories.length === 1 ? '' : activeTab === category ? '' : 'hidden'}>
            {providers.map(provider => renderProviderCard(provider, category))}
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-400/20 rounded-lg p-3">
        <p className="text-xs text-amber-200">
          <strong>참고:</strong> 이 정보는 참고용입니다. 예약 전에 의료진 세부사항, 보험 수용 여부, 
          가용성을 확인하시기 바랍니다. 응급 상황에서는 즉시 119에 연락하세요.
        </p>
      </div>
    </div>
  );
};

export default HealthcareProviders; 