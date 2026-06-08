import Layout from "../Component/Layout";
import PostFeed from "../Component/Post/PostFeed";
import type { Post } from "../Types/Interafaces";
import { useContext, useEffect } from "react";
import { AppContext } from "../Context/GlobalState";

function HomeFeed() {
  const { getAllPosts, handleNavigateToUserId, dispatch, state } =
    useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Post[] = await getAllPosts();
        dispatch({ type: "SET_POSTS", payload: data });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="mt-16">
      <Layout>
        <h1>Home Feed</h1>
        {state.posts.map((post) => (
          <PostFeed
            key={post.post_id}
            post={post}
            handleNavigateToUserId={handleNavigateToUserId}
          />
        ))}
      </Layout>
    </div>
  );
}

export default HomeFeed;
