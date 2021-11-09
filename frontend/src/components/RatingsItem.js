import { StakeRatings } from "./StakeRatings";

export const RatingsItem = ({ position: { symbol, name }, selectedFilterCount }) => {
  return (
    <tr className="hover:bg-gray-100 cursor-pointer text-center">
      <td className="py-1">{symbol}</td>
      <td>
        <StakeRatings symbol={symbol} name={name} selectedFilterCount={selectedFilterCount} />
      </td>
    </tr>
  );
};
