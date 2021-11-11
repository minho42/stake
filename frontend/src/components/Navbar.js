import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Link, useHistory, useLocation } from "react-router-dom";

export const Navbar = () => {
  const { stakeToken, setStakeToken } = useContext(UserContext);
  const history = useHistory();
  const { pathname } = useLocation();

  const requestLogout = async (stakeToken, setStakeToken, history) => {
    try {
      const res = await fetch("http://localhost:4000/stake/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("requestLogout failed");
      }
      setStakeToken(null);
      localStorage.clear();
      history.push("/");
    } catch (error) {
      console.log(error);
      setStakeToken(null);
      localStorage.clear();
      history.push("/");
    }
  };

  return (
    <nav>
      <header className="flex justify-center border-b border-gray-300 shadow-sm">
        <div className="flex items-center justify-end h-14">
          <Link
            to="/"
            className={`flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 hover:bg-gray-100 capitalize gap-1 ${
              pathname === "/" ? " border-gray-700" : "border-transparent"
            }`}
          >
            portfolio
          </Link>
          <Link
            to="/watchlist"
            className={`flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 hover:bg-gray-100 capitalize gap-1 ${
              pathname === "/watchlist" ? " border-gray-700" : "border-transparent"
            }`}
          >
            watchlist
          </Link>
          <Link
            to="/dividend"
            className={`flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 hover:bg-gray-100 capitalize gap-1 ${
              pathname === "/dividend" ? " border-gray-700" : "border-transparent"
            }`}
          >
            dividend
          </Link>
          <Link
            to="/ratings"
            className={`flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 hover:bg-gray-100 capitalize gap-1 ${
              pathname === "/ratings" ? " border-gray-700" : "border-transparent"
            }`}
          >
            ratings
          </Link>
          {!stakeToken && (
            <Link
              to="/login"
              className={`flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 hover:bg-gray-100 capitalize gap-1 ${
                pathname === "/login" ? " border-gray-700" : "border-transparent"
              }`}
            >
              login
            </Link>
          )}
          {stakeToken && (
            <button
              onClick={() => requestLogout(stakeToken, setStakeToken, history)}
              className="flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 hover:bg-gray-100 capitalize gap-1 border-transparent"
            >
              logout
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          )}
          <Link
            to="/about"
            className={`flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 hover:bg-gray-100 capitalize gap-1 ${
              pathname === "/about" ? " border-gray-700" : "border-transparent"
            }`}
          >
            about
          </Link>
        </div>
      </header>
    </nav>
  );
};
