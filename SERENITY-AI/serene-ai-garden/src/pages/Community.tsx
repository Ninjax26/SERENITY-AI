import React, { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  ChevronUp,
  MessageCircle,
  MoreHorizontal,
  Search,
  Settings,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import { useToast } from "@/hooks/use-toast";
import type { User, PostVoteRow, PostLikeRow } from "@/lib/types";
import Navigation from '../components/Navigation';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
}

const categories = [
  { name: "General Discussion", count: 1234, icon: MessageCircle, color: "bg-blue-500" },
  { name: "Help & Support", count: 567, icon: Users, color: "bg-green-500" },
  { name: "Feature Requests", count: 89, icon: Zap, color: "bg-purple-500" },
  { name: "Bug Reports", count: 45, icon: Settings, color: "bg-red-500" },
  { name: "Tutorials", count: 234, icon: BookOpen, color: "bg-orange-500" },
];

const CommunityForum: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [postVotes, setPostVotes] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const id = data.user?.id ?? null;
      setUser(data.user ?? null);
      setUserId(id);
      setAuthLoading(false);
      fetchPosts(id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPosts = useCallback(async (currentUserId: string | null) => {
    try {
      setIsLoading(true);
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (postsError) throw postsError;
      setPosts(postsData || []);

      if ((postsData || []).length > 0) {
        const voteQuery = supabase
          .from('post_votes')
          .select('post_id, user_id');
        if (currentUserId) voteQuery.eq('user_id', currentUserId);
        const { data: votes, error: votesError } = await voteQuery;
        if (votesError) throw votesError;

        const voteCounts: Record<string, number> = {};
        const voted: Record<string, boolean> = {};
        (votes as PostVoteRow[] | null)?.forEach((vote) => {
          voteCounts[vote.post_id] = (voteCounts[vote.post_id] || 0) + 1;
          if (currentUserId && vote.user_id === currentUserId) voted[vote.post_id] = true;
        });
        setPostVotes(voteCounts);
        setUserVoted(voted);
      }
    } catch {
      setError("Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) return;
    if (!userId) {
      setError("Please sign in to post.");
      return;
    }
    setPosting(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from('posts').insert({
        title,
        content,
        author: user?.user_metadata?.name || "Anonymous",
        user_id: userId,
      });
      if (insertError) throw insertError;
      setTitle("");
      setContent("");
      await fetchPosts(userId);
      toast({ title: "Posted!", description: "Your discussion has been published." });
    } catch {
      setError("Failed to create post. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const handleUpvote = async (postId: string) => {
    if (!userId) return;
    try {
      const { error: voteError } = await supabase.from('post_votes').insert({ post_id: postId, user_id: userId });
      if (voteError) throw voteError;
      await fetchPosts(userId);
    } catch {
      toast({ title: "Error", description: "Could not upvote this post.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Community Support Forum</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Categories</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${category.color}`} />
                      <category.icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <h3 className="font-semibold text-lg">Forum Stats</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Posts</span>
                  <span className="font-semibold">{posts.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Start a New Discussion</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Post title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  disabled={posting}
                />
                <Textarea
                  placeholder="Share your thoughts..."
                  className="min-h-[120px] resize-none"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  disabled={posting}
                />
                <div className="flex justify-between items-center">
                  <Badge variant="outline">General Discussion</Badge>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handlePost} disabled={posting}>
                    {posting ? "Posting..." : "Post to Forum"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  <strong>Error</strong>
                  <br />
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending
                </Button>
                <Button variant="outline" size="sm">Latest</Button>
              </div>
              <span className="text-sm text-gray-600">{posts.length} discussions</span>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center text-gray-500">Loading posts...</div>
              ) : (
                posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex space-x-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={"/placeholder.svg"} />
                          <AvatarFallback>{post.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg">{post.title}</h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span className="font-medium">{post.author}</span>
                                <span>•</span>
                                <span>{new Date(post.created_at).toLocaleString()}</span>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Star className="w-4 h-4 mr-2" />
                                  Save
                                </DropdownMenuItem>
                                <DropdownMenuItem>Report</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{post.content}</p>
                          <Button
                            variant={userVoted[post.id] ? "default" : "ghost"}
                            size="sm"
                            className={userVoted[post.id] ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}
                            onClick={() => handleUpvote(post.id)}
                            disabled={userVoted[post.id]}
                          >
                            <ChevronUp className="w-4 h-4 mr-1" />
                            {postVotes[post.id] || 0}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityForum;
