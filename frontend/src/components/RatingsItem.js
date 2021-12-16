import { StakeRatings } from "./StakeRatings";
import { NasdaqRatings } from "./NasdaqRatings";

export const RatingsItem = ({ symbol, selectedFilterCount }) => {
  return (
    <tr className="text-center">
      <td className="py-1 text-left">{symbol}</td>
      <td>
        <StakeRatings symbol={symbol} selectedFilterCount={selectedFilterCount} />
      </td>
      <td>
        <NasdaqRatings symbol={symbol} />
      </td>
    </tr>
  );
};
