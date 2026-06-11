import { useParams } from "react-router-dom";
import PostDetail from "../Component/Post/PostDetail";
import { useContext, useEffect, useState } from "react";
import type { Post } from "../Types/Interafaces";
import Layout from "../Component/Layout";
import { usePostActions } from "../Component/hooks/usePostAction";
import { AppContext } from "../Context/GlobalState";

function SinglePost() {
  const { post_id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const { getPostById, state, dispatch } = useContext(AppContext);

  const currentPost = state.posts.find((p) => p.post_id === post_id) || post;

  useEffect(() => {
    if (!post_id) return;

    getPostById(post_id)
      .then(setPost)
      .catch((err) => {
        console.error("Failed to fetch post:", err);
      });
  }, [post_id]);

  if (!currentPost) {
    return <div>Loading...</div>;
  }
  if (!post) return <div>Loading...</div>;

  const comments = currentPost.comments || [];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isLiked, likesCount, handleLike, handleSharePost } = usePostActions(
    currentPost.post_id!,
    currentPost.likes || [],
  );

  return (
    <Layout>
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
