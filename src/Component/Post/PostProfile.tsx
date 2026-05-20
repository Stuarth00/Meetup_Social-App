import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/GlobalState";
import type { Post } from "../../Types/Interafaces";

function PostProfile({
  user_id,
  isOwnProfile,
}: {
  user_id: string;
  isOwnProfile: boolean;
}) {
  const { getPost, getPostsByUserId } = useContext(AppContext);
  const [numCols, setNumCols] = useState(3);
  const [myPosts, setMyPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = isOwnProfile
          ? await getPost()
          : await getPostsByUserId(user_id);

        setMyPosts(posts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, [user_id, isOwnProfile]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data: Post[] = await getPost();
  //       setMyPosts(data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setNumCols(2);
      else setNumCols(3);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial column count based on current window size

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
  const columns = distributePhotos(myPosts, numCols);

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
                className="border border-gray-300 rounded overflow-hidden shadow-lg break-inside-avoid"
              >
                {photo.content_url

                  ?.filter((media) => media.content_url)

                  .map((media) => (
                    <img
                      key={media.media_id}
                      src={media.content_url!}
                      alt={photo.description}
                      className="w-full h-auto rounded-t hoverImg"
                    />
                  ))}
                ;<p>{photo.description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostProfile;
