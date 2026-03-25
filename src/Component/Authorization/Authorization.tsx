import { useState } from "react";
import ModalForm from "./Modal";
import Login from "./Login";
import Signup from "./Signup";

function Authorization() {
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  return (
    <div>
      <div>
        <h1>Conecta con todos</h1>
        <img src="#" alt="app.logo" />
      </div>
      <div>
        <button onClick={() => setAuthMode("login")}>Log in</button>
        <button onClick={() => setAuthMode("signup")}>Sign in</button>
      </div>

      {authMode && (
        <ModalForm onClose={() => setAuthMode(null)}>
          {authMode === "login" ? <Login /> : <Signup />}
        </ModalForm>
      )}
    </div>
  );
}

export default Authorization;
