import { createClient, type User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

type PostInsert = {
  title: string;
  content: string;
  author: string;
  user_id?: string | null;
};

type ReplyInsert = {
  post_id: string;
  content: string;
  author: string;
  parent_id?: string | null;
};

export const supabaseService = {
  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return data.user ?? null;
  },

  async getPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data ?? [];
  },

  async createPost(post: PostInsert) {
    const { data, error } = await supabase
      .from("posts")
      .insert(post)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async createReply(reply: ReplyInsert) {
    const { data, error } = await supabase
      .from("replies")
      .insert(reply)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },
};

export type { User };
