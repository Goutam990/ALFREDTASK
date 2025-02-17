/*
  # Create flashcards table for Leitner System

  1. New Tables
    - `flashcards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `question` (text)
      - `answer` (text)
      - `box` (integer) - Current Leitner box number (1-5)
      - `next_review` (timestamptz) - When this card should be reviewed next
      - `created_at` (timestamptz)
      - `last_reviewed` (timestamptz)

  2. Security
    - Enable RLS on `flashcards` table
    - Add policies for authenticated users to:
      - Read their own flashcards
      - Create new flashcards
      - Update their own flashcards
      - Delete their own flashcards
*/

CREATE TABLE flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  box integer NOT NULL DEFAULT 1 CHECK (box BETWEEN 1 AND 5),
  next_review timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  last_reviewed timestamptz
);

-- Enable RLS
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own flashcards"
  ON flashcards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create flashcards"
  ON flashcards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcards"
  ON flashcards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own flashcards"
  ON flashcards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);