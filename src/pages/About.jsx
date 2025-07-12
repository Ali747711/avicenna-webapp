const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-secondary-900 mb-6 text-center">
            About Avicenna
          </h1>
          <div className="card">
            <div className="card-body">
              <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
                Your Healthcare AI Companion
              </h2>
              <p className="text-secondary-600 mb-6">
                Avicenna is designed specifically for foreigners living in South Korea, 
                providing medically-informed symptom analysis in English, Korean, and Uzbek.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    🌍 Multilingual Support
                  </h3>
                  <p className="text-secondary-600 text-sm">
                    Get help in English, Korean, or Uzbek language
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    🏥 Healthcare Guidance
                  </h3>
                  <p className="text-secondary-600 text-sm">
                    AI-powered symptom analysis and urgency assessment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About 