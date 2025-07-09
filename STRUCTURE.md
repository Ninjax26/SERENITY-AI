# SERENITY-AI Project Structure

This document provides a detailed breakdown of the project structure and organization.

## 🏗️ Root Directory Structure

```
SERENITY-AI/
├── README.md                    # Main project documentation
├── CONTRIBUTING.md              # Contribution guidelines
├── LICENSE                      # MIT License
├── STRUCTURE.md                 # This file - project structure details
├── package.json                 # Root package configuration
├── .git/                        # Git repository data
└── serene-ai-garden/           # Main React application
```

## 📱 Main Application (`serene-ai-garden/`)

### Configuration Files
```
serene-ai-garden/
├── package.json                 # Dependencies and scripts
├── package-lock.json           # Dependency lock file
├── tsconfig.json               # TypeScript configuration
├── tsconfig.app.json           # App-specific TypeScript config
├── tsconfig.node.json          # Node-specific TypeScript config
├── vite.config.ts              # Vite build configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── eslint.config.js            # ESLint configuration
├── components.json             # shadcn/ui components configuration
├── .env                        # Environment variables (local)
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── bun.lockb                   # Bun package manager lock file
└── index.html                  # HTML entry point
```

### Source Code (`src/`)

#### Core Files
```
src/
├── main.tsx                    # Application entry point
├── App.tsx                     # Main App component with routing
├── App.css                     # Global application styles
├── index.css                   # Base styles and Tailwind imports
├── vite-env.d.ts               # Vite type definitions
├── supabaseClient.ts           # Supabase database client configuration
└── aii.tsx                     # AI integration layer (Gemini AI)
```

#### Components Directory (`src/components/`)

##### Main Components
```
components/
├── Navigation.tsx              # Main navigation bar
├── HeroSection.tsx             # Landing page hero section
├── FeatureShowcase.tsx         # Feature overview section
├── Footer.tsx                  # Site footer
├── ChatInterface.tsx           # AI chat system
├── MoodTracker.tsx             # Mood tracking interface
├── JournalInterface.tsx        # Smart journaling system
├── Mindfulness.tsx             # Mindfulness and meditation tools
├── DashboardOverview.tsx       # Analytics dashboard
└── DailyQuote.tsx              # Daily inspirational quotes
```

##### Forum Components (`src/components/forum/`)
```
forum/
├── PostForm.tsx                # Create new forum posts
├── PostItem.tsx                # Individual post display
├── PostList.tsx                # List of forum posts
├── ReplyForm.tsx               # Reply to posts
├── ReplyItem.tsx               # Individual reply display
├── ReplyList.tsx               # List of replies
└── ModerationTools.tsx         # Moderation utilities
```

##### UI Components (`src/components/ui/`)
```
ui/
├── accordion.tsx               # Collapsible content sections
├── alert-dialog.tsx            # Modal alerts and confirmations
├── alert.tsx                   # Notification alerts
├── aspect-ratio.tsx            # Responsive aspect ratios
├── avatar.tsx                  # User profile pictures
├── badge.tsx                   # Status indicators and labels
├── breadcrumb.tsx              # Navigation breadcrumbs
├── button.tsx                  # Interactive buttons
├── calendar.tsx                # Date picker calendar
├── card.tsx                    # Content containers
├── carousel.tsx                # Image/content carousels
├── chart.tsx                   # Data visualization charts
├── checkbox.tsx                # Form checkboxes
├── collapsible.tsx             # Expandable content
├── command.tsx                 # Command palette
├── context-menu.tsx            # Right-click menus
├── dialog.tsx                  # Modal dialogs
├── drawer.tsx                  # Slide-out panels
├── dropdown-menu.tsx           # Dropdown selections
├── form.tsx                    # Form utilities
├── hover-card.tsx              # Hover popover cards
├── input.tsx                   # Text input fields
├── input-otp.tsx               # One-time password input
├── label.tsx                   # Form labels
├── menubar.tsx                 # Application menu bar
├── navigation-menu.tsx         # Site navigation
├── pagination.tsx              # Page navigation
├── popover.tsx                 # Floating content
├── progress.tsx                # Progress indicators
├── radio-group.tsx             # Radio button groups
├── resizable.tsx               # Resizable panels
├── scroll-area.tsx             # Custom scrollbars
├── select.tsx                  # Dropdown selections
├── separator.tsx               # Visual dividers
├── sheet.tsx                   # Side panels
├── sidebar.tsx                 # Application sidebar
├── skeleton.tsx                # Loading placeholders
├── slider.tsx                  # Range sliders
├── sonner.tsx                  # Toast notifications
├── switch.tsx                  # Toggle switches
├── table.tsx                   # Data tables
├── tabs.tsx                    # Tabbed interfaces
├── textarea.tsx                # Multi-line text input
├── toast.tsx                   # Toast notification system
├── toaster.tsx                 # Toast container
├── toggle.tsx                  # Toggle buttons
├── toggle-group.tsx            # Toggle button groups
├── tooltip.tsx                 # Hover tooltips
└── use-toast.ts                # Toast hook utility
```

##### Wellness Games (`src/components/serenity-game/`)
```
serenity-game/
├── package.json                # Game package configuration
├── tsconfig.json               # Game TypeScript config
├── public/
│   └── index.html              # Game entry HTML
└── src/
    └── SERENITY-AI/
        ├── AbsurdTrolleyProblems.tsx    # Ethical dilemma game
        ├── AmITheAsshole.tsx            # Social situation judgment
        ├── ClickTheColor.tsx            # Color reaction game
        ├── ColorBlindTest.tsx           # Color vision test
        ├── DrawPerfectCircle.tsx        # Drawing accuracy game
        ├── EndlessHorse.tsx             # Relaxation game
        ├── LifeStats.tsx                # Life statistics visualization
        ├── MemoryGame.tsx               # Memory training game
        ├── PasswordGame.tsx             # Password creation challenge
        ├── SpendBillGatesMoney.tsx      # Wealth simulation game
        ├── TypeRacer.tsx                # Typing speed game
        └── WordleClone.tsx              # Word guessing game
```

#### Pages Directory (`src/pages/`)
```
pages/
├── Index.tsx                   # Home/dashboard page
├── About.tsx                   # About the platform
├── AICompanion.tsx             # AI chat page
├── Blog.tsx                    # Blog/articles page
├── Careers.tsx                 # Career opportunities
├── Community.tsx               # Community forum
├── Contact.tsx                 # Contact information
├── CrisisResources.tsx         # Emergency resources
├── HelpCenter.tsx              # Support documentation
├── MindfulnessTools.tsx        # Mindfulness exercises
├── MoodTracking.tsx            # Mood tracking interface
├── NotFound.tsx                # 404 error page
├── Press.tsx                   # Press and media
├── PrivacyPolicy.tsx           # Privacy policy
├── SmartJournaling.tsx         # Journaling interface
├── Terms.tsx                   # Terms of service
└── WellnessInsights.tsx        # Analytics and insights
```

#### Utilities and Hooks (`src/lib/` & `src/hooks/`)
```
lib/
└── utils.ts                    # Utility functions

hooks/
├── use-mobile.tsx              # Mobile device detection
└── use-toast.ts                # Toast notification hook
```

### Static Assets (`public/`)
```
public/
├── favicon.ico                 # Site favicon
├── placeholder.svg             # Placeholder images
├── robots.txt                  # Search engine instructions
├── serenity-logo.png           # Application logo
└── Sounds/                     # Audio files for mindfulness
    ├── cinematic-intro-6097.mp3
    ├── flowing-water-345171.mp3
    ├── forestbirds-319791.mp3
    ├── loop-low-bass-lofi-style-groove-21589.mp3
    ├── nature-birds-singing-217212.mp3
    ├── soft-brown-noise-299934.mp3
    ├── soft-rain-with-crickets-and-forest-stream-364357.mp3
    ├── spring-339281.mp3
    ├── spring-forest-nature-332842.mp3
    ├── traffic-in-city-309236.mp3
    └── uplifting-pad-texture-113842.mp3
```

## 🔧 Key Technologies by Directory

### Frontend Framework & Build Tools
- **React 18.3.1**: Main UI framework
- **TypeScript**: Type safety and development experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first styling

### UI Components & Design System
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

### State Management & Data Fetching
- **React Query (TanStack)**: Server state management
- **React Hook Form**: Form state management
- **Zustand**: Client state management (if needed)

### Backend & Database
- **Supabase**: Backend-as-a-Service
- **PostgreSQL**: Database (via Supabase)
- **Supabase Auth**: Authentication system
- **Supabase Storage**: File storage

### AI & External Services
- **Google Gemini AI**: Conversational AI
- **Web Speech API**: Voice recognition
- **Speech Synthesis API**: Text-to-speech

### Development & Quality Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks
- **Conventional Commits**: Commit message standards

## 📊 Component Hierarchy

```
App.tsx
├── BrowserRouter
├── QueryClientProvider
├── TooltipProvider
├── Toaster Components
└── Routes
    ├── Index (/)
    │   ├── Navigation
    │   ├── HeroSection
    │   ├── FeatureShowcase
    │   ├── ChatInterface
    │   ├── MoodTracker
    │   ├── JournalInterface
    │   ├── DashboardOverview
    │   ├── Mindfulness
    │   └── Footer
    ├── About (/about)
    ├── AICompanion (/aicompanion)
    ├── Community (/community)
    │   ├── PostList
    │   ├── PostForm
    │   └── ModerationTools
    ├── MoodTracking (/moodtracking)
    ├── SmartJournaling (/smartjournaling)
    ├── WellnessInsights (/wellnessinsights)
    └── [Other Pages...]
```

## 🎯 Feature Organization

### Core Features
1. **AI Chat System** (`ChatInterface.tsx`, `aii.tsx`)
2. **Mood Tracking** (`MoodTracker.tsx`)
3. **Smart Journaling** (`JournalInterface.tsx`)
4. **Mindfulness Tools** (`Mindfulness.tsx`)
5. **Wellness Analytics** (`DashboardOverview.tsx`)

### Community Features
1. **Forum System** (`forum/` directory)
2. **User Profiles** (Integrated with Supabase Auth)
3. **Peer Support** (Community pages)

### Wellness Games
1. **Cognitive Training** (Memory games, puzzles)
2. **Stress Relief** (Relaxation games)
3. **Mindfulness Practice** (Breathing exercises)

### Support Features
1. **Crisis Resources** (`CrisisResources.tsx`)
2. **Help Center** (`HelpCenter.tsx`)
3. **Contact Support** (`Contact.tsx`)

## 🔒 Security & Privacy

### Data Protection
- Environment variables for sensitive configuration
- Supabase Row Level Security (RLS)
- Input sanitization and validation
- Secure authentication flows

### Privacy Features
- Anonymous chat options
- Data encryption at rest and in transit
- GDPR compliance features
- User data export capabilities

## 📈 Performance Optimization

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports for heavy features

### Caching Strategy
- React Query for server state caching
- Service worker for offline functionality
- CDN for static assets

### Bundle Optimization
- Tree shaking for unused code
- Minification and compression
- Image optimization
- Font optimization

## 🧪 Testing Structure

```
src/
├── __tests__/                  # Test files
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── utils/
├── __mocks__/                  # Mock files
└── test-utils/                 # Testing utilities
```

## 📝 Documentation Files

- `README.md`: Main project documentation
- `CONTRIBUTING.md`: Contribution guidelines
- `STRUCTURE.md`: This file - project structure
- `LICENSE`: MIT License
- `CHANGELOG.md`: Version history (to be created)
- `API.md`: API documentation (to be created)

---

This structure provides a scalable foundation for the SERENITY-AI platform while maintaining clear separation of concerns and following React/TypeScript best practices.
