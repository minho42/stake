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
      <header className="flex justify-center md:justify-end border-b border-gray-300 shadow-sm">
        <div className="flex items-center justify-end h-14">
          <Link
            to="/"
            className={`flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 capitalize ${
              pathname === "/" ? " border-gray-700" : "border-white"
            }`}
          >
            portfolio
          </Link>
          <Link
            to="/dividend"
            className={`flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 capitalize ${
              pathname === "/dividend" ? " border-gray-700" : "border-white"
            }`}
          >
            dividend
          </Link>
          <Link
            to="/ratings"
            className={`flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 capitalize ${
              pathname === "/ratings" ? " border-gray-700" : "border-white"
            }`}
          >
            ratings
          </Link>
          {!stakeToken && (
            <Link
              to="/login"
              className={`flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 capitalize ${
                pathname === "/login" ? " border-gray-700" : "border-white"
              }`}
            >
              login
            </Link>
          )}
          {stakeToken && (
            <button
              onClick={() => requestLogout(stakeToken, setStakeToken, history)}
              className="flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 capitalize border-white"
            >
              logout
            </button>
          )}
          <Link
            to="/about"
            className={`flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 capitalize ${
              pathname === "/about" ? " border-gray-700" : "border-white"
            }`}
          >
            about
          </Link>
        </div>
      </header>
    </nav>
  );
};
