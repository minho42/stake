import { StakeRatings } from "./StakeRatings";

export const RatingsItem = ({ symbol, selectedFilterCount }) => {
  return (
    <tr className="text-center">
      <td className="py-1">{symbol}</td>
      <td>
        <StakeRatings symbol={symbol} selectedFilterCount={selectedFilterCount} />
      </td>
    </tr>
  );
};
