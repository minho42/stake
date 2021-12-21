import { useContext } from "react";
import { UserContext } from "../UserContext";
import { RatingsItem } from "./RatingsItem";

export const RatingsList = ({ title, symbols, selectedFilterCount }) => {
  const { stakeToken } = useContext(UserContext);

  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="text-center text-base font-semibold bg-gray-200 capitalize py-1">{title}</div>
      {stakeToken && symbols && (
        <table className="w-11/12 text-centel max-w-md">
          <thead>
            <tr className="border-b-2 border-gray-700 divide-x-2 divide-black">
              <th className="text-left">Symbol</th>
              <th className="">Stake ratings</th>
              <th className="">Nasdaq consensus</th>
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
