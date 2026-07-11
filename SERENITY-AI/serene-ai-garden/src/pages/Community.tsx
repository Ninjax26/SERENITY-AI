import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUp,
  ChevronDown,
  Clock3,
  Flame,
  HeartHandshake,
  Loader2,
  MessageSquareText,
  PenLine,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Navigation from "../components/Navigation";
import { supabase } from "../supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { PostVoteRow, User } from "@/lib/types";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
}

type SortMode = "hot" | "new";

const formatRelativeTime = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SA";

const CommunityForum = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [votingPostId, setVotingPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("hot");
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [postVotes, setPostVotes] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const fetchPosts = useCallback(async (currentUserId: string | null) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (postsError) throw postsError;
      const nextPosts = (postsData || []) as Post[];
      setPosts(nextPosts);

      if (!nextPosts.length) {
        setPostVotes({});
        setUserVoted({});
        return;
      }

      const postIds = nextPosts.map((post) => post.id);
      const { data: votes, error: votesError } = await supabase
        .from("post_votes")
        .select("post_id, user_id")
        .in("post_id", postIds);

      if (votesError) {
        console.error("Posts loaded, but votes could not be loaded", votesError);
        setPostVotes({});
        setUserVoted({});
        return;
      }

      const voteCounts: Record<string, number> = {};
      const voted: Record<string, boolean> = {};
      (votes as PostVoteRow[] | null)?.forEach((vote) => {
        voteCounts[vote.post_id] = (voteCounts[vote.post_id] || 0) + 1;
        if (currentUserId && vote.user_id === currentUserId) voted[vote.post_id] = true;
      });
      setPostVotes(voteCounts);
      setUserVoted(voted);
    } catch (fetchError) {
      console.error("Failed to load community posts", fetchError);
      setError("We couldn't load community posts. Check the Supabase posts table and its access policies.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) return;
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      setUserId(currentUser?.id ?? null);
      setAuthLoading(false);
      if (sessionError) console.error("Could not restore the auth session", sessionError);
      fetchPosts(currentUser?.id ?? null);
    }).catch((sessionError) => {
      if (!mounted) return;
      console.error("Could not restore the auth session", sessionError);
      setAuthLoading(false);
      fetchPosts(null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setUserId(currentUser?.id ?? null);
      setAuthLoading(false);
      fetchPosts(currentUser?.id ?? null);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [fetchPosts]);

  const visiblePosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? posts.filter((post) =>
          `${post.title} ${post.content} ${post.author}`.toLowerCase().includes(query),
        )
      : [...posts];

    return filtered.sort((a, b) => {
      if (sortMode === "new") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      const voteDifference = (postVotes[b.id] || 0) - (postVotes[a.id] || 0);
      return voteDifference || new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [postVotes, posts, searchQuery, sortMode]);

  const handlePost = async () => {
    if (!userId) {
      setError("Please sign in before starting a discussion.");
      return;
    }
    if (!title.trim() || !content.trim()) {
      setError("Add both a title and some details before posting.");
      return;
    }

    setPosting(true);
    setError(null);
    try {
      const author =
        user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Anonymous";
      const { error: insertError } = await supabase.from("posts").insert({
        title: title.trim(),
        content: content.trim(),
        author,
        user_id: userId,
      });
      if (insertError) throw insertError;

      setTitle("");
      setContent("");
      setIsComposerOpen(false);
      setSortMode("new");
      await fetchPosts(userId);
      toast({ title: "Discussion posted", description: "Your post is now live in the community." });
    } catch (postError) {
      console.error("Failed to create community post", postError);
      setError("We couldn't publish your post. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const handleVote = async (postId: string) => {
    if (!userId) {
      setError("Please sign in to vote on discussions.");
      return;
    }

    const wasVoted = Boolean(userVoted[postId]);
    setVotingPostId(postId);
    setUserVoted((current) => ({ ...current, [postId]: !wasVoted }));
    setPostVotes((current) => ({
      ...current,
      [postId]: Math.max(0, (current[postId] || 0) + (wasVoted ? -1 : 1)),
    }));

    const request = wasVoted
      ? supabase.from("post_votes").delete().eq("post_id", postId).eq("user_id", userId)
      : supabase.from("post_votes").insert({ post_id: postId, user_id: userId });
    const { error: voteError } = await request;

    if (voteError) {
      setUserVoted((current) => ({ ...current, [postId]: wasVoted }));
      setPostVotes((current) => ({
        ...current,
        [postId]: Math.max(0, (current[postId] || 0) + (wasVoted ? 1 : -1)),
      }));
      toast({ title: "Vote not saved", description: "Please try again in a moment.", variant: "destructive" });
    }
    setVotingPostId(null);
  };

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Member";

  return (
    <div className="min-h-screen bg-[#f4f7f5] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navigation />

      <header className="relative overflow-hidden border-b border-emerald-950/10 bg-[#173f36] text-white">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_15%_20%,#8fe3bf_0,transparent_28%),radial-gradient(circle_at_85%_10%,#75bff2_0,transparent_26%)]" />
        <div className="relative mx-auto flex max-w-6xl items-end gap-5 px-4 py-8 sm:px-6 sm:py-10">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-xl backdrop-blur sm:h-20 sm:w-20">
            <HeartHandshake className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
          <div className="min-w-0 pb-1">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Peer support community
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">Serenity Circle</h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-emerald-50/80 sm:text-base">
              A kind corner to ask questions, share small wins, and feel less alone.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 py-5 sm:px-6 sm:py-7">
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="min-w-0 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex gap-3">
                <Avatar className="mt-0.5 h-9 w-9 border border-slate-200 dark:border-slate-700">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                  <AvatarFallback className="bg-emerald-100 text-xs font-bold text-emerald-800">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(true)}
                  className="flex h-10 flex-1 items-center rounded-full border border-slate-200 bg-slate-50 px-4 text-left text-sm text-slate-500 transition hover:border-emerald-400 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-emerald-600"
                >
                  {userId ? "Share something with the community..." : "Sign in to start a discussion"}
                </button>
                <Button
                  onClick={() => setIsComposerOpen(true)}
                  className="hidden rounded-full bg-emerald-700 px-5 hover:bg-emerald-800 sm:inline-flex"
                >
                  <PenLine className="mr-2 h-4 w-4" /> Post
                </Button>
              </div>

              {isComposerOpen && (
                <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <Input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="A clear, helpful title"
                    maxLength={180}
                    disabled={posting || !userId}
                    className="mb-3 h-11 font-semibold"
                    autoFocus
                  />
                  <Textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="What’s on your mind? Add context so others can support you."
                    maxLength={5000}
                    disabled={posting || !userId}
                    className="min-h-32 resize-y"
                  />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">Be kind. Avoid sharing private identifying information.</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => setIsComposerOpen(false)} disabled={posting}>Cancel</Button>
                      <Button
                        onClick={handlePost}
                        disabled={posting || authLoading || !userId || !title.trim() || !content.trim()}
                        className="bg-emerald-700 hover:bg-emerald-800"
                      >
                        {posting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Publish post
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-start justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
                <span>{error}</span>
                <button type="button" className="font-bold" onClick={() => setError(null)} aria-label="Dismiss message">×</button>
              </div>
            )}

            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setSortMode("hot")}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${sortMode === "hot" ? "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  <Flame className="h-4 w-4" /> Hot
                </button>
                <button
                  type="button"
                  onClick={() => setSortMode("new")}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${sortMode === "new" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  <Clock3 className="h-4 w-4" /> New
                </button>
              </div>
              <div className="relative min-w-0 sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search discussions"
                  className="h-9 border-0 bg-slate-100 pl-9 shadow-none focus-visible:ring-1 dark:bg-slate-800"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3" aria-label="Loading discussions">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="h-44 animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
                ))}
              </div>
            ) : visiblePosts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                <MessageSquareText className="mx-auto h-10 w-10 text-emerald-600" />
                <h2 className="mt-4 text-lg font-bold">{searchQuery ? "No matching discussions" : "Be the first to post"}</h2>
                <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                  {searchQuery ? "Try a different search term." : "Start a thoughtful conversation and help this community grow."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {visiblePosts.map((post) => {
                  const voted = Boolean(userVoted[post.id]);
                  return (
                    <article key={post.id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
                      <div className="grid grid-cols-[48px_minmax(0,1fr)] sm:grid-cols-[58px_minmax(0,1fr)]">
                        <div className="flex flex-col items-center border-r border-slate-100 bg-slate-50/80 px-2 py-4 dark:border-slate-800 dark:bg-slate-950/50">
                          <button
                            type="button"
                            onClick={() => handleVote(post.id)}
                            disabled={votingPostId === post.id}
                            aria-label={voted ? "Remove upvote" : "Upvote post"}
                            className={`rounded-md p-1.5 transition ${voted ? "bg-orange-100 text-orange-600 dark:bg-orange-950" : "text-slate-400 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/40"}`}
                          >
                            <ArrowUp className="h-5 w-5" strokeWidth={voted ? 3 : 2} />
                          </button>
                          <span className={`mt-1 text-sm font-extrabold ${voted ? "text-orange-600" : "text-slate-700 dark:text-slate-200"}`}>
                            {postVotes[post.id] || 0}
                          </span>
                        </div>

                        <div className="min-w-0 p-4 sm:p-5">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-emerald-100 text-[9px] font-extrabold text-emerald-800">{getInitials(post.author)}</AvatarFallback>
                            </Avatar>
                            <span className="truncate font-semibold text-slate-700 dark:text-slate-300">{post.author}</span>
                            <span aria-hidden="true">•</span>
                            <time dateTime={post.created_at}>{formatRelativeTime(post.created_at)}</time>
                          </div>
                          <h2 className="mt-3 break-words text-lg font-bold leading-snug tracking-tight text-slate-900 dark:text-white sm:text-xl">{post.title}</h2>
                          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-[15px]">{post.content}</p>
                          <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500 dark:border-slate-800">
                            <span className="inline-flex items-center gap-1.5"><MessageSquareText className="h-4 w-4" /> Discussion</span>
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">Support</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="space-y-4 lg:sticky lg:top-20">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="bg-[#dff1e8] px-5 py-5 dark:bg-emerald-950/50">
                <Sparkles className="h-6 w-6 text-emerald-700 dark:text-emerald-300" />
                <h2 className="mt-3 font-serif text-xl font-bold">About this circle</h2>
              </div>
              <div className="p-5">
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  A moderated space for honest conversations about wellbeing, routines, and everyday life.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-1.5 text-lg font-extrabold"><MessageSquareText className="h-4 w-4 text-emerald-600" />{posts.length}</div>
                    <p className="text-xs text-slate-500">discussions</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-lg font-extrabold"><Users className="h-4 w-4 text-emerald-600" />Open</div>
                    <p className="text-xs text-slate-500">community</p>
                  </div>
                </div>
                <Button onClick={() => setIsComposerOpen(true)} className="mt-4 w-full rounded-full bg-emerald-700 hover:bg-emerald-800">
                  Create a post
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 font-bold"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Community guidelines</div>
              <ol className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex gap-3"><span className="font-bold text-emerald-700">1</span><span>Lead with kindness and assume good intent.</span></li>
                <li className="flex gap-3"><span className="font-bold text-emerald-700">2</span><span>Protect your privacy and others’ privacy.</span></li>
                <li className="flex gap-3"><span className="font-bold text-emerald-700">3</span><span>This space supports, but does not replace, professional care.</span></li>
              </ol>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CommunityForum;
