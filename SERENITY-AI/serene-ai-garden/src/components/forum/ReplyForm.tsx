import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

interface ReplyFormProps {
  postId: string;
  parentId?: string | null;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ postId, parentId = null }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("replies").insert({
      post_id: postId,
      content,
      author: "Anonymous",
      parent_id: parentId,
    });
    setLoading(false);
    if (error) {
      alert("Error replying: " + error.message);
    } else {
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <input
        className="w-full border rounded p-1 text-sm"
        type="text"
        placeholder={parentId ? "Write a nested reply..." : "Write a reply..."}
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        disabled={loading}
      />
      <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded text-xs mt-1" disabled={loading}>
        {loading ? "Replying..." : "Reply"}
      </button>
    </form>
  );
};

export default ReplyForm; 