import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, MessageCircle, Globe, Shield } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-secondary-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-display font-bold text-secondary-900">
                {t('home.title')}
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-secondary-600 hover:text-primary-600 font-medium">
                  {t('nav.home')}
                </Link>
                <Link to="/about" className="text-secondary-600 hover:text-primary-600 font-medium">
                  {t('nav.about')}
                </Link>
              </nav>
              <LanguageSelector />
              <Link to="/auth" className="btn-secondary">
                {t('nav.signIn')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-secondary-900 mb-6 animate-fade-in">
            {t('home.title')}
          </h1>
          <p className="text-xl md:text-2xl text-secondary-600 mb-4 animate-fade-in">
            {t('home.subtitle')}
          </p>
          <p className="text-lg text-secondary-500 mb-12 max-w-2xl mx-auto animate-fade-in">
            {t('home.description')}
          </p>
          
          <Link to="/chat" className="btn-primary text-lg px-8 py-4 animate-fade-in hover:scale-105 transition-transform">
            {t('home.cta')}
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card text-center animate-slide-up">
            <div className="card-body">
              <Globe className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                {t('home.features.multilingual.title')}
              </h3>
              <p className="text-secondary-600">
                {t('home.features.multilingual.description')}
              </p>
            </div>
          </div>
          
          <div className="card text-center animate-slide-up">
            <div className="card-body">
              <MessageCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                {t('home.features.ai.title')}
              </h3>
              <p className="text-secondary-600">
                {t('home.features.ai.description')}
              </p>
            </div>
          </div>
          
          <div className="card text-center animate-slide-up">
            <div className="card-body">
              <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                {t('home.features.privacy.title')}
              </h3>
              <p className="text-secondary-600">
                {t('home.features.privacy.description')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home 