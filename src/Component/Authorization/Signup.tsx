import { useContext, useState, type ChangeEvent, type FormEvent } from "react";
import { AppContext } from "../../Context/GlobalState";
import { useNavigate } from "react-router-dom";

interface SignupFormData {
  first_name: string;
  last_name: string;
  email: string;
  // avatar?: string;
  // genre: string;
  DateOfBirth: string;
  password: string;
}

const initial_form: SignupFormData = {
  first_name: "",
  last_name: "",
  email: "",
  DateOfBirth: "",
  password: "",
};

function Signup() {
  const [formData, setFormData] = useState<SignupFormData>(initial_form);

  const { state, dispatch, asyncSimulate, LoadingSpinner } =
    useContext(AppContext);
  const navigate = useNavigate();

  const hanldeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const hanldeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailExists = state.users.some(
      (user) => user.email === formData.email,
    );
    if (emailExists) {
      alert("Email already exists. Please use a different email.");
      return;
    }
    asyncSimulate(() => {
      dispatch({
        type: "REGISTER_USER",
        payload: {
          ...formData,
          id: crypto.randomUUID(),
        },
      });
      setFormData(initial_form);
      navigate("/");
    });
  };

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
          onChange={hanldeChange}
          required
          className="bg-lime-950 p-2 rounded-md"
        />

        <label htmlFor="lastname">Last name</label>
        <input
          type="text"
          id="lastname"
          name="last_name"
          value={formData.last_name}
          onChange={hanldeChange}
          required
          className="bg-lime-950 p-2 rounded-md"
        />

        <label htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={hanldeChange}
          required
          className="bg-lime-950 p-2 rounded-md"
        />

        <label htmlFor="password">Create your password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={hanldeChange}
          required
          className="bg-lime-950 p-2 rounded-md"
        />

        <label htmlFor="birthday">Select your birth date</label>
        <input
          type="date"
          id="birth"
          name="DateOfBirth"
          value={formData.DateOfBirth}
          onChange={hanldeChange}
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
