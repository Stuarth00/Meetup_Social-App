function PostContent({ contentUrl }: { contentUrl: string }) {
  return (
    <div>
      <img src={contentUrl} alt="Content-image" />
      <p>Image from the beach</p>
    </div>
  );
}
export default PostContent;
