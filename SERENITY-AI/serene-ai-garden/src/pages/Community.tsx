import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Bell,
  BookOpen,
  ChevronUp,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pin,
  Search,
  Settings,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import type { User } from "@supabase/supabase-js";

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
  const [userId, setUserId] = useState<string | null>(null);
  const [postVotes, setPostVotes] = useState<Record<string, number>>({});
  const [postLikes, setPostLikes] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<User | null>(null);
  const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({});

  // Fetch current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      console.log('Fetched user:', data.user);
      setUser(data.user || null);
      setUserId(data.user?.id || null);
    });
  }, []);

  // Fetch posts and votes/likes
  const fetchPosts = async () => {
    try {
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      console.log('Fetched posts:', posts, 'Error:', postsError);
      if (postsError) throw postsError;
      setPosts(posts || []);
      // Fetch votes and likes for all posts
      const postIds = (posts || []).map((p: any) => p.id);
      if (postIds.length > 0) {
        // Upvotes
        const { data: votes, error: votesError } = await supabase
          .from('post_votes')
          .select('post_id, user_id');
        console.log('Fetched votes:', votes, 'Error:', votesError);
        const voteCounts: Record<string, number> = {};
        const voted: Record<string, boolean> = {};
        votes?.forEach((v: any) => {
          voteCounts[v.post_id] = (voteCounts[v.post_id] || 0) + 1;
          if (v.user_id === userId) voted[v.post_id] = true;
        });
        setPostVotes(voteCounts);
        setUserVoted(voted);
        // Likes
        const { data: likes, error: likesError } = await supabase
          .from('post_likes')
          .select('post_id, user_id');
        console.log('Fetched likes:', likes, 'Error:', likesError);
        const likeCounts: Record<string, number> = {};
        const liked: Record<string, boolean> = {};
        likes?.forEach((l: any) => {
          likeCounts[l.post_id] = (likeCounts[l.post_id] || 0) + 1;
          if (l.user_id === userId) liked[l.post_id] = true;
        });
        setPostLikes(likeCounts);
        setUserLiked(liked);
      }
    } catch (err) {
      setError("Failed to fetch posts");
      console.error("Post fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId !== undefined) fetchPosts();
    // eslint-disable-next-line
  }, [userId]);

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) return;
    setPosting(true);
    setError(null);
    try {
      console.log('Creating post:', { title, content, author: user?.user_metadata?.name || "Anonymous", user_id: userId });
      const { data, error } = await supabase.from('posts').insert({
        title,
        content,
        author: user?.user_metadata?.name || "Anonymous",
        user_id: userId,
      });
      console.log('Post insert result:', data, error);
      setTitle("");
      setContent("");
      fetchPosts();
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error("Post creation error:", err);
    } finally {
      setPosting(false);
    }
  };

  // Upvote a post
  const handleUpvote = async (postId: string) => {
    if (!userId) return;
    try {
      console.log('Upvoting post:', postId, 'by user:', userId);
      const { data, error } = await supabase.from('post_votes').insert({ post_id: postId, user_id: userId });
      console.log('Upvote result:', data, error);
      fetchPosts();
    } catch (err) {
      alert('Error upvoting post');
      console.error('Upvote error:', err);
    }
  };

  // Like a post (should be unused)
  const handleLike = async (postId: string) => {
    if (!userId) return;
    try {
      console.log('Liking post:', postId, 'by user:', userId);
      const { data, error } = await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
      console.log('Like result:', data, error);
      fetchPosts();
    } catch (err) {
      alert('Error liking post');
      console.error('Like error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Community Support Forum</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search discussions..." className="pl-10 w-64" />
              </div>
              {user ? (
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg?height=32&width=32"} />
                    <AvatarFallback>
                      {user.user_metadata?.name
                        ? user.user_metadata.name.split(" ").map(n => n[0]).join("").toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  {user.user_metadata?.name && (
                    <span className="ml-1 font-medium text-gray-800">{user.user_metadata.name}</span>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={async () => await supabase.auth.signInWithOAuth({ provider: 'google' })}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
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
                <div className="text-xs text-gray-400 mt-2">Categories will be updated in the future.</div>
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
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Solved Issues</span>
                  <span className="font-semibold">892</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Post Form */}
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
                  <div className="flex space-x-2">
                    <Badge variant="outline">General Discussion</Badge>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handlePost} disabled={posting}>
                    {posting ? "Posting..." : "Post to Forum"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  <strong>Error</strong>
                  <br />
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Filter and Sort */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending
                </Button>
                <Button variant="outline" size="sm">
                  Latest
                </Button>
                <Button variant="outline" size="sm">
                  Unanswered
                </Button>
              </div>
              <span className="text-sm text-gray-600">{posts.length} discussions</span>
            </div>

            {/* Posts List */}
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
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-lg hover:text-blue-600 cursor-pointer">{post.title}</h3>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span className="font-medium">{post.author}</span>
                                <span>•</span>
                                <span>{new Date(post.created_at).toLocaleString()}</span>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  General Discussion
                                </Badge>
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

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-4">
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
                              {/* Removed Like Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-blue-600"
                                onClick={() => setOpenReplies(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                              >
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Comments
                              </Button>
                            </div>
                          </div>
                          {openReplies[post.id] && (
                            <div className="mt-4">
                              <ReplyList postId={post.id} />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline">Load More Discussions</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityForum; 
