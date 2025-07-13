import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Shield, Globe, Brain, Users, Heart, AlertTriangle, Menu, X } from 'lucide-react';
import { useState } from 'react';
import SunIcon from '../components/SunIcon';
import LanguageSelector from '../components/LanguageSelector';
import { useAuth } from '../contexts/FirebaseAuthContext';

const About = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, userProfile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900/90 via-blue-900/90 to-indigo-900/90 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        {/* Gradient overlays for depth */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/20 via-transparent to-accent-600/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent"></div>
        
        {/* Animated floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-400/20 rounded-full animate-float blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-accent-400/20 rounded-full animate-float blur-xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-blue-400/20 rounded-full animate-float blur-xl" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-green-400/20 rounded-full animate-float blur-xl" style={{ animationDelay: '6s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        
        {/* Medical cross pattern */}
        <div className="absolute top-1/4 right-1/4 opacity-5">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 2v20M2 12h20" />
          </svg>
        </div>
        <div className="absolute bottom-1/4 left-1/4 opacity-5">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 2v20M2 12h20" />
          </svg>
        </div>
      </div>

      {/* Enhanced Glassmorphism Header - Same as Home */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6">
        <div className="container mx-auto max-w-6xl">
          <nav className="navbar-glass rounded-full px-8 py-4 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
                <SunIcon className="w-8 h-8 drop-shadow-sm" color="#F59E0B" />
                <span className="text-xl font-display font-bold text-white drop-shadow-sm">
                  {t('home.title')}
                </span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link 
                  to="/" 
                  className="nav-link text-white/90 hover:text-white font-medium"
                >
                  {t('nav.home')}
                </Link>
                <Link 
                  to="/about" 
                  className="nav-link active text-white font-medium"
                >
                  {t('nav.about')}
                </Link>
                <div className="nav-item-wrapper">
                  <LanguageSelector />
                </div>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <div className="text-white/90 text-sm">
                      {t('common.hello')}, {userProfile?.name || user?.displayName || 'User'}
                    </div>
                    <Link 
                      to="/profile" 
                      className="nav-button bg-white/10 backdrop-blur-sm text-white border border-white/20 px-4 py-2 rounded-full hover:bg-white/20 hover:border-white/30 font-medium text-sm"
                    >
                      {t('common.profile')}
                    </Link>
                    <button 
                      onClick={signOut}
                      className="nav-button bg-white/10 backdrop-blur-sm text-white border border-white/20 px-4 py-2 rounded-full hover:bg-white/20 hover:border-white/30 font-medium text-sm"
                    >
                      {t('common.signOut')}
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/chat" 
                    className="nav-button bg-gradient-to-r from-accent-500 to-accent-600 text-white px-6 py-2.5 rounded-full font-medium"
                  >
                    Try Avicenna
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-3 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-white drop-shadow-sm" />
                ) : (
                  <Menu className="w-6 h-6 text-white drop-shadow-sm" />
                )}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden mt-6 pt-6 border-t border-white/20">
                <div className="flex flex-col space-y-4">
                  <Link 
                    to="/" 
                    className="text-white/90 hover:text-white font-medium transition-all duration-300 py-3 px-4 rounded-xl hover:bg-white/10 hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.home')}
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-white font-medium transition-all duration-300 py-3 px-4 rounded-xl bg-white/10 scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.about')}
                  </Link>
                  <div className="py-2 px-4">
                    <LanguageSelector />
                  </div>
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-white/90 text-sm">
                        {t('common.hello')}, {userProfile?.name || user?.displayName || 'User'}
                      </div>
                      <Link 
                        to="/profile" 
                        className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-3 rounded-full hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('common.profile')}
                      </Link>
                      <button 
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-3 rounded-full hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium text-center"
                      >
                        {t('common.signOut')}
                      </button>
                    </>
                  ) : (
                    <Link 
                      to="/chat" 
                      className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-6 py-3 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Try Avicenna
                    </Link>
                  )}
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section - adjusted for fixed navbar */}
      <section className="relative z-10 pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <SunIcon className="w-12 h-12" color="#FFFFFF" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
              About Avicenna
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Your trusted AI health companion, designed specifically for foreigners living in South Korea. 
              Get personalized symptom analysis in your preferred language.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative z-10 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="enhanced-glass-card rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 mb-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                {t('about.mission.title')}
              </h2>
              <p className="text-lg text-white/80 max-w-3xl mx-auto">
                {t('about.mission.description')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <Globe className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('about.values.multilingual.title')}</h3>
                <p className="text-white/70">
                  {t('about.values.multilingual.description')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <Brain className="w-8 h-8 text-accent-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('about.values.aiPowered.title')}</h3>
                <p className="text-white/70">
                  {t('about.values.aiPowered.description')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <Users className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('about.values.accessible.title')}</h3>
                <p className="text-white/70">
                  {t('about.values.accessible.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              How Avicenna Works
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Our AI technology combines advanced natural language processing with medical knowledge 
              to provide personalized health insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="enhanced-glass-card rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">1</span>
                </span>
                Symptom Analysis
              </h3>
              <p className="text-white/80 mb-4">
                Describe your symptoms in natural language. Our AI understands context, severity, 
                and associated factors to build a comprehensive picture of your health concern.
              </p>
              <ul className="text-sm text-white/70 space-y-1">
                <li>• Natural language processing in multiple languages</li>
                <li>• Pattern recognition and symptom correlation</li>
                <li>• Contextual understanding of medical terminology</li>
              </ul>
            </div>

            <div className="enhanced-glass-card rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">2</span>
                </span>
                Medical Insights
              </h3>
              <p className="text-white/80 mb-4">
                Get detailed analysis including possible conditions, urgency assessment, 
                and recommendations for next steps in your healthcare journey.
              </p>
              <ul className="text-sm text-white/70 space-y-1">
                <li>• Evidence-based condition suggestions</li>
                <li>• Urgency level assessment</li>
                <li>• Specialist doctor recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative z-10 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="enhanced-glass-card rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Built with Care
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto">
              Avicenna is developed by a dedicated team of AI researchers, medical professionals, 
              and international community advocates who understand the unique healthcare challenges 
              faced by foreigners in South Korea.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <strong className="text-white">AI Technology</strong>
                <p className="text-white/70 mt-1">
                  Powered by advanced language models trained on medical literature and multilingual datasets.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <strong className="text-white">Medical Expertise</strong>
                <p className="text-white/70 mt-1">
                  Validated by healthcare professionals to ensure accuracy and safety.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <strong className="text-white">Community Focus</strong>
                <p className="text-white/70 mt-1">
                  Designed specifically for the needs of international residents in South Korea.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Disclaimers */}
      <section className="relative z-10 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-amber-900/80 to-orange-900/80 backdrop-blur-sm border border-amber-500/30 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="flex items-start space-x-4 mb-6">
              <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-display font-bold text-amber-100 mb-4">
                  {t('about.disclaimer.title')}
                </h2>
                <div className="space-y-4 text-amber-200">
                  <p className="font-medium">
                    {t('about.disclaimer.substitute')}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <p><strong>{t('about.disclaimer.seekProfessional')}:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>{t('about.disclaimer.severeSymptoms')}</li>
                      <li>{t('about.disclaimer.emergencySymptoms')}</li>
                      <li>{t('about.disclaimer.chronicConditions')}</li>
                      <li>{t('about.disclaimer.medications')}</li>
                    </ul>
                  </div>
                  
                  <p className="text-sm">
                    <strong>{t('about.disclaimer.limitations')}:</strong> {t('about.disclaimer.generalInfo')}
                  </p>
                  
                  <p className="text-sm">
                    <strong>{t('about.disclaimer.emergencySituations')}:</strong> {t('about.disclaimer.emergencyContact')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="relative z-10 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="enhanced-glass-card rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">
                {t('about.privacy.title')}
              </h2>
              <p className="text-lg text-white/80">
                {t('about.privacy.description')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  {t('about.privacy.dataProtection.title')}
                </h3>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('about.privacy.dataProtection.noPersonal')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('about.privacy.dataProtection.encrypted')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('about.privacy.dataProtection.noAccount')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('about.privacy.dataProtection.anonymous')}
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  {t('about.privacy.yourControl.title')}
                </h3>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('about.privacy.yourControl.clearHistory')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('about.privacy.yourControl.preferredLanguage')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('about.privacy.yourControl.noAccount')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('about.privacy.yourControl.transparent')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="enhanced-glass-card rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              {t('about.cta.ready')}
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              {t('about.cta.personalized')} 
              {t('about.cta.symptomAnalysis')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/chat" 
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                {t('about.cta.startSymptomAnalysis')}
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <span className="text-white/60 text-sm">
                {t('about.cta.free')} • {t('about.cta.noRegistration')} • {t('about.cta.languages')}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About 