import Layout from "../Component/Layout";
import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../Context/GlobalState";
import { type UserProfile } from "../Types/Interafaces";
import image_default from "../assets/image_default.svg.png";
import "../Component/Elements/SearchAndFollow.css";

function Search() {
  const { state, dispatch, handleNavigateToUserId, getAllUsers } =
    useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data: UserProfile[] = await getAllUsers();
        dispatch({ type: "SET_USERS", payload: data });
      } catch (err) {
        return err;
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [getAllUsers, dispatch]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = useMemo((): UserProfile[] => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return state.users;

    return state.users.filter(
      (item) =>
        item.first_name.toLowerCase().includes(normalizedQuery) ||
        item.last_name.toLowerCase().includes(normalizedQuery),
    );
  }, [searchQuery, state.users]);

  return (
    <Layout>
      <div className="search-page-container">
        <header className="page-header">
          <h1 className="page-title">Find People</h1>
          <p className="page-subtitle">
            Discover and connect with other users on the platform.
          </p>
        </header>

        <div className="search-bar-container">
          <svg
            className="search-bar-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleInputChange}
            className="search-bar-input"
          />
        </div>

        <main>
          <h2 className="section-title">
            {searchQuery
              ? `Search Results (${filteredUsers.length})`
              : "People you may know"}
          </h2>

          {isLoading ? (
            <div className="status-msg">Loading amazing people...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="status-msg">
              <p style={{ fontWeight: "600", marginBottom: "4px" }}>
                No results found
              </p>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>
                Try checking the spelling or search for someone else.
              </p>
            </div>
          ) : (
            <div className="user-list-grid">
              {filteredUsers.map((user) => (
                <div
                  key={user.user_id}
                  className="user-card"
                  onClick={() => handleNavigateToUserId(user.user_id)}
                >
                  <img
                    src={user.avatar || image_default}
                    alt={user.first_name}
                    className="user-avatar"
                  />
                  <div className="user-card-info">
                    <span className="user-card-name">
                      {user.first_name} {user.last_name}
                    </span>
                    <span className="user-card-handle">
                      @{user.first_name.toLowerCase()}
                    </span>
                  </div>
                  <button className="user-card-action-btn">View Profile</button>
                </div>
              ))}
            </div>
          )}
        </main>

        {state.currentUser && (
          <footer className="search-footer">
            <span style={{ color: "#666" }}>Logged in as:</span>
            <strong style={{ marginLeft: "6px" }}>
              {state.currentUser.first_name} {state.currentUser.last_name}
            </strong>
          </footer>
        )}
      </div>
    </Layout>
  );
}
export default Search;
