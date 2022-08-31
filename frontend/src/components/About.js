import { useContext } from "react";
import { HeatMap } from "./HeatMap";
import { SiteContext } from "../SiteContext";
export const About = () => {
  const { transactionHistory } = useContext(SiteContext);

  return (
    <div className="space-y-3">
      <div className="flex justify-center py-3 text-center">
        <div className="flex flex-col justify-center max-w-md w-full text-2xl">Stake</div>
      </div>

      <HeatMap transactionHistory={transactionHistory} />
    </div>
  );
};
