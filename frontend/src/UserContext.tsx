import { createContext, useState, useEffect } from "react";
import { CheckUser } from "./CheckUser";

type UserContextType = {
  stakeToken: string | null;
  setStakeToken: React.Dispatch<React.SetStateAction<string | null>>;
  isStakeAuthLoading: boolean;
  setIsStakeAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: any;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }) => {
  const [stakeToken, setStakeToken] = useState<string | null>(null);
  const [isStakeAuthLoading, setIsStakeAuthLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  const fetchUserInfo = async () => {
    if (!stakeToken) return;

    try {
      const res = await fetch(`https://global-prd-api.hellostake.com/api/sessions/v2/${stakeToken}`);
      if (!res.ok) {
        throw new Error("fetchUserInfo failed");
      }
      const data = await res.json();
      setUserInfo(data);
    } catch (error) {
      console.log(error);
      setUserInfo(null);
    }
  };

  useEffect(() => {
    CheckUser(setStakeToken, setIsStakeAuthLoading);
  }, []);

  useEffect(() => {
    fetchUserInfo();
  }, [stakeToken]);

  useEffect(() => {}, [userInfo]);

  return (
    <UserContext.Provider
      value={{
        stakeToken,
        setStakeToken,
        isStakeAuthLoading,
        setIsStakeAuthLoading,
        userInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
