import { useState, useContext, type ChangeEvent, useRef } from "react";
import { AppContext } from "../../Context/GlobalState";
import {
  X,
  ImagePlus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
// import heic2any from "heic2any";
import type { Post } from "../../Types/Interafaces";

function CreationPost({ post, onClose }: { post?: Post; onClose: () => void }) {
  const {
    dispatch,
    createPost,
    editPost,
    loading,
    setLoading,
    LoadingSpinner,
  } = useContext(AppContext);

  const isEditing = !!post;
  const [mediaUrls, setMediaUrls] = useState<string[]>(
    post?.media?.map((m) => m.content_url) || [],
  );
  const [description, setDescription] = useState(post?.description || "");
  const [activeSlide, setActiveSlide] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const acceptedFormats =
    "image/*, video/*, .webp, .avif, .gif, .jpeg, .jpg, .png";

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let selectedFile = e.target.files ? e.target.files[0] : null;
    if (!selectedFile) return;

    if (
      selectedFile.name.toLowerCase().endsWith(".heic") ||
      selectedFile.type === "image/heic"
    ) {
      try {
        const heic2any = (await import("heic2any")).default;
        const convertedBlob = await heic2any({
          blob: selectedFile,
          toType: "image/jpeg",
          quality: 0.8,
        });

        selectedFile = new File(
          [Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob],
          selectedFile.name.replace(/\.[^/.]+$/, ".jpg"),
          { type: "image/jpeg" },
        );
      } catch (error) {
        console.error(error);
        alert("HEIC conversion failed.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaUrls((prev) => {
        const newUrls = [...prev, reader.result as string];
        setActiveSlide(newUrls.length - 1);
        return newUrls;
      });
    };
    reader.readAsDataURL(selectedFile);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeMediaItem = (indexToRemove: number) => {
    setMediaUrls((prev) => {
      const filtered = prev.filter((_, index) => index !== indexToRemove);
      if (activeSlide >= filtered.length && filtered.length > 0) {
        setActiveSlide(filtered.length - 1);
      } else if (filtered.length === 0) {
        setActiveSlide(0);
      }
      return filtered;
    });
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === mediaUrls.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? mediaUrls.length - 1 : prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        const postId = post?.post_id;
        if (!postId) throw new Error("Missing Post ID");
        const updatedPost = await editPost(postId, description, mediaUrls);
        dispatch({ type: "UPDATE_POST", payload: updatedPost });
      } else {
        const createdPost = await createPost(description, mediaUrls);
        dispatch({ type: "CREATE_POST", payload: createdPost });
      }
      setMediaUrls([]);
      onClose();
    } catch (error) {
      alert("Could not process post.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isVideo = (url: string) =>
    url.startsWith("data:video/") ||
    url.endsWith(".mp4") ||
    url.endsWith(".mov");

  return (
    // Outer container fills 100% width of the modal injected structure
    <div className="w-full bg-white dark:bg-gray-900 overflow-hidden flex flex-col h-full max-h-[85vh] md:max-h-[600px]">
      {/* Fixed Sticky Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-md font-bold text-gray-900 dark:text-white">
          {isEditing ? "Edit Post" : "Create New Post"}
        </h2>
        <div className="w-7 h-7" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative flex-grow flex flex-col md:flex-row overflow-hidden min-h-0"
      >
        {loading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            {LoadingSpinner()}
          </div>
        )}

        {/* --- LEFT COLUMN: Media Container Stage --- */}
        <div className="w-full md:w-[55%] aspect-square md:aspect-auto md:h-full bg-gray-50 dark:bg-gray-950 flex-shrink-0 relative overflow-hidden group border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800">
          {mediaUrls.length > 0 ? (
            <div className="w-full h-full flex items-center justify-center relative">
              {isVideo(mediaUrls[activeSlide]) ? (
                <video
                  src={mediaUrls[activeSlide]}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={mediaUrls[activeSlide]}
                  alt="Upload preview"
                  className="w-full h-full object-contain"
                />
              )}

              <button
                type="button"
                onClick={() => removeMediaItem(activeSlide)}
                className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {mediaUrls.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 dark:bg-gray-900/90 rounded-full text-gray-800 dark:text-white shadow z-20"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 dark:bg-gray-900/90 rounded-full text-gray-800 dark:text-white shadow z-20"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20 bg-black/20 px-2 py-0.5 rounded-full">
                    {mediaUrls.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-1 rounded-full transition-all ${idx === activeSlide ? "w-2.5 bg-white" : "w-1 bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <label
              htmlFor="file-input"
              className="cursor-pointer flex flex-col items-center justify-center gap-2 w-full h-full p-6 text-center hover:bg-gray-100/30 transition"
            >
              <ImagePlus className="w-7 h-7 text-gray-400" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                Upload photos and videos
              </span>
            </label>
          )}
        </div>

        {/* --- RIGHT COLUMN: Form Dashboard Operations --- */}
        <div className="w-full md:w-[45%] p-4 flex flex-col justify-between gap-4 overflow-y-auto md:h-full flex-grow">
          {/* Top of dashboard: Thumbnails and Input fields */}
          <div className="flex flex-col gap-4">
            {/* Thumbnail Management Row */}
            {mediaUrls.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-shrink-0">
                <label
                  htmlFor="file-input"
                  className="flex-shrink-0 w-11 h-11 border border-dashed border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-400 transition"
                >
                  <ImagePlus className="w-4 h-4" />
                </label>
                {mediaUrls.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`relative flex-shrink-0 w-11 h-11 rounded-md overflow-hidden border-2 transition-all ${
                      index === activeSlide
                        ? "border-blue-500 scale-95"
                        : "border-transparent opacity-60"
                    }`}
                  >
                    {isVideo(url) ? (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-[8px] text-gray-500 font-bold">
                        VID
                      </div>
                    ) : (
                      <img
                        src={url}
                        className="w-full h-full object-cover"
                        alt="Thumb"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Content Field Wrapper */}
            <div className="flex flex-col gap-1 flex-grow">
              <label
                htmlFor="description"
                className="text-[10px] font-bold uppercase tracking-wider text-gray-400"
              >
                Caption
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a caption..."
                className="w-full border border-gray-200 dark:border-gray-800 bg-transparent text-sm rounded-xl p-3 resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none md:flex-grow min-h-[100px] md:min-h-[180px]"
              />
            </div>
          </div>

          {/* Action Trigger Row */}
          <div className="flex-shrink-0 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button
              type="submit"
              disabled={mediaUrls.length === 0}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:text-gray-400 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isEditing ? "Update Post" : "Share to Feed"}
            </button>
          </div>
        </div>

        <input
          id="file-input"
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept={acceptedFormats}
        />
      </form>
    </div>
  );
}
export default CreationPost;
