import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/FirebaseAuthContext';
import './styles/App.css';

// Import pages
import Home from './pages/Home';
import Chat from './pages/Chat';
import About from './pages/About';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import MedicalHistory from './pages/MedicalHistory';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/medical-history" element={<MedicalHistory />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
