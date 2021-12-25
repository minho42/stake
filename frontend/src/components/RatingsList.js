import { useContext } from "react";
import { UserContext } from "../UserContext";
import { RatingsItem } from "./RatingsItem";
import { ExternalLinkIcon } from "@heroicons/react/outline";

export const RatingsList = ({ title, symbols, selectedFilterCount }) => {
  const { stakeToken } = useContext(UserContext);

  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="text-center text-base font-semibold bg-gray-200 capitalize py-1">{title}</div>
      {stakeToken && symbols && (
        <table className="text-centel">
          <thead>
            <tr className="border-b-2 border-gray-700 divide-x-2 divide-black">
              <th className="text-left">Symbol</th>
              <th>Stake ratings</th>
              <th>Nasdaq consensus</th>
              <th>
                <div className="flex items-center justify-center">
                  Yahoo
                  <ExternalLinkIcon className="w-5 h-5" />
                </div>
              </th>
              <th>
                <div className="flex items-center justify-center">
                  Finviz
                  <ExternalLinkIcon className="w-5 h-5" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {symbols.map((symbol) => {
              return <RatingsItem key={symbol} symbol={symbol} selectedFilterCount={selectedFilterCount} />;
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
