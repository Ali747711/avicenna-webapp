import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';

// Import pages
import Home from './pages/Home';
import Chat from './pages/Chat';
import About from './pages/About';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
