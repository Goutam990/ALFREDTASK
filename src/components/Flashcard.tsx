import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import type { Flashcard as FlashcardType } from '../types/flashcard';
import { supabase } from '../lib/supabase';
import { addDays } from 'date-fns';

interface FlashcardProps {
  card: FlashcardType;
  onUpdate: () => void;
}

const boxIntervals = [1, 2, 5, 8, 14]; // Days until next review for each box

export function Flashcard({ card, onUpdate }: FlashcardProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleResponse = async (correct: boolean) => {
    const newBox = correct ? Math.min(card.box + 1, 5) : 1;
    const nextReview = addDays(new Date(), boxIntervals[newBox - 1]);

    const { error } = await supabase
      .from('flashcards')
      .update({
        box: newBox,
        next_review: nextReview.toISOString(),
        last_reviewed: new Date().toISOString(),
      })
      .eq('id', card.id);

    if (!error) {
      setShowAnswer(false);
      onUpdate();
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', card.id);

    if (!error) {
      onUpdate();
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="px-2 py-1 text-sm rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
          Box {card.box}
        </span>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="min-h-[100px] flex items-center justify-center">
        <p className="text-lg text-center text-gray-800 dark:text-gray-200">
          {showAnswer ? card.answer : card.question}
        </p>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Show Answer
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => handleResponse(false)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <ThumbsDown className="h-4 w-4" />
              Wrong
            </button>
            <button
              onClick={() => handleResponse(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <ThumbsUp className="h-4 w-4" />
              Correct
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}