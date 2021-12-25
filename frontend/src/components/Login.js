import { useContext, useState, useRef } from "react";
import { UserContext } from "../UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ExclamationIcon } from "@heroicons/react/solid";

export const requestStakeLogin = async (stakeToken, setStakeToken) => {
  try {
    if (!stakeToken) {
      throw new Error("requestStakeLogin: !stakeToken");
    }
    const res = await fetch("http://localhost:4000/stake/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ stakeToken }),
    });
    if (!res.ok) {
      throw new Error("requestStakeLogin failed");
    }
    const { stakeToken: validToken } = await res.json();
    // console.log(validToken);
    setStakeToken(validToken);
    return validToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const Login = () => {
  const [inputToken, setInputToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { stakeToken, setStakeToken } = useContext(UserContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  const inputTokenRef = useRef();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!inputToken) {
      inputTokenRef.current.focus();
      return setErrorMessage("Please enter your token");
    }
    const validToken = await requestStakeLogin(inputToken, setStakeToken);
    if (validToken) {
      return navigate(state?.from || "/");
    }
    inputTokenRef.current.focus();
    setErrorMessage("Invalid stakeToken");
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-md w-full px-4 p-4">
        {!stakeToken ? (
          <div className="space-y-4 m-3">
            <span className="text-2xl font-medium">Log in to Stake</span>
            <form className="space-y-4">
              <div>
                <label htmlFor="inputToken" className="font-medium text-gray-600">
                  Token
                </label>
                <input
                  ref={inputTokenRef}
                  onChange={(e) => setInputToken(e.target.value.trim())}
                  type="password"
                  id="inputToken"
                  placeholder="stake-session-token"
                  className="input w-full"
                />

                {errorMessage && (
                  <div className="flex items-center text-red-500 mt-3 space-x-2">
                    <ExclamationIcon className="h-4 w-4" />

                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              <div>
                <button onClick={handleLogin} className="btn w-full">
                  Log in
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center">logged in</div>
        )}
      </div>
    </div>
  );
};
