import { StakeRatings } from "./StakeRatings";
import { NasdaqRatings } from "./NasdaqRatings";
import { NasdaqConsensusRatings } from "./NasdaqConsensusRatings";

export const RatingsItem = ({ symbol, selectedFilterCount }) => {
  return (
    <tr className="text-center divide-x-2 divide-black">
      <td className="px-1 py-1 text-left">{symbol}</td>
      <td>
        <StakeRatings symbol={symbol} selectedFilterCount={selectedFilterCount} />
      </td>
      {/* <td>
        <NasdaqRatings symbol={symbol} />
      </td> */}
      <td className="">
        <NasdaqConsensusRatings symbol={symbol} />
      </td>
    </tr>
  );
};
