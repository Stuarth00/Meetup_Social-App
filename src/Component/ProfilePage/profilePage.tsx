import { useContext, type ReactNode } from "react";
// import { useNavigate } from "react-router-dom";
import { differenceInYears } from "date-fns";
import { AppContext } from "../../Context/GlobalState";
import Authorization from "../Authorization/Authorization";

function ProfilePage({ children }: { children: ReactNode }) {
  const { state, dispatch, asyncSimulate, LoadingSpinner } =
    useContext(AppContext);
  // const navigate = useNavigate();

  const handleLogOut = () => {
    asyncSimulate(() => {
      dispatch({
        type: "LOGOUT",
      });
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {state.currentUser ? (
        <div className="flex flex-col gap-8">
          <header className="flex flex-col items-center gap-6 border-b pb-10 sm:flex-row sm:itmes-start sm:gap-12">
            <div className="flex-shrink-0">
              <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gray-200 sm:h-32 sm:w-32">
                <img
                  src="#"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-grow flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                  {state.currentUser.first_name} {state.currentUser.last_name}'s
                  Profile
                </h1>
                <p className="text-gray-500">
                  Email: {state.currentUser.email}
                </p>
                <div className="mt-4 flex gap-6 text-sm">
                  <span>
                    <strong>Age: </strong>{" "}
                    {differenceInYears(
                      new Date(),
                      new Date(state.currentUser.DateOfBirth),
                    )}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={handleLogOut}
                  className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:bg-gray-100"
                >
                  Log Out
                </button>
              </div>
            </div>
            <LoadingSpinner />
          </header>

          <main className="grid grid-cols-3 gap-1 md:gap-4">{children}</main>
          {/* Add more profile details here */}
        </div>
      ) : (
        <Authorization />
      )}
    </div>
  );
}

export default ProfilePage;
