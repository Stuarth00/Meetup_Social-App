function Login() {
  return (
    <div>
      <h1>Log in</h1>
      <p>And meet all the world!</p>
      <form className="flex flex-col gap-4 p-[48px] p-4 rounded-md">
        <label htmlFor="email">Email</label>
        <input type="text" />

        <label htmlFor="password">Password</label>
        <input type="password" />
      </form>
      <button>Forgot my password</button>
    </div>
  );
}
export default Login;
