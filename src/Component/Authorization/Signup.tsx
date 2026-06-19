import { useContext, useState, type ChangeEvent, type FormEvent } from "react";
import { AppContext } from "../../Context/GlobalState";
import { useNavigate } from "react-router-dom";
import type { User } from "../../Types/Interafaces";
import { X } from "lucide-react";

interface SignupFormData {
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  password: string;
}

const initial_form: SignupFormData = {
  first_name: "",
  last_name: "",
  email: "",
  date_of_birth: "",
  password: "",
};

function Signup({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState<SignupFormData>(initial_form);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    dispatch,
    loading,
    setLoading,
    LoadingSpinner,
    registerUser,
    getCurrentAccount,
  } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const hanldeSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser(formData as User);

      const currentUser = await getCurrentAccount();

      dispatch({
        type: "SET_CURRENT_USER",
        payload: currentUser,
      });

      navigate("/user-profile");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded-full top-0 right-0 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition"
      >
        <X className="w-5 h-5" />
      </button>
      <h1>Sign up</h1>
      <p>And start connecting!</p>

      {errorMessage && (
        <div className="bg-red-500 text-white p-3 rounded-md">
          {errorMessage}
        </div>
      )}
      <form
        className="flex flex-col gap-4 p-[48px] p-4 rounded-md"
        onSubmit={hanldeSubmit}
      >
        {loading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            {LoadingSpinner()}
          </div>
        )}
        <label htmlFor="firstname">First name</label>
        <input
          type="text"
          id="firstname"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="bg-[#242424] p-2 rounded-md"
        />

        <label htmlFor="lastname">Last name</label>
        <input
          type="text"
          id="lastname"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="bg-[#242424] p-2 rounded-md"
        />

        <label htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-[#242424] p-2 rounded-md"
        />

        <label htmlFor="password">Create your password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="bg-[#242424] p-2 rounded-md"
        />

        <label htmlFor="birthday">Select your birth date</label>
        <input
          type="date"
          id="birth"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
          className="bg-[#242424] p-2 rounded-md"
        />
        <button>Sign up</button>
      </form>

      <button>Do you already have an account? Log in</button>
    </div>
  );
}
export default Signup;
