import { useState } from "react";
import { showValueWithComma, timestampToDate, dateStrToTimestamp } from "../utils";

export const StakeTransactions = ({ transactions }) => {
  const [prevDotID, setPrevDotID] = useState(null);
  const [prevDotRadius, setPrevDotRadius] = useState(null);

  if (!transactions || transactions.length < 1) {
    return (
      <div className="bg-white p-2 divide-y space-y-1 overflow-y-auto" style={{ height: 470 }}>
        <div className="text-base text-center">No transaction data</div>
      </div>
    );
  }

  const handleHover = (id) => {
    if (prevDotID) {
      const prevDot = document.getElementById(prevDotID);
      if (prevDot) {
        prevDot.setAttribute("r", prevDotRadius);
      }
    }
    const dot = document.getElementById(id);
    setPrevDotID(id);
    if (dot) {
      setPrevDotRadius(dot.getAttribute("r"));
      dot.setAttribute("r", "10");
    }
  };

  return (
    <div className="bg-white px-2 py-1 divide-y space-y-1 overflow-y-auto" style={{ height: 470 }}>
      <div className="text-xl text-center">Transactions</div>

      {transactions.map((t) => {
        return (
          <div
            onMouseOver={() => handleHover(t.orderID)}
            key={t.orderID}
            className="flex flex-col items-center text-gray-500 px-1 py-0.5 hover:bg-gray-100 gap-1 cursor-pointer"
          >
            <div className="flex w-44 items-center gap-1">
              <div
                className={`${
                  t.transactionType.toLowerCase() === "buy" ? "bg-green-600" : "bg-red-500"
                } flex items-center justify-center  w-4 h-4 text-white`}
              >
                {`${t.transactionType.toLowerCase() === "buy" ? "B" : "S"}`}
              </div>
              <div>{timestampToDate(dateStrToTimestamp(t.timestamp))}:</div>
              <div
                className={`${
                  t.transactionType.toLowerCase() === "buy" ? "text-green-600" : "text-red-600"
                } flex px-1`}
              >
                {showValueWithComma(Math.abs(t.tranAmount))}
              </div>
            </div>
            <div className=" text-sm text-gray-400 px-2 pb-0.5">{t.comment}</div>
          </div>
        );
      })}
    </div>
  );
};
