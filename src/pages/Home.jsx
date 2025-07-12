import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Globe, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import LanguageSelector from '../components/LanguageSelector';
import SunIcon from '../components/SunIcon';
import heroImage from '../assets/icons/mind-hero.jpg';

const Home = () => {
  const { t } = useTranslation();
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
                  className="nav-link text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 hover:drop-shadow-sm relative group"
                >
                  {t('nav.home')}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/about" 
                  className="nav-link text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 hover:drop-shadow-sm relative group"
                >
                  {t('nav.about')}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <div className="nav-item-wrapper">
                  <LanguageSelector />
                </div>
                <Link 
                  to="/auth" 
                  className="nav-button bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-2.5 rounded-full hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium"
                >
                  {t('nav.signIn')}
                </Link>
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
                    className="text-white/90 hover:text-white font-medium transition-all duration-300 py-3 px-4 rounded-xl hover:bg-white/10 hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.about')}
                  </Link>
                  <div className="py-2 px-4">
                    <LanguageSelector />
                  </div>
                  <Link 
                    to="/auth" 
                    className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-3 rounded-full hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.signIn')}
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section - Fullscreen Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="AI Healthcare Background" 
            className="w-full h-full object-cover"
          />
          {/* Darker overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/40"></div>
          {/* Additional overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20"></div>
        </div>

        {/* Centered Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Hero Content */}
          <div className="space-y-6 md:space-y-8">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight animate-fade-in">
              Understand your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-600">
                symptoms
              </span>
              <br />
              with trusted AI guidance
            </h1>
            
            {/* Subtext */}
            <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto font-medium animate-slide-up delay-200">
              Your multilingual health companion in{' '}
              <span className="text-accent-300 font-semibold">English</span>,{' '}
              <span className="text-accent-300 font-semibold">Korean</span>, and{' '}
              <span className="text-accent-300 font-semibold">Uzbek</span> —<br />
              designed for foreigners in South Korea.
            </p>
            
            {/* CTA Button */}
            <div className="animate-fade-in delay-300">
              <Link 
                to="/chat" 
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 hover:from-yellow-300 hover:to-amber-400 animate-pulse-glow"
              >
                <span>Start Symptom Analysis</span>
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-white/90 animate-fade-in delay-400">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Free to use</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">No registration required</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Privacy protected</span>
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

      {/* Features Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
              Why Choose Avicenna?
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Advanced AI technology meets multilingual healthcare support for better health decisions
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card text-center animate-slide-up hover:shadow-soft-lg transition-all duration-300 group">
              <div className="card-body">
                <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-200 transition-colors">
                  <Globe className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {t('home.features.multilingual.title')}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {t('home.features.multilingual.description')}
                </p>
              </div>
            </div>
            
            <div className="card text-center animate-slide-up hover:shadow-soft-lg transition-all duration-300 group">
              <div className="card-body">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                  <MessageCircle className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {t('home.features.ai.title')}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {t('home.features.ai.description')}
                </p>
              </div>
            </div>
            
            <div className="card text-center animate-slide-up hover:shadow-soft-lg transition-all duration-300 group">
              <div className="card-body">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {t('home.features.privacy.title')}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {t('home.features.privacy.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-secondary-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
              How Avicenna Works
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Simple, secure, and intelligent healthcare guidance in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Describe Your Symptoms
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Tell us about your health concerns in your preferred language - English, Korean, or Uzbek.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                AI Analysis
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Our advanced AI analyzes your symptoms and provides personalized health insights.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Get Recommendations
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Receive doctor recommendations and guidance on your next steps for better health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to understand your health better?
            </h2>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Join thousands of users who trust Avicenna for reliable health guidance. Start your free symptom analysis today.
            </p>
            <Link 
              to="/chat" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:bg-primary-50"
            >
              Get Started Now
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