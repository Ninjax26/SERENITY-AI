import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PostItem from "./PostItem";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const posts = await supabaseService.getPosts();
      setPosts(posts);
    } catch (err) {
      setError("Failed to fetch posts");
      console.error("Post fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
        },
        () => fetchPosts()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No posts yet. Be the first to post!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="p-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-600 mb-2">{post.content}</div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>By {post.author}</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PostList;