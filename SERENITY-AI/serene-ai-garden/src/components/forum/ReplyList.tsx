import React, { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import ReplyItem from "./ReplyItem";

interface Reply {
  id: number;
  post_id: number;
  content: string;
  author: string;
  created_at: string;
}

interface ReplyListProps {
  postId: number;
}

const ReplyList: React.FC<ReplyListProps> = ({ postId }) => {
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

  return (
    <div className="ml-4 mt-2 space-y-2">
      {replies.map(reply => (
        <ReplyItem key={reply.id} reply={reply} />
      ))}
    </div>
  );
};

export default ReplyList; 