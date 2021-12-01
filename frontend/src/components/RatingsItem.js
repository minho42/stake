import { StakeRatings } from "./StakeRatings";

export const RatingsItem = ({ symbol, selectedFilterCount }) => {
  return (
    <tr className="text-center">
      <td className="py-1 text-left">{symbol}</td>
      <td>
        <StakeRatings symbol={symbol} selectedFilterCount={selectedFilterCount} />
      </td>
    </tr>
  );
};
