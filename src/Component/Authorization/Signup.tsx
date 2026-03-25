function Signup() {
  return (
    <div>
      <h1>Sign up</h1>
      <p>And start connecting!</p>

      <form className="flex flex-col gap-4 p-[48px] p-4 rounded-md">
        <label htmlFor="firstname">First name</label>
        <input type="text" />

        <label htmlFor="lastname">Last name</label>
        <input type="text" />

        <label htmlFor="email">Email address</label>
        <input type="email" />

        <label htmlFor="birthday">Select your birth date</label>
        <input type="date" />
      </form>

      <button>Sign up</button>
      <button>Do you already have an account? Log in</button>
    </div>
  );
}
export default Signup;
