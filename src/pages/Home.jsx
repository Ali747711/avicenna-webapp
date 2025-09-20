import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Globe, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import LanguageSelector from '../components/LanguageSelector';
import SunIcon from '../components/SunIcon';
import heroImage from '../assets/icons/mind-hero.jpg';
import { useAuth } from '../contexts/FirebaseAuthContext';

const Home = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, userProfile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Enhanced Glassmorphism Header */}
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
                  className="nav-link active text-white font-medium"
                >
                  {t('nav.home')}
                </Link>
                <Link 
                  to="/about" 
                  className="nav-link text-white/90 hover:text-white font-medium"
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
                    to="/auth" 
                    className="nav-button bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-2.5 rounded-full hover:bg-white/20 hover:border-white/30 font-medium"
                  >
                    {t('nav.signIn')}
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-3 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation"
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
                <div className="flex flex-col space-y-3">
                  <Link 
                    to="/" 
                    className="mobile-btn text-white font-medium transition-all duration-300 py-4 px-4 rounded-xl bg-white/10 scale-105 touch-manipulation min-h-[48px] flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.home')}
                  </Link>
                  <Link 
                    to="/about" 
                    className="mobile-btn text-white/90 hover:text-white font-medium transition-all duration-300 py-4 px-4 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95 touch-manipulation min-h-[48px] flex items-center"
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
                        className="mobile-btn bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-4 rounded-full hover:bg-white/20 hover:border-white/30 hover:scale-105 active:scale-95 hover:shadow-lg transition-all duration-300 font-medium text-center min-h-[48px] flex items-center justify-center touch-manipulation"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('common.profile')}
                      </Link>
                      <button 
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="mobile-btn bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-4 rounded-full hover:bg-white/20 hover:border-white/30 hover:scale-105 active:scale-95 hover:shadow-lg transition-all duration-300 font-medium text-center min-h-[48px] flex items-center justify-center touch-manipulation"
                      >
                        {t('common.signOut')}
                      </button>
                    </>
                  ) : (
                    <Link 
                      to="/auth" 
                      className="mobile-btn bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-4 rounded-full hover:bg-white/20 hover:border-white/30 hover:scale-105 active:scale-95 hover:shadow-lg transition-all duration-300 font-medium text-center min-h-[48px] flex items-center justify-center touch-manipulation"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('nav.signIn')}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section - Mobile Optimized */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="AI Healthcare Background" 
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Mobile-optimized overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50 md:from-black/60 md:via-black/50 md:to-black/40"></div>
          {/* Additional overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 md:from-black/30 md:to-black/20"></div>
        </div>

        {/* Centered Hero Content */}
        <div className="relative z-10 text-center px-3 md:px-4 max-w-5xl mx-auto">
          {/* Hero Content */}
          <div className="space-y-4 md:space-y-6 lg:space-y-8 mobile-spacing">
            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight animate-fade-in mobile-text-2xl md:text-5xl">
              {t('home.hero.understandYour')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-600">
                {t('home.hero.symptoms')}
              </span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              {t('home.hero.withTrustedAI')}
            </h1>
            
            {/* Subtext */}
            <p className="text-sm md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto font-medium animate-slide-up delay-200 mobile-text-sm md:text-lg px-2 md:px-0">
              {t('home.hero.multilingualCompanion')}{' '}
              <span className="text-accent-300 font-semibold">{t('home.hero.english')}</span>,{' '}
              <span className="text-accent-300 font-semibold">{t('home.hero.korean')}</span>, and{' '}
              <span className="text-accent-300 font-semibold">{t('home.hero.uzbek')}</span>
              <br className="hidden md:block" />
              <span className="md:hidden"> — </span>
              <span className="hidden md:inline">— </span>{t('home.hero.designedFor')}
            </p>
            
            {/* CTA Button */}
            <div className="animate-fade-in delay-300 pt-2">
              <Link 
                to="/chat" 
                className="mobile-btn group inline-flex items-center justify-center px-6 py-4 md:px-8 md:py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold text-base md:text-lg rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 hover:from-yellow-300 hover:to-amber-400 min-h-[52px] touch-manipulation"
              >
                <span>{t('home.cta')}</span>
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 lg:gap-6 text-white/90 animate-fade-in delay-400 px-2">
              <div className="flex items-center space-x-1.5 md:space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-2.5 py-1.5 md:px-3 md:py-2">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-xs md:text-sm font-medium whitespace-nowrap">Free to use</span>
              </div>
              <div className="flex items-center space-x-1.5 md:space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-2.5 py-1.5 md:px-3 md:py-2">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-xs md:text-sm font-medium whitespace-nowrap">No registration required</span>
              </div>
              <div className="flex items-center space-x-1.5 md:space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-2.5 py-1.5 md:px-3 md:py-2">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs md:text-sm font-medium whitespace-nowrap">Privacy protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Why Choose Avicenna Section - Ultra Modern */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-800"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 via-transparent to-accent-500/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.1),transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(13,148,136,0.1),transparent_50%)]"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent-400/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary-400/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          {/* Hero Header */}
          <div className="text-center mb-20 md:mb-24">
            <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-md rounded-full text-white/90 text-sm font-medium mb-8 border border-white/10">
              <div className="w-2 h-2 bg-gradient-to-r from-accent-400 to-accent-600 rounded-full mr-3 animate-pulse"></div>
              Why Choose Avicenna
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-8 leading-[0.9] tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                {t('home.whyChoose.title')}
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed font-light">
              {t('home.whyChoose.subtitle')}
            </p>
          </div>

          {/* Premium Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
            {/* Card 1 - Multilingual */}
            <div className="group relative">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 via-accent-400 to-accent-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                
                {/* Main Card */}
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/20 hover:border-white/30 transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-3">
                  <div className="text-center">
                    {/* Icon Container */}
                    <div className="relative mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-accent-400 via-accent-500 to-accent-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl">
                        <Globe className="w-12 h-12 text-white drop-shadow-lg" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">3+</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent-300 transition-colors duration-300">
                        {t('home.features.multilingual.title')}
                      </h3>
                      <p className="text-white/70 leading-relaxed text-base group-hover:text-white/90 transition-colors duration-300">
                        {t('home.features.multilingual.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - AI Analysis */}
            <div className="group relative">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                
                {/* Main Card */}
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/20 hover:border-white/30 transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-3">
                  <div className="text-center">
                    {/* Icon Container */}
                    <div className="relative mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl">
                        <MessageCircle className="w-12 h-12 text-white drop-shadow-lg" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">AI</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-300 transition-colors duration-300">
                        {t('home.features.ai.title')}
                      </h3>
                      <p className="text-white/70 leading-relaxed text-base group-hover:text-white/90 transition-colors duration-300">
                        {t('home.features.ai.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - Privacy */}
            <div className="group relative">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-success-500 via-success-400 to-success-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                
                {/* Main Card */}
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/20 hover:border-white/30 transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-3">
                  <div className="text-center">
                    {/* Icon Container */}
                    <div className="relative mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-success-400 via-success-500 to-success-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl">
                        <Shield className="w-12 h-12 text-white drop-shadow-lg" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">100%</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-success-300 transition-colors duration-300">
                        {t('home.features.privacy.title')}
                      </h3>
                      <p className="text-white/70 leading-relaxed text-base group-hover:text-white/90 transition-colors duration-300">
                        {t('home.features.privacy.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Avicenna Works Section - Ultra Modern */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-primary-50"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-100/30 via-transparent to-accent-100/30"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(13,148,136,0.05),transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(245,158,11,0.05),transparent_50%)]"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-32 right-20 w-24 h-24 bg-primary-200/20 rounded-full blur-lg animate-float"></div>
        <div className="absolute bottom-32 left-20 w-32 h-32 bg-accent-200/20 rounded-full blur-lg animate-float" style={{animationDelay: '3s'}}></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          {/* Hero Header */}
          <div className="text-center mb-20 md:mb-24">
            <div className="inline-flex items-center px-6 py-3 bg-primary-100/50 backdrop-blur-md rounded-full text-primary-700 text-sm font-medium mb-8 border border-primary-200/50">
              <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mr-3 animate-pulse"></div>
              How It Works
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 mb-8 leading-[0.9] tracking-tight">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                {t('home.howItWorks.title')}
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>

          {/* Premium Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
            {/* Step 1 - Input Symptoms */}
            <div className="group relative">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                {/* Main Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-slate-200/50 hover:border-primary-300/50 transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-3 shadow-xl hover:shadow-2xl">
                  <div className="text-center">
                    {/* Step Number */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-lg font-bold text-white">1</span>
                    </div>
                    
                    {/* Icon Container */}
                    <div className="relative mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl">
                        <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-4">
                      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
                        Input
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary-700 transition-colors duration-300">
                        {t('home.howItWorks.step1.title')}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-base group-hover:text-slate-700 transition-colors duration-300">
                        {t('home.howItWorks.step1.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 - AI Analysis */}
            <div className="group relative">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 via-accent-400 to-accent-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                {/* Main Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-slate-200/50 hover:border-accent-300/50 transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-3 shadow-xl hover:shadow-2xl">
                  <div className="text-center">
                    {/* Step Number */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-lg font-bold text-white">2</span>
                    </div>
                    
                    {/* Icon Container */}
                    <div className="relative mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-accent-400 via-accent-500 to-accent-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl">
                        <MessageCircle className="w-12 h-12 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-4">
                      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-600 to-accent-700 bg-clip-text text-transparent mb-2">
                        Analyze
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-accent-700 transition-colors duration-300">
                        {t('home.howItWorks.step2.title')}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-base group-hover:text-slate-700 transition-colors duration-300">
                        {t('home.howItWorks.step2.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - Get Results */}
            <div className="group relative">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-success-500 via-success-400 to-success-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                {/* Main Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-slate-200/50 hover:border-success-300/50 transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-3 shadow-xl hover:shadow-2xl">
                  <div className="text-center">
                    {/* Step Number */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-lg font-bold text-white">3</span>
                    </div>
                    
                    {/* Icon Container */}
                    <div className="relative mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-success-400 via-success-500 to-success-600 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl">
                        <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-4">
                      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-success-600 to-success-700 bg-clip-text text-transparent mb-2">
                        Results
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-success-700 transition-colors duration-300">
                        {t('home.howItWorks.step3.title')}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-base group-hover:text-slate-700 transition-colors duration-300">
                        {t('home.howItWorks.step3.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              {t('home.ctaSection.ready')}
            </h2>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              {t('home.ctaSection.joinThousands')}
            </p>
            <Link 
              to="/chat" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:bg-primary-50"
            >
              {t('home.ctaSection.getStarted')}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 