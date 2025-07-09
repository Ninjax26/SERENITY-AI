# SERENITY-AI: Advanced Mental Health & Wellness Platform
WEBSITE LINK:-https://serenityai-ten.vercel.app/

## 🌟 Project Overview

SERENITY-AI is a comprehensive mental health and wellness platform that combines artificial intelligence with human-centered design to provide personalized emotional support, mood tracking, journaling, and mindfulness tools. The platform is built with modern web technologies and focuses on creating a safe, secure, and supportive environment for users to manage their mental health.

## 🏗️ Architecture & Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom wellness themes
- **UI Components**: Radix UI primitives with shadcn/ui
- **Animation**: Framer Motion for smooth transitions
- **Routing**: React Router DOM

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase real-time subscriptions
- **File Storage**: Supabase Storage

### AI Integration
- **Primary AI**: Google Gemini AI (gemini-2.0-flash model)
- **Mood Detection**: AI-powered emotion analysis
- **Context-Aware Responses**: Conversational AI with memory

### Additional Features
- **Speech Recognition**: Web Speech API for voice input
- **Text-to-Speech**: Speech Synthesis API for AI responses
- **File Processing**: PDF parsing (pdf.js) and CSV handling (PapaParse)
- **Data Export**: PDF generation (jsPDF) and CSV export
- **Charts**: Recharts for data visualization

## 📁 Project Structure

```
SERENITY-AI/
├── package.json                 # Root dependencies
├── README.md                    # Project documentation
└── serene-ai-garden/           # Main application
    ├── src/
    │   ├── components/          # Reusable UI components
    │   │   ├── ui/             # shadcn/ui components
    │   │   ├── ChatInterface.tsx    # AI chat system
    │   │   ├── MoodTracker.tsx     # Mood monitoring
    │   │   ├── JournalInterface.tsx # Smart journaling
    │   │   ├── Mindfulness.tsx     # Meditation tools
    │   │   ├── Navigation.tsx      # App navigation
    │   │   ├── HeroSection.tsx     # Landing page hero
    │   │   ├── FeatureShowcase.tsx # Feature overview
    │   │   ├── Footer.tsx          # Site footer
    │   │   ├── DashboardOverview.tsx # Analytics dashboard
    │   │   └── forum/              # Community features
    │   │       ├── PostForm.tsx
    │   │       ├── PostList.tsx
    │   │       ├── ReplyForm.tsx
    │   │       └── ModerationTools.tsx
    │   ├── pages/              # Application pages
    │   │   ├── Index.tsx           # Main dashboard
    │   │   ├── About.tsx           # About page
    │   │   ├── AICompanion.tsx     # AI chat page
    │   │   ├── MoodTracking.tsx    # Mood tracking page
    │   │   ├── SmartJournaling.tsx # Journaling page
    │   │   ├── MindfulnessTools.tsx # Mindfulness page
    │   │   ├── WellnessInsights.tsx # Analytics page
    │   │   ├── Community.tsx       # Community forum
    │   │   ├── CrisisResources.tsx # Crisis support
    │   │   └── [additional pages]
    │   ├── components/serenity-game/ # Wellness games
    │   │   └── SERENITY-AI/
    │   │       ├── MemoryGame.tsx
    │   │       ├── WordleClone.tsx
    │   │       ├── TypeRacer.tsx
    │   │       ├── DrawPerfectCircle.tsx
    │   │       └── [other games]
    │   ├── hooks/              # Custom React hooks
    │   ├── lib/                # Utility functions
    │   ├── aii.tsx             # AI integration layer
    │   ├── supabaseClient.ts   # Database client
    │   └── main.tsx            # App entry point
    ├── public/                 # Static assets
    │   ├── Sounds/             # Audio files for mindfulness
    │   ├── serenity-logo.png   # App logo
    │   └── favicon.ico
    ├── package.json            # Dependencies & scripts
    ├── tailwind.config.ts      # Tailwind configuration
    ├── vite.config.ts          # Vite configuration
    └── tsconfig.json           # TypeScript configuration
```

## 🚀 Key Features

### 1. AI-Powered Chat Companion
- **Intelligent Conversations**: Context-aware responses using Google Gemini AI
- **Mood Detection**: Automatic emotion analysis from user messages
- **Voice Integration**: Speech-to-text input and text-to-speech output
- **File Import**: Support for PDF and CSV file processing
- **Data Export**: Export conversations as PDF or CSV
- **Privacy-First**: All conversations are encrypted and secure

### 2. Mood Tracking & Analytics
- **Daily Mood Logging**: Track emotional states over time
- **Visual Analytics**: Charts and graphs showing mood patterns
- **Trigger Identification**: Correlate mood changes with activities
- **Progress Monitoring**: Long-term emotional health insights
- **Personalized Recommendations**: AI-suggested interventions

### 3. Smart Journaling System
- **Guided Prompts**: AI-generated writing prompts
- **Emotional Analysis**: Sentiment analysis of journal entries
- **Pattern Recognition**: Identify recurring themes and emotions
- **Secure Storage**: End-to-end encrypted journal entries
- **Search & Filter**: Advanced search through journal history

### 4. Mindfulness & Meditation Tools
- **Guided Meditations**: Audio-guided meditation sessions
- **Breathing Exercises**: Interactive breathing guides
- **Ambient Sounds**: Nature sounds for relaxation
- **Progress Tracking**: Meditation streak and time tracking
- **Customizable Sessions**: Personalized meditation experiences

### 5. Community Support Forum
- **Anonymous Posting**: Share experiences without revealing identity
- **Peer Support**: Connect with others on similar journeys
- **Expert Moderation**: Professional oversight for safety
- **Resource Sharing**: Community-driven support resources
- **Crisis Detection**: AI-powered crisis intervention alerts

### 6. Wellness Games
- **Cognitive Training**: Memory and attention games
- **Stress Relief**: Relaxing interactive activities
- **Mindfulness Games**: Gamified meditation practices
- **Social Features**: Leaderboards and achievements
- **Therapeutic Benefits**: Evidence-based wellness activities

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google AI API key

### Environment Variables
Create a `.env` file in the `serene-ai-garden` directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ninjax26/SERENITY-AI.git
   cd SERENITY-AI
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Navigate to main application**
   ```bash
   cd serene-ai-garden
   ```

4. **Install application dependencies**
   ```bash
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

### Core Tables

#### Users (via Supabase Auth)
- Standard authentication with email/password
- Profile management
- Privacy settings

#### chat_messages
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'ai')),
  emotion VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### mood_entries
```sql
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  mood_label VARCHAR(50),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### journal_entries
```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title VARCHAR(200),
  content TEXT NOT NULL,
  sentiment_score DECIMAL(3,2),
  emotion_tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### mindfulness_sessions
```sql
CREATE TABLE mindfulness_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  session_type VARCHAR(50) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  completion_status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎨 Design System

### Color Palette
- **Primary (Serenity)**: Calming blues and teals
- **Secondary (Calm)**: Soft greens and nature tones
- **Wellness**: Warm, comforting earth tones
- **Accent**: Gentle purples and lavenders

### Typography
- **Headers**: Inter font family for clarity
- **Body**: System fonts for readability
- **Monospace**: Code blocks and data displays

### Animation Philosophy
- **Gentle Transitions**: Smooth, calming animations
- **Purposeful Motion**: Animations that guide user attention
- **Accessibility**: Reduced motion support for sensitive users

## 🔐 Security & Privacy

### Data Protection
- **Encryption**: All sensitive data encrypted at rest and in transit
- **Access Control**: Role-based permissions system
- **Audit Logging**: Complete audit trail for all actions
- **GDPR Compliance**: Full data portability and deletion rights

### Privacy Features
- **Anonymous Options**: Users can interact without personal data
- **Data Minimization**: Only collect necessary information
- **Consent Management**: Granular privacy controls
- **Secure Communication**: End-to-end encrypted messaging

## 🧪 Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Utility function testing with Jest
- AI integration testing with mocked responses

### Integration Tests
- End-to-end user workflows
- Database integration testing
- API integration testing

### Performance Testing
- Load testing for chat functionality
- Performance monitoring for AI responses
- Accessibility testing (WCAG compliance)

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
- Configure production environment variables
- Set up SSL certificates
- Configure CDN for static assets

### Recommended Hosting
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Supabase hosted or self-hosted
- **AI Services**: Google Cloud AI Platform

## 📊 Analytics & Monitoring

### User Analytics
- **Engagement Metrics**: Session duration, feature usage
- **Wellness Metrics**: Mood trends, journaling frequency
- **System Performance**: Response times, error rates

### Health Monitoring
- **Uptime Monitoring**: 99.9% availability target
- **Error Tracking**: Real-time error detection and alerting
- **Performance Metrics**: API response times, database queries

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Submit a pull request
5. Code review and approval
6. Merge to main branch

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

## 🆘 Crisis Support Integration

### Crisis Detection
- **AI Monitoring**: Automatic detection of crisis indicators
- **Escalation Protocols**: Immediate connection to professional help
- **Resource Directory**: 24/7 crisis hotlines and resources
- **Emergency Contacts**: Quick access to emergency services

### Professional Support
- **Therapist Directory**: Verified mental health professionals
- **Crisis Counselors**: Immediate professional intervention
- **Support Groups**: Peer-led support communities
- **Resource Library**: Evidence-based self-help resources

## 📱 Mobile Responsiveness

### Responsive Design
- **Mobile-First**: Designed for mobile devices primarily
- **Progressive Web App**: Offline capabilities and app-like experience
- **Touch Optimization**: Gesture-friendly interface
- **Cross-Platform**: Consistent experience across devices

## 🔄 API Documentation

### AI Integration Endpoints
- `POST /api/ai/chat` - Chat with AI companion
- `POST /api/ai/mood` - Mood detection from text
- `GET /api/ai/affirmation` - Daily affirmation generation

### Data Management
- `GET /api/mood/history` - Mood tracking history
- `POST /api/journal/entry` - Create journal entry
- `GET /api/mindfulness/sessions` - Meditation session history

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Core AI chat functionality
- ✅ Basic mood tracking
- ✅ Journal system
- ✅ Mindfulness tools

### Phase 2 (Upcoming)
- 🔄 Enhanced AI capabilities
- 🔄 Advanced analytics
- 🔄 Mobile app development
- 🔄 Professional therapist integration

### Phase 3 (Future)
- 🔜 Wearable device integration
- 🔜 Group therapy sessions
- 🔜 AI-powered therapy recommendations
- 🔜 Telehealth platform integration

## 📞 Support & Contact

### Community Support
- **GitHub Issues**: Report bugs and request features
- **Discord Server**: Community chat and support
- **Documentation**: Comprehensive guides and tutorials

### Professional Support
- **Email**: dhruvpatel8903@gmail.com 
- **Crisis Line**: 1800-599-0019 (24/7 support)
- **Professional Services**: Licensed therapist consultations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### Open Source Libraries
- React ecosystem and community
- Supabase for backend infrastructure
- Google AI for advanced language models
- Radix UI for accessible components

### Research & Inspiration
- Mental health research from leading institutions
- User experience studies in digital wellness
- Accessibility guidelines and best practices
- Evidence-based therapeutic approaches

---

**Built with ❤️ for mental health and wellness**

*SERENITY-AI is committed to making mental health support accessible, private, and effective for everyone.*
![image](https://github.com/user-attachments/assets/8899204e-9dca-44bc-8b79-c86cbde7d2f2)
![image](https://github.com/user-attachments/assets/02e79d7d-9edc-4faf-8489-c4a103cbec66)
![image](https://github.com/user-attachments/assets/69350669-bbed-4b41-b1b8-6ff709e9a4b7)
![image](https://github.com/user-attachments/assets/c99d71dd-2f01-4726-aaec-e102b95c3032)
![image](https://github.com/user-attachments/assets/8bcddbda-a449-4e87-b235-f6fc5da47344)




