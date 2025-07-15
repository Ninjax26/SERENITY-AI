import React from "react";

interface ReplyItemProps {
  reply: {
    id: number;
    post_id: number;
    content: string;
    author: string;
    created_at: string;
  };
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply }) => {
  return (
    <div className="bg-muted dark:bg-gray-800 rounded p-2 text-sm text-foreground dark:text-gray-100">{reply.content}</div>
  );
};

export default ReplyItem; 
