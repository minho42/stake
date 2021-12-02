import { useState, useEffect, useContext } from "react";
import { SiteContext } from "../SiteContext";
import { StakePrevItem } from "./StakePrevItem";
import { StakePrevItemAsx } from "./StakePrevItemAsx";
import { isPositive, showValueWithSign } from "../utils";

export const StakePrevList = () => {
  const { isStakeChartModalOpen, transactionHistory, transactionHistoryAsx, prevSymbols, prevSymbolsAsx } =
    useContext(SiteContext);
  const [focusedIndexHistory, setFocusedIndexHistory] = useState(0);

  const keyboardShortcuts = (e) => {
    if (isStakeChartModalOpen) return;

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
    <div className="flex items-start justify-center gap-3 py-3">
      <div className="flex flex-col w-72 space-y-3">
        <div className="flex justify-center uppercase font-semibold bg-gray-200">wall st</div>
        <div className="flex justify-center">
          <table className="w-11/12 text-center max-w-xs">
            <thead>
              <tr className="border-b-2 border-gray-700 text-right">
                <th className="text-center">No</th>
                <th className="text-left">Code</th>
                <th>Total P/L</th>
                <th>Last sold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {prevSymbols &&
                prevSymbols.map((symbol, index) => {
                  return (
                    <StakePrevItem
                      key={symbol}
                      index={index}
                      symbol={symbol}
                      focusedIndexHistory={focusedIndexHistory}
                      setFocusedIndexHistory={setFocusedIndexHistory}
                      // TODO: fetch transaction data in StakeChartModal instead of passing from parent?
                      transactionHistory={transactionHistory}
                    />
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col w-72 space-y-3">
        <div className="flex justify-center uppercase font-semibold bg-gray-200">asx</div>
        <div className="flex justify-center">
          <table className="w-11/12 text-center max-w-xs">
            <thead>
              <tr className="border-b-2 border-gray-700 text-right">
                <th className="text-center">No</th>
                <th className="text-left">Code</th>
                <th>Total P/L</th>
                <th>Last sold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {prevSymbolsAsx &&
                prevSymbolsAsx.map((symbol, index) => {
                  return (
                    <StakePrevItemAsx
                      key={symbol}
                      index={index}
                      symbol={symbol}
                      transactionHistory={transactionHistoryAsx}
                    />
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
