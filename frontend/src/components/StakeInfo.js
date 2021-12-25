import { useContext } from "react";
import { UserContext } from "../UserContext";
import { SiteContext } from "../SiteContext";

export const StakeInfo = () => {
  const { stakeToken, userInfo } = useContext(UserContext);
  const { currencyUsdAud, currencyAudUsd, cashStatus } = useContext(SiteContext);

  return (
    <div className="flex flex-col text-gray-500 space-y-1 divide-y divide-gray-300 text-right">
      {stakeToken && userInfo && (
        <div className="flex justify-end font-semibold">{userInfo.firstName + " " + userInfo.lastName}</div>
      )}
      <div>AUD/USD: {currencyAudUsd && currencyAudUsd.toFixed(3)}</div>
      <div>USD/AUD: {currencyUsdAud && currencyUsdAud.toFixed(3)}</div>
      <div>Cash: {cashStatus && cashStatus.cashAvailableForTrade}</div>
      <div>Pending: {cashStatus && cashStatus.pendingOrdersAmount}</div>
    </div>
  );
};
