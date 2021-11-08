import { StakeRatings } from "./StakeRatings";

export const RatingsItem = ({ position: { symbol, name }, filterCount }) => {
  return (
    <tr>
      <td className="py-1">{symbol}</td>
      <td>
        <StakeRatings symbol={symbol} name={name} filterCount={filterCount} />
      </td>
    </tr>
  );
};
