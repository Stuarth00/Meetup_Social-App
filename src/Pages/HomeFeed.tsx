import Layout from "../Component/Layout";
import Post from "../Component/Post/Post";
import mockPost from "../Types/mockPosts";

function HomeFeed() {
  return (
    <div className="mt-4">
      <Layout>
        <h1>Home Feed</h1>
        {mockPost.map((postData) => (
          <Post key={postData.id} post={postData} />
        ))}
      </Layout>
    </div>
  );
}

export default HomeFeed;
