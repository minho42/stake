import { useContext } from "react";
import { SiteContext } from "../SiteContext";
import { StakePrevList } from "./StakePrevList";

export const StakeHistory = () => {
  const { transactionHistory, transactionHistoryAsx, prevSymbols, prevSymbolsAsx } = useContext(SiteContext);

  return (
    <div className="flex items-start justify-center gap-3 px-3 py-3">
      <StakePrevList
        marketName="wall st"
        flag="🇺🇸"
        prevSymbols={prevSymbols}
        transactionHistory={transactionHistory}
      />

      <StakePrevList
        marketName="asx"
        flag="🇦🇺"
        prevSymbols={prevSymbolsAsx}
        transactionHistory={transactionHistoryAsx}
      />
    </div>
  );
};
