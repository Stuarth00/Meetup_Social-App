import { useParams } from "react-router-dom";
import CommentList from "../Component/ActionUser/CommentList";
import { getPostById } from "../Context/Requests";
import { useEffect, useState } from "react";
import type { Post } from "../Types/Interafaces";
import Layout from "../Component/Layout";

function SinglePost() {
  const { post_id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!post_id) return;

    getPostById(post_id)
      .then(setPost)
      .catch((err) => {
        console.error("Failed to fetch post:", err);
      });
  }, [post_id]);

  if (!post) return <div>Loading...</div>;

  return (
    <Layout>
      <CommentList
        post={post}
        likesCount={post.likes?.length || 0}
        isLiked={
          post.likes?.some((like) => like.user_id === post.author_id) || false
        }
      ></CommentList>
    </Layout>
  );
}

export default SinglePost;
