import { useState, useContext, type ChangeEvent, type FormEvent } from "react";
import { AppContext } from "../../Context/GlobalState";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

const initial_form: LoginFormData = {
  email: "",
  password: "",
};

function Login({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState<LoginFormData>(initial_form);
  const { dispatch, LoadingSpinner, loginUser, getCurrentAccount } =
    useContext(AppContext);
  const navigate = useNavigate();

  const hanldeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const hanldeSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await loginUser(formData.email, formData.password);
    const user = await getCurrentAccount();
    dispatch({ type: "SET_CURRENT_USER", payload: user });
    navigate("/user-profile");
    setFormData(initial_form);
  };
  return (
    <div>
      <h1>Log in</h1>
      <p>And meet all the world!</p>
      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded-full top-0 right-0 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition"
      >
        <X className="w-5 h-5" />
      </button>
      <LoadingSpinner />

      <form
        className="flex flex-col gap-4 p-[48px] p-4 rounded-md"
        onSubmit={hanldeSubmit}
      >
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={hanldeChange}
          required
          className="bg-[#242424] p-2 rounded-md"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={hanldeChange}
          required
          className="bg-[#242424] p-2 rounded-md"
        />

        <button>Log in</button>
      </form>
      <button>Forgot my password</button>
    </div>
  );
}
export default Login;
