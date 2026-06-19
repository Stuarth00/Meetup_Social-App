import { useParams } from "react-router-dom";
import PostDetail from "../Component/Post/PostDetail";
import { useContext, useEffect, useState } from "react";
import type { Post } from "../Types/Interafaces";
import Layout from "../Component/Layout";
import { usePostActions } from "../Component/hooks/usePostAction";
import { AppContext } from "../Context/GlobalState";
import Modal from "../Component/Elements/Modal";
import ModalAuthFlow from "../Component/Elements/ModalAuthFlow";

function SinglePost() {
  const { post_id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const { getPostById, state, dispatch } = useContext(AppContext);

  const currentPost = state.posts.find((p) => p.post_id === post_id) || post;
  const {
    isLiked,
    likesCount,
    handleLike,
    handleSharePost,
    showAuthModal,
    setShowAuthModal,
  } = usePostActions(
    currentPost?.post_id || "",

    currentPost?.likes || [],
  );
  const comments = currentPost?.comments || [];

  useEffect(() => {
    if (!post_id) return;

    getPostById(post_id)
      .then(setPost)
      .catch((err) => {
        console.error("Failed to fetch post:", err);
      });
  }, [post_id]);

  if (!currentPost) {
    return <div>Loading because the post wasn't found...</div>;
  }

  return (
    <Layout>
      {showAuthModal && (
        <Modal size="md" onClose={() => setShowAuthModal(false)}>
          <ModalAuthFlow onClose={() => setShowAuthModal(false)} />
        </Modal>
      )}
      <PostDetail
        likesCount={likesCount}
        isLiked={isLiked}
        post={currentPost}
        handleLike={handleLike}
        handleSharePost={handleSharePost}
        dispatch={dispatch}
        comments={comments}
        onClose={() => null}
        isOwner={state.currentUser?.user_id === currentPost.author_id}
      />
    </Layout>
  );
}

export default SinglePost;
