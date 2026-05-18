import { useContext, useState, type ReactNode } from "react";
import { differenceInYears } from "date-fns";
import { AppContext } from "../../Context/GlobalState";
import Modal from "../Authorization/Modal";
import CreationPost from "./creationPost";
import type { UserProfile } from "../../Types/Interafaces";

function ProfilePage({
  children,
  profileUser,
  isOwnProfile,
}: {
  children: ReactNode;
  profileUser: UserProfile | null;
  isOwnProfile: boolean;
}) {
  const {
    state,
    dispatch,
    asyncSimulate,
    LoadingSpinner,
    handleEditProfileClick,
    toggleFollowing,
  } = useContext(AppContext);

  const [actionUser, setActionUser] = useState<"post" | "edit" | null>(null);

  const isFollowing =
    !!profileUser &&
    state.currentUser?.following?.includes(profileUser.user_id);

  const handleLogOut = () => {
    asyncSimulate(() => {
      dispatch({
        type: "LOGOUT",
      });
    });
  };

  const handleFollow = async () => {
    const target_id = profileUser?.user_id;
    if (!target_id) return;
    const followAction: "followed" | "unfollowed" = isFollowing
      ? "unfollowed"
      : "followed";

    if (target_id) {
      await toggleFollowing(target_id);
      dispatch({
        type: "TOGGLE_FOLLOW",
        payload: {
          targetUserId: target_id,
          followAction,
        },
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* {state.currentUser ? ( */}
      <div className="flex flex-col gap-8">
        <div className="flex-shrink-0">
          {isOwnProfile ? (
            <button
              onClick={handleLogOut}
              className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Log Out
            </button>
          ) : null}
        </div>
        <header className="flex flex-col items-center gap-6 border-b pb-10 sm:flex-row sm:itmes-start sm:gap-12">
          <div className="flex-shrink-0">
            <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gray-200 sm:h-32 sm:w-32">
              <img
                src={profileUser?.avatar || "/default-avatar.png"}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-grow flex-col items-center text-center sm:items-start sm:text-left">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold text-gray-300 sm:text-3xl">
                {profileUser?.first_name} {profileUser?.last_name}'s Profile
              </h1>
              <span>Followers: {profileUser?.followers?.length || 0}</span>
              <span>Following: {profileUser?.following?.length || 0}</span>
              <p className="text-gray-400">{profileUser?.email}</p>
              <p className="text-gray-400">{profileUser?.location}</p>
              <p className="text-gray-400">{profileUser?.interests}</p>
              <p className="text-gray-400">About Me: {profileUser?.about_me}</p>
              <div className="mt-4 flex gap-6 text-sm">
                <span>
                  {profileUser?.date_of_birth &&
                    differenceInYears(
                      new Date(),

                      new Date(profileUser.date_of_birth),
                    )}
                </span>
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex flex-row gap-8 mt-6">
              {isOwnProfile && (
                <>
                  <button
                    onClick={() => setActionUser("post")}
                    className="w-full rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                  >
                    Create a post
                  </button>
                  <button
                    onClick={() => handleEditProfileClick()}
                    className="w-full rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                  >
                    Edit profile
                  </button>
                </>
              )}
              {!isOwnProfile && (
                <button onClick={() => handleFollow()}>
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          </div>
        </header>
        <LoadingSpinner />

        <main className="w-full">{children}</main>
        {/* Add more profile details here */}
      </div>
      {/* ) : (
        <Authorization />
      )} */}
      {actionUser && (
        <Modal onClose={() => setActionUser(null)}>
          {actionUser === "post" ? <CreationPost /> : null}
        </Modal>
      )}
    </div>
  );
}

export default ProfilePage;
