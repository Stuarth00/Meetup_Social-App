import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
// import mockPost from "../../Data/mockPosts";

interface PostProps {
  post: {
    id: number;
    user: {
      username: string;
      avatar: string;
    };
    content: {
      type: string;
      url: string;
    };
    likes: number;
    comments: string[];
  };
}

function Post({ post }: PostProps) {
  return (
    <article className="border rounded-lg mb-16">
      <PostHeader username={post.user.username} avatar={post.user.avatar} />
      <PostContent contentUrl={post.content.url} />
      <PostActions likes={post.likes} comments={post.comments} />
    </article>
  );
}

export default Post;
