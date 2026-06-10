import { useState, useContext, type ChangeEvent } from "react";
import { AppContext } from "../../Context/GlobalState";
import heic2any from "heic2any";

function CreationPost() {
  const { dispatch, createPost, loading, setLoading, LoadingSpinner } =
    useContext(AppContext);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [, setFile] = useState<File | null>(null);
  const acceptedFormats = "image/*, .webp, .avif, .jpeg, .jpg, .png";

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let selectedFile = e.target.files ? e.target.files[0] : null;
    if (!selectedFile) return;

    // 1. Check for HEIC specifically
    if (
      selectedFile.name.toLowerCase().endsWith(".heic") ||
      selectedFile.type === "image/heic"
    ) {
      try {
        // 2. Convert HEIC to JPEG blob
        const convertedBlob = await heic2any({
          blob: selectedFile,
          toType: "image/jpeg",
          quality: 0.8,
        });

        // 3. Create a new File object from the blob so it has a name
        selectedFile = new File(
          [Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob],
          selectedFile.name.replace(/\.[^/.]+$/, ".jpg"),
          { type: "image/jpeg" },
        );
      } catch (error) {
        console.log(error);
        alert("Brave/Chrome don't support HEIC yet. Please try a PNG or JPEG!");
        e.target.value = ""; // Clear the input
        return;
      }
    }

    if (selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const render = new FileReader();
      render.onloadend = () => {
        setImageUrl(render.result as string);
      };
      render.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!imageUrl) return;
      const createdPost = await createPost(description, imageUrl);
      dispatch({
        type: "CREATE_POST",
        payload: createdPost,
      });
    } catch (error) {
      alert("Could not create post. Please try again.");
      return error;
    } finally {
      setLoading(false);
    }
    setImageUrl(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Create a Post
      </h2>

      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col gap-4 bg-white dark:bg-gray-900 shadow-md rounded-xl p-4 sm:p-6"
      >
        {loading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
            {LoadingSpinner()}
          </div>
        )}

        {/* Image Upload */}
        <label
          htmlFor="file-input"
          className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 text-center hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <span className="text-gray-600 dark:text-gray-300">
            Click to upload an image
          </span>
        </label>

        <input
          id="file-input"
          name="file-input"
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept={acceptedFormats}
        />

        {/* Preview */}
        {imageUrl && (
          <div className="w-full flex justify-center">
            <img
              src={imageUrl}
              alt="Preview"
              className="rounded-lg max-h-80 object-contain"
            />
          </div>
        )}

        {/* Description */}
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your post..."
          className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full sm:w-auto self-end bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}
export default CreationPost;
