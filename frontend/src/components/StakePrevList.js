import { useState, useEffect, useContext } from "react";
import { SiteContext } from "../SiteContext";
import { StakePrevItem } from "./StakePrevItem";
import { StakePrevItemAsx } from "./StakePrevItemAsx";

export const StakePrevList = ({ marketName, flag, prevSymbols, transactionHistory }) => {
  const { isStakeChartModalOpen } = useContext(SiteContext);
  const [focusedIndexHistory, setFocusedIndexHistory] = useState(0);

  const keyboardShortcuts = (e) => {
    if (isStakeChartModalOpen) return;
    if (marketName === "asx") return;

    if (e.keyCode === 40 || e.keyCode === 74) {
      // move down
      let newIndex = focusedIndexHistory + 1;
      if (newIndex > prevSymbols.length - 1) {
        newIndex = 0;
      }
      setFocusedIndexHistory(newIndex);
    } else if (e.keyCode === 38 || e.keyCode === 75) {
      // move up
      let newIndex = focusedIndexHistory - 1;
      if (newIndex < 0) {
        newIndex = prevSymbols.length - 1;
      }
      setFocusedIndexHistory(newIndex);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyboardShortcuts);
    return () => {
      document.removeEventListener("keydown", keyboardShortcuts);
    };
  }, [focusedIndexHistory, prevSymbols, isStakeChartModalOpen]);

  return (
    <div className="flex flex-col w-80 space-y-3">
      <div className="flex items-center justify-center uppercase font-semibold bg-gray-200 gap-2">
        {marketName}
        <div className="text-3xl">{flag}</div>
      </div>
      <div className="flex justify-center">
        <table className="w-11/12 text-center max-w-xs">
          <thead>
            <tr className="border-b-2 border-gray-700 text-right">
              <th className="text-center">No</th>
              <th className="text-left">Symbol</th>
              <th>Total P/L</th>
              <th>Last sold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {prevSymbols &&
              prevSymbols.map((symbol, index) => {
                if (marketName === "wall st") {
                  return (
                    <StakePrevItem
                      key={symbol}
                      index={index}
                      symbol={symbol}
                      focusedIndexHistory={focusedIndexHistory}
                      setFocusedIndexHistory={setFocusedIndexHistory}
                      transactionHistory={transactionHistory}
                    />
                  );
                } else if (marketName === "asx") {
                  return (
                    <StakePrevItemAsx
                      key={symbol}
                      index={index}
                      symbol={symbol}
                      transactionHistory={transactionHistory}
                    />
                  );
                }
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
