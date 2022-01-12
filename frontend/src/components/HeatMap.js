import { useEffect, useState } from "react";
import { addDays } from "date-fns";
import { dateStrToTimestamp, timestampToDate } from "../utils";

export const HeatMap = ({ transactionHistory }) => {
  const monthColors = ["bg-gray-200", "bg-gray-100"];
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

  const countHowManyInArray = (array, x) => {
    let count = 0;
    array.forEach((a) => {
      if (a === x) {
        count++;
      }
    });
    return count;
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
      <div className="text-base font-semibold">Transactions</div>

      <div className="grid grid-flow-col grid-rows-5 ">
        {dates.map((d, i) => {
          if (d.getDay() % 6 > 5) {
            return;
          }

          return (
            <div
              key={i}
              className={`flex items-center justify-center w-4 h-4 rounded
              ${
                buyDates.includes(d.toLocaleDateString())
                  ? "bg-green-200 text-green-800"
                  : monthColors[d.getMonth() % 2]
              }
              ${
                sellDates.includes(d.toLocaleDateString()) ? "border-2 border-red-400" : "border border-white"
              }
              `}
            >
              {countHowManyInArray(buyDates, d.toLocaleDateString()) +
                countHowManyInArray(sellDates, d.toLocaleDateString()) >
              0
                ? countHowManyInArray(buyDates, d.toLocaleDateString()) +
                  countHowManyInArray(sellDates, d.toLocaleDateString())
                : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};
