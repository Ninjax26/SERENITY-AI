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
    <div className="bg-gray-100 rounded p-2 text-sm">{reply.content}</div>
  );
};

export default ReplyItem; 