import { OctagonAlert, X } from "lucide-react";
import { useState, useContext, type ChangeEvent } from "react";
import { AppContext } from "../../Context/GlobalState";
import type { UserProfile } from "../../Types/Interafaces";
import heic2any from "heic2any";

function EditProfile() {
  const {
    state,
    dispatch,
    handleUserProfileClick,
    editAccount,
    loading,
    setLoading,
    LoadingSpinner,
    deleteUser,
    handleAuthClick,
  } = useContext(AppContext);

  const [formData, setFormData] = useState<UserProfile>(
    state.currentUser || {
      user_id: "",
      first_name: "",
      last_name: "",
      email: "",
      date_of_birth: "",
      avatar: "",
      about_me: "",
      location: "",
      interests: [],
      password: "",
      gender: "",
    },
  );
  const [, setFile] = useState<File | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [messageError, setMessageError] = useState("");
  const handleCancelSubmission = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleUserProfileClick();
  };

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
        const imageBase64 = render.result as string;
        setFormData((prev) => ({
          ...prev,
          avatar: imageBase64,
        }));
      };
      render.readAsDataURL(selectedFile);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await editAccount({
        ...formData,
      });

      dispatch({
        type: "UPDATE_PROFILE",
        payload: {
          ...formData,
          user_id: state.currentUser?.user_id || crypto.randomUUID(),
          password: state.currentUser?.password || "",
        },
      });
    } catch (error) {
      return error;
    } finally {
      handleUserProfileClick();
      setFormData({
        user_id: "",
        first_name: "",
        last_name: "",
        email: "",
        date_of_birth: "",
        avatar: "",
        about_me: "",
        location: "",
        interests: [],
        password: "",
        gender: "",
      });
      setLoading(false);
    }
  };

  //Deletion of account
  const handleDelete = async () => {
    setLoading(true);

    try {
      await deleteUser();
      dispatch({
        type: "LOGOUT",
      });
      handleAuthClick();
    } catch (err) {
      setMessageError(`Error found - ${err}`);
      return err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 shadow-lg rounded-xl bg-mist-900 text-white relative">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

      <form
        onSubmit={handleSubmit}
        className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
      >
        {loading && (
          <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
            {LoadingSpinner()}
          </div>
        )}

        {/* Column 1: Identity */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={formData.avatar || "/default-avatar.png"}
              alt="Profile"
              className="h-20 w-20 rounded-full object-cover border-2 border-gray-700"
            />
            <div>
              <label
                htmlFor="avatar"
                className="cursor-pointer bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition inline-block text-sm font-medium border border-gray-700"
              >
                Update photo
              </label>
              <input
                type="file"
                id="avatar"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">About Me</label>
            <textarea
              id="about_me"
              name="about_me"
              rows={3}
              value={formData.about_me}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  about_me: e.target.value,
                }))
              }
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 text-white outline-none resize-none"
            />
          </div>
        </div>

        {/* Column 2: Account Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 text-white outline-none"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="not_say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Interests (comma separated)
            </label>
            <input
              id="interests"
              type="text"
              name="interests"
              value={
                Array.isArray(formData.interests)
                  ? formData.interests.join(", ")
                  : formData.interests || ""
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  interests: e.target.value.split(",").map((i) => i.trim()),
                }))
              }
              className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 text-white outline-none"
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Date of Birth</p>
            <p className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400">
              {state.currentUser?.date_of_birth || "Not specified"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-2 flex justify-end gap-4 mt-4 border-t border-gray-800 pt-6">
          <button
            type="button"
            onClick={handleCancelSubmission}
            className="bg-transparent hover:bg-gray-800 text-gray-300 border border-gray-700 px-6 py-2.5 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-md"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Danger Zone Section */}
      <div className="border-t border-red-900/40 pt-6 mt-8">
        <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-400 mb-4">
          This action is permanent and cannot be undone. All your user data will
          be wiped out.
        </p>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="inline-flex items-center gap-2 bg-red-950/40 text-red-400 border border-red-800/60 hover:bg-red-900 hover:text-white px-4 py-2.5 rounded-lg font-medium transition"
        >
          <OctagonAlert size={18} />
          Delete Account
        </button>
      </div>

      {messageError && (
        <div>
          <p>We got an issue. {messageError}</p>
        </div>
      )}

      {/* Professional Full Screen Delete Confirmation Modal */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 max-w-md w-full rounded-xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            {/* Close corner button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 text-red-500 mb-4">
              <OctagonAlert size={28} />
              <h4 className="text-xl font-bold text-white">
                Are you absolutely sure?
              </h4>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              This will permanently delete your account, including your posts,
              connections, and profile data. You cannot reverse this process.
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setMenuOpen(false)}
                className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
              >
                No, keep my account
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setMenuOpen(false);
                }}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-lg"
              >
                Yes, delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default EditProfile;
