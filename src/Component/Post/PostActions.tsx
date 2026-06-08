import { Forward, Heart, MessageCircle } from "lucide-react";
import { useContext, useState } from "react";
import { AppContext } from "../../Context/GlobalState";
import Modal from "../Elements/Modal";
import LikeList from "../ActionUser/LikeList";
import PostDetail from "./PostDetail";
import SharePost from "../ActionUser/SharePost";
import type { Like, Media, PostComment } from "../../Types/Interafaces";
import { usePostActions } from "../hooks/usePostAction";

function PostAction({
  post,
}: {
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
}) {
  const { state, dispatch } = useContext(AppContext);

  const currentPost =
    state.posts.find((p) => p.post_id === post.post_id) || post;
  const comments = currentPost?.comments || [];

  const {
    isLiked,
    likesCount,
    likesList,
    handleLike,
    handleSharePost,
    fetchLikesList,
  } = usePostActions(currentPost.post_id!, currentPost.likes || []);

  const [actionClicked, setActionClicked] = useState<
    "like" | "comment" | "share" | null
  >(null);

  const modalAction = () => {
    switch (actionClicked) {
      case "like":
        return <LikeList likesList={likesList} />;

      case "comment":
        return (
          <PostDetail
            post={post}
            isLiked={isLiked}
            likesCount={likesCount}
            handleLike={handleLike}
            handleSharePost={handleSharePost}
            dispatch={dispatch}
            comments={comments}
          />
        );

      case "share":
        return <SharePost />;
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-6 pt-2 border-t border-gray-50">
        <div
          className="flex items-center gap-1.5 group cursor-pointer"
          onClick={async () => {
            await fetchLikesList();
            setActionClicked("like");
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className="p-1.5 rounded-full hover:bg-red-50 transition-colors duration-200"
            aria-label="Like post"
          >
            <Heart
              className={`w-5 h-5 transition-transform group-hover:scale-110 ${isLiked ? "fill-red-500 stroke-red-500" : "text-gray-600"}`}
            />
          </button>
          <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900">
            {likesCount}
          </span>
        </div>

        <div
          className="flex items-center gap-1.5 group cursor-pointer"
          onClick={() => setActionClicked("comment")}
        >
          <button
            type="button"
            className="p-1.5 rounded-full hover:bg-blue-50 transition-colors duration-200"
            aria-label="View comments"
          >
            <MessageCircle className="w-5 h-5 text-gray-600 transition-transform group-hover:scale-110" />
          </button>
          <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900">
            {comments ? comments.length : 0}
          </span>
        </div>

        <div
          className="flex items-center gap-1.5 group cursor-pointer"
          onClick={() => setActionClicked("share")}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSharePost();
            }}
            className="p-1.5 rounded-full hover:bg-green-50 transition-colors duration-200"
            aria-label="Share post"
          >
            <Forward className="w-5 h-5 text-gray-600 transition-transform group-hover:scale-110" />
          </button>
          {/* <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900">
              5
            </span> */}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-gray-800 text-sm leading-relaxed">
          {post.description}
        </p>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setActionClicked("comment")}
          className="text-xs font-medium text-gray-400 hover:underline mb-1 block"
        >
          {comments && comments.length > 0
            ? `View all ${comments.length} comments`
            : "No comments yet. Be the first to comment!"}
        </button>
        {comments && comments[0] && (
          <p className="text-xs text-gray-700">
            <strong className="font-black mr-1">{comments[0].username}</strong>
            {comments[0].text}
          </p>
        )}
      </div>

      {actionClicked && (
        <Modal size="lg" onClose={() => setActionClicked(null)}>
          <button
            className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700"
            onClick={() => setActionClicked(null)}
          >
            {" "}
            X{" "}
          </button>
          {modalAction()}
        </Modal>
      )}
    </div>
  );
}

export default PostAction;
