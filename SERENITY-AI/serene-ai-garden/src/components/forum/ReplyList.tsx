import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import ReplyItem from "./ReplyItem";
import ReplyForm from "./ReplyForm";

interface Reply {
  id: string;
  post_id: string;
  content: string;
  author: string;
  created_at: string;
  parent_id?: string | null;
}

interface ReplyListProps {
  postId: string;
  parentId?: string | null;
}

function buildReplyTree(replies: Reply[], parentId: string | null = null): any[] {
  return replies
    .filter(r => r.parent_id === parentId)
    .map(r => ({ ...r, children: buildReplyTree(replies, r.id) }));
}

const ReplyThread: React.FC<{ reply: any; postId: string }> = ({ reply, postId }) => (
  <div style={{ marginLeft: reply.parent_id ? 24 : 0, marginTop: 8 }}>
    <ReplyItem reply={reply} />
    <ReplyForm postId={postId} parentId={reply.id as string} />
    {reply.children && reply.children.map((child: any) => (
      <ReplyThread key={child.id} reply={child} postId={postId} />
    ))}
  </div>
);

const ReplyList: React.FC<ReplyListProps> = ({ postId, parentId = null }) => {
  const [replies, setReplies] = useState<Reply[]>([]);

  useEffect(() => {
    const fetchReplies = async () => {
      const { data, error } = await supabase
        .from("replies")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      if (!error && data) setReplies(data);
    };
    fetchReplies();
    const subscription = supabase
      .channel('public:replies')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'replies' }, () => fetchReplies())
      .subscribe();
    return () => { subscription.unsubscribe(); };
  }, [postId]);

  // Ensure parentId is string | null for buildReplyTree
  const tree = buildReplyTree(replies, parentId === undefined ? null : parentId);

  return (
    <div className="ml-4 mt-2 space-y-2">
      {tree.map(reply => (
        <ReplyThread key={reply.id} reply={reply} postId={postId} />
      ))}
      {/* Top-level reply form only at root */}
      {parentId === null && <ReplyForm postId={postId} parentId={null} />}
    </div>
  );
};

export default ReplyList; 