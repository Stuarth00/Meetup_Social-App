import { Forward, Heart, MessageCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/GlobalState";
import Modal from "../Authorization/Modal";
import LikeList from "../ActionUser/LikeList";
import CommentList from "../ActionUser/CommentList";
import SharePost from "../ActionUser/SharePost";
import type { Like, Media, PostComment } from "../../Types/Interafaces";

interface LikeUser {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}

function PostAction({
  likes,
  post_id,
  post,
}: {
  likes: { user_id: string }[] | undefined;
  post_id: string;
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
  const [likesCount, setLikesCount] = useState(likes?.length || 0);
  const { toggleLike, state, getLikesByPostId } = useContext(AppContext);
  const currentUserId = state.currentUser?.user_id;
  const [isLiked, setIsLiked] = useState(
    likes?.some((like) => like.user_id === currentUserId) || false,
  );
  const [actionClicked, setActionClicked] = useState<
    "like" | "comment" | "share" | null
  >(null);

  const [likesList, setLikesList] = useState<LikeUser[]>([]);

  useEffect(() => {
    if (!currentUserId) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLiked(likes?.some((like) => like.user_id === currentUserId) || false);
  }, [likes, currentUserId]);

  const handleClick = async () => {
    const previousIsLiked = isLiked;
    const previousLikeCount = likesCount;

    setIsLiked(!previousIsLiked);
    setLikesCount((prev) => (previousIsLiked ? prev - 1 : prev + 1));

    try {
      const result = await toggleLike(post_id);

      setIsLiked(result.is_liked);
      setLikesCount(result.likesCount);
    } catch (err) {
      console.error("Backend failed, rolling back UI", err);
      setIsLiked(previousIsLiked);
      setLikesCount(previousLikeCount);
    }
  };

  const fetchLikesList = async () => {
    try {
      const data: LikeUser[] = await getLikesByPostId(post_id.toString());
      setLikesList(data);
    } catch (err) {
      console.error("Failed to fetch likes list", err);
    }
  };

  const handleSharePost = async () => {
    const shareUrl = `${window.location.origin}/posts/${post_id}`;
    const shareData = {
      title: "Check out this post!",
      text: "I found this post interesting and wanted to share it with you.",
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Post shared successfully");
      } catch (err) {
        console.error("Error sharing post:", err);
        return err;
      }
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          alert("Post URL copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy URL:", err);
        });
    }
  };

  const modalAction = () => {
    switch (actionClicked) {
      case "like":
        return <LikeList data={likesList} />;

      case "comment":
        return (
          <CommentList post={post} isLiked={isLiked} likesCount={likesCount} />
        );

      case "share":
        return <SharePost />;
    }
  };

  return (
    <div>
      <div className="max-w-md p-4 border border-gray-100 rounded-xl shadow-sm bg-white">
        <div className="flex items-center gap-6 pt-2 border-t border-gray-50">
          <div
            className="flex items-center gap-1.5 group cursor-pointer"
            onClick={async () => {
              await fetchLikesList();
              setActionClicked("like");
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
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
              className="p-1.5 rounded-full hover:bg-blue-50 transition-colors duration-200"
              aria-label="View comments"
            >
              <MessageCircle className="w-5 h-5 text-gray-600 transition-transform group-hover:scale-110" />
            </button>
            <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900">
              {post.comments ? post.comments.length : 0}
            </span>
          </div>

          <div
            className="flex items-center gap-1.5 group cursor-pointer"
            onClick={() => setActionClicked("share")}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSharePost();
              }}
              className="p-1.5 rounded-full hover:bg-green-50 transition-colors duration-200"
              aria-label="Share post"
            >
              <Forward className="w-5 h-5 text-gray-600 transition-transform group-hover:scale-110" />
            </button>
            <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900">
              5
            </span>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-gray-800 text-sm leading-relaxed">
            {post.description}
          </p>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100">
          <button
            onClick={() => setActionClicked("comment")}
            className="text-xs font-medium text-gray-400 hover:underline mb-1 block"
          >
            {post.comments && post.comments.length > 0
              ? `View all ${post.comments.length} comments`
              : "No comments yet. Be the first to comment!"}
          </button>
          {post.comments && post.comments[0] && (
            <p className="text-xs text-gray-700">
              <strong className="font-black mr-1">
                {post.comments[0].username}
              </strong>
              {post.comments[0].text}
            </p>
          )}
        </div>
      </div>

      {actionClicked && (
        <Modal onClose={() => setActionClicked(null)}>
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
