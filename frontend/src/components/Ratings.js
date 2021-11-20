import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { SiteContext } from "../SiteContext";
import { RatingsList } from "./RatingsList";
import { useLocalStorage } from "./useLocalStorage";

export const Ratings = () => {
  const { stakeToken, watchlistSymbols } = useContext(UserContext);
  const { prevSymbols } = useContext(SiteContext);
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

        <div className="flex items-start justify-evenly gap-4 w-8/12">
          <RatingsList
            title="portfolio"
            key="portfolio"
            symbols={equityPositions.map((p) => p.symbol)}
            selectedFilterCount={selectedFilterCount}
          />
          <RatingsList
            title="watchlist"
            key="watchlist"
            symbols={watchlistSymbols}
            selectedFilterCount={selectedFilterCount}
          />
          <RatingsList
            title="history"
            key="history"
            symbols={prevSymbols}
            selectedFilterCount={selectedFilterCount}
          />
        </div>
      </div>
    </div>
  );
};
