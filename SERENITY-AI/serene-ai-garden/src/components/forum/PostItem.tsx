import React from "react";
import ReplyList from "./ReplyList";
import ReplyForm from "./ReplyForm";

interface PostItemProps {
  post: {
    id: number;
    content: string;
    author: string;
    created_at: string;
  };
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  return (
    <div className="border rounded p-4 bg-card dark:bg-gray-900 border-gray-200 dark:border-gray-700">
      <div className="mb-2 text-foreground dark:text-gray-100">{post.content}</div>
      <div className="text-xs text-gray-500 mb-2">Posted by {post.author}</div>
      <ReplyList postId={post.id} />
      <ReplyForm postId={post.id} />
    </div>
  );
};

export default PostItem; 
