import { useState } from "react";
import Login from "../Authorization/Login";
import Signup from "../Authorization/Signup";

function ModalAuthFlow({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"menu" | "login" | "signup">("menu");

  if (mode === "login") {
    return <Login onClose={onClose} />; // Renders nicely inside your bright modal frame
  }

  if (mode === "signup") {
    return <Signup onClose={onClose} />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-gray-900">
      {/* Mini Visual Icon/Header instead of the massive hero image */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Connect with everyone
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Join our community to like posts, comment, and save your favorites!
        </p>
      </div>

      {/* Clean, matching buttons */}
      <div className="flex w-full max-w-sm flex-col gap-3">
        <button
          onClick={() => setMode("login")}
          className="w-full rounded-lg bg-gray-800 py-3 font-semibold text-white transition hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Log in
        </button>
        <button
          onClick={() => setMode("signup")}
          className="w-full rounded-lg border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Sign up
        </button>
        <button
          onClick={onClose}
          className="w-full rounded-lg border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ModalAuthFlow;
