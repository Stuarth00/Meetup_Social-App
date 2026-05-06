import { useContext, useState, type ChangeEvent, type FormEvent } from "react";
import { AppContext } from "../../Context/GlobalState";
import { useNavigate } from "react-router-dom";
import type { User } from "../../Types/Interafaces";

interface SignupFormData {
  first_name: string;
  last_name: string;
  email: string;
  // avatar?: string;
  // genre: string;
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

function Signup() {
  const [formData, setFormData] = useState<SignupFormData>(initial_form);

  const { state, dispatch, LoadingSpinner, registerUser, getCurrentAccount } =
    useContext(AppContext);
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

    const emailExists = state.users.some(
      (user) => user.email === formData.email,
    );
    if (emailExists) {
      console.error("Email already exists. Please use a different email.");
      return;
    }
    await registerUser(formData as User);
    await getCurrentAccount();
    dispatch({ type: "REGISTER_USER", payload: formData as User });
    navigate("/user-profile");
  };
  console.log("Signup component rendered with formData:", formData);
  return (
    <div>
      <h1>Sign up</h1>
      <p>And start connecting!</p>

      <LoadingSpinner />

      <form
        className="flex flex-col gap-4 p-[48px] p-4 rounded-md"
        onSubmit={hanldeSubmit}
      >
        <label htmlFor="firstname">First name</label>
        <input
          type="text"
          id="firstname"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="bg-lime-950 p-2 rounded-md"
        />

        <label htmlFor="lastname">Last name</label>
        <input
          type="text"
          id="lastname"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="bg-lime-950 p-2 rounded-md"
        />

        <label htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-lime-950 p-2 rounded-md"
        />

        <label htmlFor="password">Create your password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="bg-lime-950 p-2 rounded-md"
        />

        <label htmlFor="birthday">Select your birth date</label>
        <input
          type="date"
          id="birth"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
          className="bg-lime-950 p-2 rounded-md"
        />
        <button>Sign up</button>
      </form>

      <button>Do you already have an account? Log in</button>
    </div>
  );
}
export default Signup;
