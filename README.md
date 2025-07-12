# Avicenna - Symptom Insight AI

A healthcare AI assistant designed for foreigners living in South Korea, providing symptom analysis in English, Korean, and Uzbek.

## 🏥 Features

- **Multilingual Support**: English, Korean, Uzbek
- **AI-Powered Analysis**: GPT-4 symptom analysis
- **Urgency Assessment**: Home monitoring, doctor visit, emergency care
- **Privacy First**: Optional account creation
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Vercel Functions
- **AI**: OpenAI GPT-4
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Deployment**: Vercel
- **Internationalization**: i18next

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+
- OpenAI API key
- Firebase project (optional, for auth/database)

### 1. Clone & Install
```bash
git clone <repository-url>
cd avicenna-webapp
npm install
```

### 2. Environment Variables
Create `.env.local` file:
```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration (optional)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Development Server
```bash
# Option 1: Frontend only (for UI development)
npm run dev

# Option 2: Full stack with Vercel Functions
vercel dev
```

## 📱 API Endpoints

### POST /api/analyze-symptoms
Analyze user symptoms and provide medical information.

**Request:**
```json
{
  "symptoms": "I have a headache and fever",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conditions": [
      {
        "name": "Common Cold",
        "explanation": "A viral infection affecting the nose and throat..."
      }
    ],
    "urgency": "monitor_at_home",
    "recommendations": ["Rest and drink plenty of fluids"],
    "disclaimer": "This is not a medical diagnosis..."
  }
}
```

## 🔧 Setup Services

### OpenAI API
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create API key
3. Add to environment variables

### Firebase (Optional)
1. Create Firebase project
2. Enable Authentication & Firestore
3. Add configuration to environment variables

### Vercel Deployment
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard

## 🌐 Deployment

### Automatic Deployment
Push to main branch for automatic deployment via Vercel.

### Manual Deployment
```bash
vercel --prod
```

### Environment Variables (Vercel)
Set these in your Vercel dashboard:
- `OPENAI_API_KEY`
- Firebase variables (if using auth/database)

## 📚 Project Structure

```
avicenna-webapp/
├── api/                    # Vercel Functions
│   └── analyze-symptoms.js
├── src/
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── styles/            # CSS files
│   └── utils/             # Utility functions
├── public/                # Static assets
├── vercel.json           # Vercel configuration
└── README.md
```

## 🎯 Usage

1. **Visit the app**: Open in browser
2. **Select language**: Choose English, Korean, or Uzbek
3. **Describe symptoms**: Type in natural language
4. **Get analysis**: AI-powered medical information
5. **Follow recommendations**: Home care, doctor visit, or emergency

## ⚠️ Medical Disclaimer

This application provides general medical information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details
