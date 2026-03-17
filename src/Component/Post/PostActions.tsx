function PostAction({
  likes,
  comments,
}: {
  likes: number;
  comments: string[];
}) {
  return (
    <div>
      <div>
        <p>{likes} likes</p>
        <p>{comments}</p>
      </div>
      <div>
        <button>Like</button>
        <button>Comment</button>
        <button>Share</button>
      </div>
    </div>
  );
}

export default PostAction;
