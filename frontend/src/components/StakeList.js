import { useState } from "react";
import { StakeItem } from "./StakeItem";
import { isPositive, showValueWithSign, showValueWithComma } from "../utils";
import { useLocalStorage } from "./useLocalStorage";
import { LoadingIcon } from "./LoadingIcon";

export const StakeList = ({
  marketName,
  flag,
  marketStatus,
  equityPositions,
  equityValue,
  totalChangeSum,
  equityValueInAud,
  isEquityPositionsLoading,
  dayChangeSum,
  dayChangePercentage,
  totalChangePercentage,
  transactionHistory,
  setFocusedIndex,
  focusedIndex,
}) => {
  const [showItems, setShowItems] = useLocalStorage(`stakeShowItems-${flag}`, true);

  return (
    <div className="flex flex-col bg-white border-xl  py-3 space-y-2 px-6 w-full md:w-2/3 min-w-min relative">
      <div className="flex justify-center ">
        <div className="absolute top-0 left-2 uppercase text-center">
          <div className="text-4xl">{flag}</div>
          <div className="text-xs text-gray-500">{marketName}</div>
        </div>
        <div className="absolute top-2 right-2 text-gray-500 space-y-0.5 text-sm">
          <div className="flex items-center justify-end gap-1">
            <div
              className={`w-3 h-3 rounded-full ${
                marketStatus === "open"
                  ? "bg-green-500"
                  : marketStatus === "pre"
                  ? "bg-yellow-500"
                  : "bg-gray-400"
              }`}
            ></div>
            <div className="text-xs uppercase">{marketStatus}</div>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-center py-3">
        <div className="text-4xl">{showValueWithComma(equityValueInAud, true)}</div>
        <div className={`text-2xl ml-2 ${isPositive(totalChangeSum) ? "text-green-600" : "text-red-600"}`}>
          ({`${showValueWithSign(totalChangePercentage, "")}%`})
        </div>
        {isEquityPositionsLoading ? <LoadingIcon /> : ""}
      </div>

      {showItems && (
        <div className="flex justify-center">
          {equityPositions && (
            <table className="w-full text-center max-w-3xl">
              <thead>
                <tr className="border-b-2 border-gray-700 text-right">
                  <th className="text-center">No</th>
                  <th className="text-left">Code</th>
                  <th className="">Last</th>
                  <th className="">Value</th>
                  <th className="">Day P/L</th>
                  <th className="">Total P/L</th>
                  <th className="">Allocation</th>
                  <th>
                    <div className="flex items-center justify-end">
                      Yahoo
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {equityPositions.map((position, index) => {
                  return (
                    <StakeItem
                      index={index}
                      marketName={marketName}
                      focusedIndex={marketName === "asx" ? -1 : focusedIndex}
                      setFocusedIndex={setFocusedIndex}
                      key={position.symbol}
                      position={position}
                      equityValue={equityValue}
                      transactionHistory={transactionHistory}
                    />
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-700 text-right">
                  <td></td>
                  <td></td>
                  <td className="py-1 font-semibold">Totals</td>
                  <td>{showValueWithComma(equityValue)}</td>
                  <td className={`${isPositive(dayChangeSum) ? "text-green-600" : "text-red-600"}`}>
                    {showValueWithSign(dayChangeSum, "")}
                    <span className="ml-1">({`${showValueWithSign(dayChangePercentage, "")}%`})</span>
                  </td>
                  <td className={`${isPositive(totalChangeSum) ? "text-green-600" : "text-red-600"}`}>
                    {showValueWithSign(totalChangeSum, "")}
                    <span className="ml-1">({`${showValueWithSign(totalChangePercentage, "")}%`})</span>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      )}

      <div className="flex justify-center">
        <button onClick={() => setShowItems(!showItems)} className="text-gray-500 uppercase text-xs">
          {showItems ? "Show less" : "Show more"}
        </button>
      </div>
    </div>
  );
};
