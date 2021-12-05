import { useState } from "react";
import { showValueWithComma, timestampToDate, dateStrToTimestamp } from "../utils";
import { formatDistance } from "date-fns";

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

  const removePrevDotHighlight = () => {
    if (prevDotID) {
      const prevDot = document.getElementById(prevDotID);
      if (prevDot) {
        prevDot.setAttribute("r", prevDotRadius);
      }
    }
  };

  const handleHover = (id) => {
    removePrevDotHighlight();
    const dot = document.getElementById(id);
    setPrevDotID(id);
    if (dot) {
      setPrevDotRadius(dot.getAttribute("r"));
      dot.setAttribute("r", "10");
    }
  };

  const handleLeave = () => {
    removePrevDotHighlight();
  };

  return (
    <div className="bg-white px-2 py-1 divide-y  overflow-y-auto" style={{ height: 470 }}>
      <div className="text-xl text-center py-2">Transactions</div>

      {transactions.map((t) => {
        return (
          <div
            onMouseOver={() => handleHover(t.orderID)}
            onMouseLeave={handleLeave}
            key={t.orderID}
            className="flex flex-col px-2 py-1 hover:bg-gray-100 cursor-pointer"
          >
            <div className="flex items-center w-52 text-base">
              <div className="flex items-center">
                <div
                  className={`${
                    t.transactionType.toLowerCase() === "buy" ? "bg-green-600" : "bg-red-500"
                  } flex items-center justify-center  w-4 h-4 text-white`}
                >
                  {`${t.transactionType.toLowerCase() === "buy" ? "B" : "S"}`}
                </div>
                <div
                  className={`${
                    t.transactionType.toLowerCase() === "buy" ? "text-green-600" : "text-red-600"
                  } flex px-1 `}
                >
                  {showValueWithComma(Math.abs(t.tranAmount))}
                </div>
              </div>
              <div className="ml-0.5">{t.comment.match(/at\s+[.\d]+/gi)}</div>
            </div>
            <div className="text-gray-500">
              {formatDistance(new Date(t.timestamp), new Date(), {
                addSuffix: true,
              })}
              <span className="ml-1">({timestampToDate(dateStrToTimestamp(t.timestamp))})</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
