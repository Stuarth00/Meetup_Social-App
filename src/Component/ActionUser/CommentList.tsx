/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heart, MessageCircle, Forward, Smile } from "lucide-react";
import "../../index.css";
import type { Media, Like, PostComment } from "../../Types/Interafaces";
import { AppContext, type Action } from "../../Context/GlobalState";
import { useContext, useState } from "react";
import EmojiPicker from "../Elements/EmojiPicker";

function CommentList({
  likesCount,
  isLiked,
  post,
  handleClick,
  handleSharePost,
  dispatch,
  comments,
}: {
  likesCount: number;
  isLiked: boolean;
  post: {
    post_id?: string;
    author_id?: string;
    author_avatar?: string;
    author_first_name?: string;
    author_last_name?: string;
    description?: string;
    media?: Media[];
    likes?: Like[];
    comments?: PostComment[];
    created_at?: string;
  };
  handleClick: () => void;
  handleSharePost: () => void;
  dispatch: React.Dispatch<Action>;
  comments: PostComment[];
}) {
  const { addComment, handleNavigateToUserId } = useContext(AppContext);

  //Setting emojipicker
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get("comment") as string;
    const form = e.currentTarget;

    if (!text.trim() || !post.post_id) return;

    try {
      const newComment: PostComment = await addComment(post.post_id, text);
      console.log("New comment added:", newComment);
      dispatch({
        type: "ADD_COMMENT",
        payload: {
          post_id: post.post_id!,
          comment: newComment,
        },
      });
      form.reset();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const formattedDate = new Date(post.created_at || "").toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
    },
  );

  return (
    <div>
      <div className="w-full max-w-6xl h-[85vh] max-h-[750px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-[50%] h-1/2 md:h-full bg-black flex items-center justify-center relative select-none border-b md:border-b-0 md:border-r border-gray-100">
          <img
            src={
              post.media && post.media.length > 0
                ? post.media[0].content_url
                : ""
            }
            alt="Post content"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="w-full md:w-[50%] h-1/2 md:h-full flex flex-col bg-white min-w-0">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={post.author_avatar}
                className="w-9 h-9 rounded-full object-cover"
                alt=""
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-900">
                  {post.author_first_name} {post.author_last_name}
                </span>
                <span className="text-xs text-gray-400">Original Poster</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 bg-gray-50/50">
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100 min-w-0">
              <img
                src={post.author_avatar}
                className="w-8 h-8 rounded-full object-cover shrink-0"
                alt=""
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-800 leading-relaxed break-words">
                  <strong className="font-semibold mr-1.5">
                    {post.author_first_name}
                  </strong>
                  {post.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="gap-3 group min-w-0">
                {comments.map((comment) => (
                  <div
                    key={comment.comment_id}
                    className="flex items-start gap-3 min-w-0"
                  >
                    <img
                      src={comment.avatar}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                      alt=""
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-800 break-words leading-relaxed">
                        <strong
                          onClick={() =>
                            handleNavigateToUserId(comment.user_id || "")
                          }
                          className="font-semibold mr-1.5 cursor-pointer hover:underline"
                        >
                          {comment.username}
                        </strong>
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>2h</span>
                        <button className="font-semibold hover:text-gray-600">
                          Reply
                        </button>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 shrink-0">
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-4 bg-white shrink-0">
            <div className="flex items-center gap-5 mb-2">
              <button className="hover:scale-110 transition-transform">
                <Heart
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  className={
                    isLiked ? "fill-red-500 text-red-500" : "text-gray-700"
                  }
                />
              </button>
              <button className="hover:scale-110 transition-transform">
                <MessageCircle className="text-gray-700" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSharePost();
                }}
                className="hover:scale-110 transition-transform"
              >
                <Forward className="text-gray-700" />
              </button>
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {likesCount} likes
            </p>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {post.comments && post.comments.length > 0
                ? `${comments.length} comments`
                : "No comments yet"}
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
              {formattedDate}
            </p>
          </div>

          {/* Form to comment */}
          <div className="border-t border-gray-100 px-4 py-3 bg-white shrink-0">
            <form onSubmit={handleSubmit} className="flex items-start gap-3">
              {"  "}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 hover:text-gray-700 transition-colors hidden sm:block mt-1"
              >
                <Smile className="w-6 h-6" />
              </button>
              <textarea
                name="comment"
                id="comment"
                rows={3}
                className="flex-1 text-sm text-gray-800 focus:outline-none resize-none min-h-[24px] max-h-60 py-1 overflow-y-auto overflow-x-hidden w-full field-sizing-content"
                placeholder="Add a comment..."
              />
              <button
                type="submit"
                className="text-sm font-semibold text-blue-500 hover:text-blue-700 disabled:opacity-40 transition-colors whitespace-nowrap mt-1"
              >
                Post
              </button>
            </form>
            {isOpen && <EmojiPicker isOpen={isOpen} setIsOpen={setIsOpen} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentList;
