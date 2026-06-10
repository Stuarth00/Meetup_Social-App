function PostContent({ content_url }: { content_url: string }) {
  return (
    <div className="w-full aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
      {content_url ? (
        <img
          src={content_url}
          alt="Post content"
          className="w-full h-full object-cover select-none"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse">Empty</div>
      )}
    </div>
  );
}
export default PostContent;
