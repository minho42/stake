import { useEffect, useState } from "react";
import { addDays } from "date-fns";
import { dateStrToTimestamp, timestampToDate } from "../utils";

export const HeatMap = ({ transactionHistory }) => {
  const [dates, setDates] = useState([]);
  const [buyDates, setBuyDates] = useState([]);
  const [sellDates, setSellDates] = useState([]);

  const totalWeeks = 52;
  const totalDays = 7 * totalWeeks;

  const setAllDates = () => {
    const tempDates = [];
    const endDate = new Date();
    let startDate = addDays(endDate, -totalDays);
    for (let i = 0; i < totalDays; i++) {
      tempDates.push(addDays(startDate, 1));
      startDate = addDays(startDate, 1);
    }
    setDates(tempDates);
  };

  const setBuySellDates = () => {
    const tempBuyDates = [];
    const tempSellDates = [];

    transactionHistory.forEach((t) => {
      const d = timestampToDate(dateStrToTimestamp(t.timestamp));
      if (t.transactionType.toLowerCase() === "buy") {
        tempBuyDates.push(d);
      } else if (t.transactionType.toLowerCase() === "sell") {
        tempSellDates.push(d);
      }
    });

    setBuyDates(tempBuyDates);
    setSellDates(tempSellDates);
  };

  useEffect(() => {
    setAllDates();
    setBuySellDates();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="">Transactions</div>

      <div className="grid grid-flow-col grid-rows-5 bg-gray-100">
        {dates.map((d, i) => {
          if (d.getDay() % 6 > 5) {
            return;
          }

          return (
            <div
              key={i}
              className={`flex items-center justify-center w-3 h-3 bg-white 
              ${buyDates.includes(d.toLocaleDateString()) ? " bg-blue-500" : ""}
              ${
                sellDates.includes(d.toLocaleDateString())
                  ? "border-2 border-red-400"
                  : "border border-gray-300"
              }
              `}
            ></div>
          );
        })}
      </div>
    </div>
  );
};
