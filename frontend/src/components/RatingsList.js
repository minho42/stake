import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { SiteContext } from "../SiteContext";
import { RatingsItem } from "./RatingsItem";

export const RatingsList = () => {
  const { stakeToken, isStakeAuthLoading } = useContext(UserContext);
  const { equityPositions } = useContext(SiteContext);
  const [filterCount, setFilterCount] = useState(10);
  const filterCountOptions = [10, 20, 30];

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center justify-center px-3 py-6 min-w-full space-y-3">
        <div className="flex items-center pb-4 gap-3">
          Filter to latest:
          {filterCountOptions.map((count) => {
            return (
              <button
                onClick={() => setFilterCount(count)}
                className={` ${
                  filterCount === count ? "bg-green-200" : "bg-gray-100"
                }  rounded-lg px-2 py-1.5`}
              >
                {count}
              </button>
            );
          })}
        </div>

        {stakeToken && equityPositions && (
          <table className="w-11/12 text-sm font-medium text-center max-w-xl">
            <thead>
              <tr className="border-b-2 border-gray-700">
                <th>Code</th>
                <th>Ratings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {equityPositions.map((position) => {
                return <RatingsItem key={position.symbol} position={position} filterCount={filterCount} />;
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
