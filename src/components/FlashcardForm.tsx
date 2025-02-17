import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { NewFlashcard } from '../types/flashcard';

interface FlashcardFormProps {
  onCardAdded: () => void;
}

export function FlashcardForm({ onCardAdded }: FlashcardFormProps) {
  const [newCard, setNewCard] = useState<NewFlashcard>({
    question: '',
    answer: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { error } = await supabase
      .from('flashcards')
      .insert([{
        ...newCard,
        user_id: user.id,
        box: 1,
        next_review: new Date().toISOString(),
      }]);

    if (!error) {
      setNewCard({ question: '', answer: '' });
      onCardAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Question
        </label>
        <input
          type="text"
          id="question"
          value={newCard.question}
          onChange={(e) => setNewCard(prev => ({ ...prev, question: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>
      <div>
        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Answer
        </label>
        <input
          type="text"
          id="answer"
          value={newCard.answer}
          onChange={(e) => setNewCard(prev => ({ ...prev, answer: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Flashcard
      </button>
    </form>
  );
}