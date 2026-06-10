import { useContext, useState, type ReactNode } from "react";
import { differenceInYears } from "date-fns";
import { AppContext } from "../../Context/GlobalState";
import Modal from "../Elements/Modal";
import CreationPost from "./creationPost";
import type { UserProfile } from "../../Types/Interafaces";
import FollowList from "../ActionUser/FollowList";
import Avatar from "../ActionUser/Avatar";
import image_default from "../../assets/image_default.svg.png";

function ProfilePage({
  children,
  profileUser,
  isOwnProfile,
}: {
  children: ReactNode;
  profileUser: UserProfile | null;
  isOwnProfile: boolean;
}) {
  const { state, dispatch, handleEditProfileClick, toggleFollowing } =
    useContext(AppContext);

  const [actionUser, setActionUser] = useState<
    "post" | "followerList" | "followingList" | "avatar" | null
  >(null);

  const isFollowing =
    !!profileUser &&
    state.currentUser?.following?.includes(profileUser.user_id);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    dispatch({
      type: "LOGOUT",
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

  const modalSize =
    actionUser === "avatar" ? "sm" : actionUser === "post" ? "md" : "md";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex-shrink-0">
          {isOwnProfile && (
            <div className="flex justify-end w-full">
              <button
                onClick={handleLogOut}
                className="rounded-md border border-gray-600 px-4 py-1.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#393b47]"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
        <header className="flex flex-col items-center gap-6 border-b border-gray-700 pb-10 sm:flex-row sm:items-start sm:gap-12">
          <div className="flex-shrink-0">
            <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gray-200 sm:h-32 sm:w-32 bg-gray-800">
              <a onClick={() => setActionUser("avatar")}>
                <img
                  src={profileUser?.avatar || image_default}
                  alt={`${profileUser?.first_name || "User"}'s profile picture`}
                  className="h-full w-full object-cover cursor-pointer hover:brightness-90 transition"
                  loading="eager"
                />
              </a>
            </div>
          </div>

          <div className="flex flex-grow flex-col items-center text-center sm:items-start sm:text-left w-full">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold text-gray-300 sm:text-3xl">
                {profileUser?.first_name} {profileUser?.last_name}'s Profile
              </h1>

              <div className="flex gap-4 text-sm font-medium mt-1">
                <button
                  onClick={() => setActionUser("followerList")}
                  className="text-gray-300 hover:text-gray-400  transition-colors focus:outline-none"
                >
                  Followers{" "}
                  <span className="font-bold text-gray-100">
                    {profileUser?.followers?.length || 0}
                  </span>
                </button>
                <span className="text-gray-600">|</span>
                <button
                  onClick={() => setActionUser("followingList")}
                  className="text-gray-300 hover:text-gray-400  transition-colors focus:outline-none"
                >
                  Following{" "}
                  <span className="font-bold text-gray-100">
                    {profileUser?.following?.length || 0}
                  </span>
                </button>
              </div>
              <div className="mt-2 space-y-1 text-sm text-gray-400">
                <p className="hover:text-gray-300 transition-colors">
                  {profileUser?.email}
                </p>
                {profileUser?.location && <p>📍 {profileUser.location}</p>}
                {profileUser?.interests && (
                  <p>🎨 Interests: {profileUser.interests}</p>
                )}
                {profileUser?.about_me && (
                  <p className="italic mt-2 text-gray-300">
                    " {profileUser.about_me} "
                  </p>
                )}
              </div>
              <span>
                {profileUser?.date_of_birth &&
                  differenceInYears(
                    new Date(),

                    new Date(profileUser.date_of_birth),
                  )}
              </span>
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
                <button
                  onClick={handleFollow}
                  className={`rounded-md px-6 py-2 text-sm font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 ${
                    isFollowing
                      ? "bg-gray-700 text-gray-200 hover:bg-red-900 hover:text-white hover:border-red-700"
                      : "bg-gray-500 text-white hover:bg-gray-700"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="w-full">{children}</main>
      </div>

      {actionUser && (
        <Modal onClose={() => setActionUser(null)} size={modalSize}>
          <button
            className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700"
            onClick={() => setActionUser(null)}
          >
            {" "}
            X{" "}
          </button>
          {(() => {
            switch (actionUser) {
              case "post":
                return <CreationPost />;
              case "followerList":
                return (
                  <FollowList
                    type="followers"
                    user_id={profileUser?.user_id ?? ""}
                    onClose={() => setActionUser(null)}
                  />
                );
              case "followingList":
                return (
                  <FollowList
                    type="following"
                    user_id={profileUser?.user_id ?? ""}
                    onClose={() => setActionUser(null)}
                  />
                );
              case "avatar":
                return (
                  <Avatar
                    type="avatar"
                    avatar={profileUser?.avatar ?? ""}
                    onClose={() => setActionUser(null)}
                  />
                );
              default:
                return null;
            }
          })()}
        </Modal>
      )}
    </div>
  );
}

export default ProfilePage;
