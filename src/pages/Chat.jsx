import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, MessageCircle } from 'lucide-react';

const Chat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-secondary-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-secondary-600 hover:text-primary-600">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <Heart className="w-8 h-8 text-primary-600" />
                <span className="text-2xl font-display font-bold text-secondary-900">
                  Avicenna
                </span>
              </div>
            </div>
            <Link to="/auth" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
              Symptom Analysis Chat
            </h1>
            <p className="text-secondary-600">
              Describe your symptoms in your preferred language
            </p>
          </div>

          {/* Chat area will be implemented here */}
          <div className="card">
            <div className="card-body">
              <div className="min-h-[400px] bg-secondary-50 rounded-xl p-6 mb-6">
                <div className="text-center text-secondary-500 mt-32">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Chat interface will be implemented here</p>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <input 
                  type="text"
                  className="input-field flex-1"
                  placeholder="Describe your symptoms..."
                />
                <button className="btn-primary">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Chat 