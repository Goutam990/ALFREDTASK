import React, { useEffect, useState } from 'react';
import { Moon, Sun, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from './lib/supabase';
import { FlashcardForm } from './components/FlashcardForm';
import { Flashcard as FlashcardComponent } from './components/Flashcard';
import type { Flashcard } from './types/flashcard';
import { Auth } from './components/Auth';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [dueCount, setDueCount] = useState(0);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchFlashcards = async () => {
    if (!session) return;

    const { data } = await supabase
      .from('flashcards')
      .select('*')
      .lte('next_review', new Date().toISOString())
      .order('box');

    if (data) {
      setFlashcards(data);
      setDueCount(data.length);
    }
  };

  useEffect(() => {
    if (session) {
      fetchFlashcards();
    }
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Leitner Flashcards
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
          <Auth />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Leitner Flashcards
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              <LogIn className="h-5 w-5" />
              Sign Out
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-6">
            <p className="text-blue-800 dark:text-blue-100">
              You have {dueCount} flashcard{dueCount !== 1 ? 's' : ''} due for review today
            </p>
          </div>

          <FlashcardForm onCardAdded={fetchFlashcards} />
        </motion.div>

        <div className="space-y-6">
          {flashcards.map((card) => (
            <FlashcardComponent
              key={card.id}
              card={card}
              onUpdate={fetchFlashcards}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;