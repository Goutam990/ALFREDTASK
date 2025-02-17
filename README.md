# Leitner Flashcards

A modern web application for learning and memorization using the Leitner System, built with React, TypeScript, and Supabase.

## 🎯 Features

- **Leitner System Implementation**: Scientifically proven spaced repetition technique
- **User Authentication**: Secure email/password authentication
- **Dark Mode**: Comfortable studying in any lighting condition
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Enhanced user experience with Framer Motion
- **Real-time Updates**: Instant feedback on learning progress

## 🔧 Technology Stack

- **Frontend**:
  - React 18 with TypeScript
  - Tailwind CSS for styling
  - Framer Motion for animations
  - Lucide React for icons
  - Vite for development and building

- **Backend**:
  - Supabase for database and authentication
  - Row Level Security (RLS) for data protection
  - Real-time subscriptions capability

## 💭 Implementation Details

### Leitner System Logic

The application implements the Leitner System, a proven spaced repetition method:

1. All new flashcards start in Box 1
2. When answered correctly, cards move to the next box (up to Box 5)
3. When answered incorrectly, cards return to Box 1
4. Review intervals increase with each box:
   - Box 1: Review daily
   - Box 2: Review every 2 days
   - Box 3: Review every 5 days
   - Box 4: Review every 8 days
   - Box 5: Review every 14 days

### Database Schema

The database uses a simple but effective structure:

```sql
flashcards (
  id: uuid (primary key)
  user_id: uuid (foreign key to auth.users)
  question: text
  answer: text
  box: integer (1-5)
  next_review: timestamptz
  created_at: timestamptz
  last_reviewed: timestamptz
)
```

### Security

- Row Level Security (RLS) ensures users can only access their own flashcards
- Secure authentication through Supabase
- Protected API endpoints
- Data validation on both client and server

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leitner-flashcards
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🎨 Design Decisions

### User Interface
- **Minimalist Design**: Focuses on the learning experience without distractions
- **Dark Mode**: Reduces eye strain during night study sessions
- **Responsive Layout**: Adapts to different screen sizes
- **Smooth Animations**: Provides visual feedback and enhances engagement

### State Management
- **React Hooks**: Utilized for local state management
- **Supabase Real-time**: Handles data synchronization
- **Custom Hooks**: Encapsulates complex logic and promotes reusability

### Performance Optimizations
- **Lazy Loading**: Components load on demand
- **Memoization**: Prevents unnecessary re-renders
- **Efficient Data Fetching**: Only retrieves due flashcards
- **Optimistic Updates**: Immediate UI feedback before server confirmation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Sebastian Leitner's learning system
- Built with modern web technologies
- Powered by the Supabase platform