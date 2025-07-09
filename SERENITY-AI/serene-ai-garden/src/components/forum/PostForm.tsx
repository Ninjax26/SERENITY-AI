import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabaseService } from "../../supabaseClient";
import type { User } from "../../supabaseClient";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

type PostFormData = z.infer<typeof postSchema>;

const PostForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await supabaseService.getCurrentUser();
        setUser(user);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user information");
      }
    };

    fetchUser();
  }, []);

  const onSubmit = async (data: PostFormData) => {
    if (!user) {
      setError("Please sign in to post");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const post = {
        title: data.title,
        content: data.content,
        author: user.user_metadata?.name || "Anonymous",
      };

      await supabaseService.createPost(post);
      reset();
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error("Post creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Please Sign In</AlertTitle>
        <AlertDescription>Please sign in to post in the community forum.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("title")}
              placeholder="Post title"
              className="w-full"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Textarea
              {...register("content")}
              placeholder="Share your thoughts..."
              className="w-full"
              rows={4}
              disabled={isLoading}
            />
            {errors.content && (
              <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Posting..." : "Post to Forum"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostForm;