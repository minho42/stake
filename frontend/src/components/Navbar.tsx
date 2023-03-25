import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const Navbar = () => {
  const { stakeToken, setStakeToken } = useContext(UserContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const requestLogout = async (stakeToken, setStakeToken, navigate) => {
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
      navigate("/");
    } catch (error) {
      console.log(error);
      setStakeToken(null);
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <nav>
      <header className="flex justify-center border-b border-gray-300 shadow-sm text-base">
        <div className="flex items-center justify-end h-14">
          <Link
            to="/"
            className={`flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 capitalize gap-1 ${
              pathname === "/" ? " border-primary" : "border-transparent"
            }`}
          >
            portfolio
          </Link>
          <Link
            to="/dividend"
            className={`flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 capitalize gap-1 ${
              pathname === "/dividend" ? " border-primary" : "border-transparent"
            }`}
          >
            dividend
          </Link>
          {!stakeToken && (
            <Link
              to="/login"
              className={`flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 capitalize gap-1 ${
                pathname === "/login" ? " border-primary" : "border-transparent"
              }`}
            >
              login
            </Link>
          )}
          {stakeToken && (
            <button
              onClick={() => requestLogout(stakeToken, setStakeToken, navigate)}
              className="flex items-center h-full font-medium px-2 sm:px-4 py-3 cursor-pointer border-b-4 capitalize gap-1 border-transparent"
            >
              logout
            </button>
          )}
        </div>
      </header>
    </nav>
  );
};
