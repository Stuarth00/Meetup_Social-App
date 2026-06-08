/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/GlobalState";
import type { Post } from "../../Types/Interafaces";
import PostDetail from "./PostDetail";
import Modal from "../Elements/Modal";
import { usePostActions } from "../hooks/usePostAction";

function PostProfile({
  user_id,
  isOwnProfile,
}: {
  user_id: string;
  isOwnProfile: boolean;
}) {
  const { state, getPost, getPostsByUserId, dispatch } = useContext(AppContext);
  const [numCols, setNumCols] = useState(3);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const currentSelectedPost =
    state.posts.find((p) => p.post_id === selectedPost?.post_id) ||
    selectedPost;

  const comments = currentSelectedPost?.comments || [];
  const postId = currentSelectedPost?.post_id ?? "";
  const posts = state.posts;

  const { isLiked, likesCount, handleLike, handleSharePost } = usePostActions(
    postId,
    currentSelectedPost?.likes || [],
  );

  useEffect(() => {
    if (!user_id) {
      return;
    }

    const fetchPosts = async () => {
      try {
        const posts = isOwnProfile
          ? await getPost()
          : await getPostsByUserId(user_id);

        dispatch({ type: "SET_POSTS", payload: posts });
      } catch (err) {
        return err;
      }
    };
    fetchPosts();
  }, [user_id, isOwnProfile]);

  //Setting size of posts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setNumCols(2);
      else setNumCols(3);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const distributePhotos = (items: Post[], numCols: number): Post[][] => {
    const cols = Array.from({ length: numCols }, () => [] as Post[]);
    items.forEach((post, i) => {
      cols[i % numCols].push(post);
    });
    return cols;
  };
  const columns = distributePhotos(posts, numCols);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">
        {isOwnProfile ? "My posts" : "Posts"}
      </h1>
      <div className="flex gap-4 items-start">
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4 flex-1">
            {col.map((photo) => (
              <div
                key={photo.post_id}
                className="border border-gray-300 rounded overflow-hidden shadow-lg break-inside-avoid cursor-pointer"
                onClick={() => setSelectedPost(photo)}
              >
                {photo.media?.map((media, index) => (
                  <img
                    key={media.media_id || index}
                    src={media.content_url}
                    alt={photo.description}
                    className="w-full h-auto rounded-t hoverImg"
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {currentSelectedPost && (
        <Modal size="lg" onClose={() => setSelectedPost(null)}>
          <button
            className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700"
            onClick={() => setSelectedPost(null)}
          >
            {" "}
            X{" "}
          </button>
          <PostDetail
            post={currentSelectedPost}
            isLiked={isLiked}
            likesCount={likesCount}
            handleLike={handleLike}
            handleSharePost={handleSharePost}
            dispatch={dispatch}
            comments={comments}
          />
        </Modal>
      )}
    </div>
  );
}

export default PostProfile;
