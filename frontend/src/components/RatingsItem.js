import { StakeRatings } from "./StakeRatings";

export const RatingsItem = ({ position: { symbol, name }, selectedFilterCount }) => {
  return (
    <tr>
      <td className="py-1">{symbol}</td>
      <td>
        <StakeRatings symbol={symbol} name={name} selectedFilterCount={selectedFilterCount} />
      </td>
    </tr>
  );
};
