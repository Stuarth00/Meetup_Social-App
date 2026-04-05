import { useState } from "react";
import ModalForm from "./Modal";
import Login from "./Login";
import Signup from "./Signup";

function Authorization() {
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative aspect-video w-full md:aspect-auto md:h-full">
        <img
          src="/Image.png"
          alt="app.logo"
          className="absolute inset-0 h-full w-full object-cover mt-16"
        />
      </div>

      <div className="flex flex-col items-start justify-start pt-8 px-8 md:justify-center md:pt-0 md:px-16 lg:px-24">
        <div className="mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-600 md:text-5xl">
            Conecta con todos
          </h1>
          <p className="mt-2 text-gray-600">Join our comminity right away!</p>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-3">
          <button
            onClick={() => setAuthMode("login")}
            className="w-full rounded-lg bg-gray-600 py-3 font-semibold text-white transition hover:bg-gray-700"
          >
            Log in
          </button>
          <button
            onClick={() => setAuthMode("signup")}
            className="w-full rounded-lg border border-gray-300 py-3 font-semibold text-white transition hover:bg-gray-50 hover:text-black"
          >
            Sign up
          </button>
        </div>
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
