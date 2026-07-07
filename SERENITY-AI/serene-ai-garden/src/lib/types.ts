import type { User } from '@supabase/supabase-js';

export type { User };

export interface ChatMessageRow {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  created_at: string;
  emotion?: string | null;
}

export interface MoodEntryRow {
  id: string;
  mood: number;
  emoji: string;
  note: string;
  created_at: string;
  factors?: string[] | null;
}

export interface PostVoteRow {
  post_id: string;
  user_id: string;
}

export interface PostLikeRow {
  post_id: string;
  user_id: string;
}

export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

export interface PdfTextItem {
  str: string;
}
