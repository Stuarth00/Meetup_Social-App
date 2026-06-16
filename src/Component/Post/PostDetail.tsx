/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EllipsisVertical,
  OctagonAlert,
  Heart,
  MessageCircle,
  Forward,
  Smile,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../../index.css";
import type { Media, Like, PostComment } from "../../Types/Interafaces";
import { AppContext, type Action } from "../../Context/GlobalState";
import { useContext, useState } from "react";
import Modal from "../Elements/Modal";
import EmojiPicker from "../Elements/EmojiPicker";
import CreationPost from "../ProfilePage/creationPost";

function PostDetail({
  likesCount,
  isLiked,
  post,
  handleLike,
  handleSharePost,
  dispatch,
  comments,
  onClose,
  isOwner,
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
  handleLike: () => void;
  handleSharePost: () => void;
  dispatch: React.Dispatch<Action>;
  comments: PostComment[];
  onClose: () => void;
  isOwner: boolean;
}) {
  const { addComment, handleNavigateToUserId, deletePost } =
    useContext(AppContext);
  //For comment
  const [text, setText] = useState<string>("");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const [isEditing, setIsEditing] = useState(false);

  const [activeSlide, setActiveSlide] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get("text") as string;
    const form = e.currentTarget;

    if (!text.trim() || !post.post_id) return;

    try {
      const newComment: PostComment = await addComment(post.post_id, text);
      dispatch({
        type: "ADD_COMMENT",
        payload: {
          post_id: post.post_id!,
          comment: newComment,
        },
      });
      form.reset();
      setText("");
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

  const handleEditPost = () => {
    setIsEditing(true);
    setMenuOpen(false);
  };

  const handleDelete = async () => {
    if (!post.post_id) return;

    await deletePost(post.post_id);
    dispatch({
      type: "DELETE_POST",
      payload: post.post_id,
    });

    onClose();
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post.media) return;
    setActiveSlide((prev) => (prev === post.media!.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post.media) return;
    setActiveSlide((prev) => (prev === 0 ? post.media!.length - 1 : prev - 1));
  };

  // Helper utility to detect video types safely
  const isVideo = (url: string = "") => {
    return (
      url.startsWith("data:video/") ||
      url.endsWith(".mp4") ||
      url.endsWith(".mov") ||
      url.includes("video")
    );
  };

  const currentMediaUrl =
    post.media && post.media.length > 0
      ? post.media[activeSlide]?.content_url
      : "";

  return (
    <div>
      <div className="w-full max-w-6xl h-[85vh] max-h-[750px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="group w-full md:w-[50%] h-1/2 md:h-full bg-black flex items-center justify-center relative select-none border-b md:border-b-0 md:border-r border-gray-100">
          {currentMediaUrl ? (
            <div className="w-full h-full flex items-center justify-center">
              {isVideo(currentMediaUrl) ? (
                <video
                  src={currentMediaUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={currentMediaUrl}
                  alt="Post content"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-xs">No Media Content</div>
          )}

          {/* Navigational Arrows (Only shows if array length > 1) */}
          {post.media && post.media.length > 1 ? (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-gray-900/90 hover:bg-slate-700 rounded-full text-gray-800 dark:text-white shadow-md transition-opacity opacity-0 group-hover:opacity-100 z-20"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-gray-900/90 hover:bg-slate-700 rounded-full text-gray-800 dark:text-white shadow-md transition-opacity opacity-0 group-hover:opacity-100 z-20"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Pagination Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-xs">
                {post.media.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeSlide ? "w-3 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : null}
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

              {isOwner ? (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <EllipsisVertical className="w-5 h-5 text-gray-600" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-12 w-44 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                      <button
                        onClick={handleEditPost}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {/* For editing a Post */}
                  {isEditing && (
                    <Modal size="lg" onClose={() => setIsEditing(false)}>
                      <CreationPost
                        post={post}
                        onClose={() => setIsEditing(false)}
                      />
                    </Modal>
                  )}

                  {showDeleteConfirm && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
                      <div className="bg-white rounded-2xl p-6 w-[340px] shadow-xl">
                        <div className="flex justify-center mb-4">
                          <div className="bg-red-100 p-3 rounded-full">
                            <OctagonAlert className="text-red-500 w-6 h-6" />
                          </div>
                        </div>

                        <h3 className="text-center font-semibold text-lg">
                          Delete Post
                        </h3>

                        <p className="text-center text-sm text-gray-500 mt-2">
                          This action cannot be undone. The post, comments and
                          likes will be permanently removed.
                        </p>

                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => {
                              setShowDeleteConfirm(false);
                              setMenuOpen(false);
                            }}
                            className="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>

                          <button
                            onClick={handleDelete}
                            className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
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
              <div className="gap-6 group min-w-0">
                {comments.map((comment) => (
                  <div
                    key={comment.comment_id}
                    className="flex items-center gap-5 min-w-0"
                  >
                    <img
                      src={comment.avatar}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                      alt=""
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-800 break-words leading-relaxed">
                        <strong
                          onClick={() => {
                            handleNavigateToUserId(comment.user_id || "");
                            onClose();
                          }}
                          className="font-semibold mr-1.5 cursor-pointer hover:underline"
                        >
                          {comment.username}
                        </strong>
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        {/* <span>2h</span> */}
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

          <div className="border-gray-100 p-2 bg-white shrink-0">
            <div className="flex items-center gap-6 mb-2">
              <button className="hover:scale-110 transition-transform">
                <Heart
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike();
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

            {/* Likes, comments count and date */}
            <div className="flex items-center gap-3">
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
          </div>

          {/* Form to comment */}
          <div className="relative border-t border-gray-100 px-4 py-3 bg-white shrink-0">
            <form
              onSubmit={handleSubmit}
              className="flex flex-wrap items-start gap-3"
            >
              {"  "}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 hover:text-gray-700 transition-colors mt-1"
              >
                <Smile className="w-6 h-6" />
              </button>
              <textarea
                name="text"
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
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

            {isOpen && (
              <div className="absolute bottom-125 left-0 mb-2 z-50 mb-2 ">
                <EmojiPicker setIsOpen={setIsOpen} setText={setText} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
