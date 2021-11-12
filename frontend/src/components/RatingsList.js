import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { SiteContext } from "../SiteContext";
import { RatingsItem } from "./RatingsItem";
import { useLocalStorage } from "./useLocalStorage";

export const RatingsList = () => {
  const { stakeToken, isStakeAuthLoading, watchlistSymbols } = useContext(UserContext);
  const { equityPositions } = useContext(SiteContext);
  const filterCountOptions = [10, 20, 30, 40, 50];
  const [selectedFilterCount, setSelectedFilterCount] = useLocalStorage(
    "stakeRatingsSelectedFilterCount",
    filterCountOptions[0]
  );

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center justify-center px-3 py-3 min-w-full space-y-3">
        <div className="flex items-center pb-4 gap-2">
          Filter to latest:
          {filterCountOptions.map((count) => {
            return (
              <button
                key={count}
                onClick={() => setSelectedFilterCount(count)}
                className={` ${
                  selectedFilterCount === count ? "bg-black text-white" : "bg-gray-200"
                } rounded px-2 py-1.5`}
              >
                {count}
              </button>
            );
          })}
        </div>

        <div className="flex items-start justify-center gap-6 w-6/12">
          <div className="flex flex-col space-y-2">
            <div className="text-center text-base font-semibold bg-gray-200 rounded">Portfolio</div>
            {stakeToken && equityPositions && (
              <table className="w-11/12 font-medium text-center max-w-md">
                <thead>
                  <tr className="border-b-2 border-gray-700">
                    <th>Code</th>
                    <th className="">Ratings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {equityPositions.map((position) => {
                    return (
                      <RatingsItem
                        key={position.symbol}
                        symbol={position.symbol}
                        selectedFilterCount={selectedFilterCount}
                      />
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <div className="text-center text-base font-semibold bg-gray-200 rounded">Watchlist</div>
            {stakeToken && watchlistSymbols && (
              <table className="w-11/12 font-medium text-center max-w-md">
                <thead>
                  <tr className="border-b-2 border-gray-700">
                    <th>Code</th>
                    <th className="">Ratings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {watchlistSymbols.map((symbol) => {
                    return (
                      <RatingsItem key={symbol} symbol={symbol} selectedFilterCount={selectedFilterCount} />
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
