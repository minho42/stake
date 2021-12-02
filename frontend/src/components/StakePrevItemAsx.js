import { useState, useEffect } from "react";
import { StakeChartModal } from "./StakeChartModal";
import { isPositive, showValueWithSign } from "../utils";
import { formatDistance } from "date-fns";

export const StakePrevItemAsx = ({ index, symbol, transactionHistory }) => {
  const [transactions, setTransactions] = useState(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [changeSum, setChangeSum] = useState(0);
  const [lastSoldDate, setLastSoldDate] = useState(null);
  const [symbolAsx, setSymbolAsx] = useState(null);

  const getLastSoldDate = () => {
    if (!transactions) return;

    const d = formatDistance(new Date(transactions[0].timestamp), new Date(), {
      includeSeconds: false,
      addSuffix: true,
    });
    setLastSoldDate(d);
  };

  const handleChartModalClose = () => {
    setIsChartModalOpen(false);
  };

  const getTransactions = () => {
    if (!transactionHistory) return;

    const trans = [];

    // wall st vs asx
    // orderID -> brokerOrderId
    // timestamp -> completedTimestamp
    // transAmount -> consideration
    // transactionType -> side

    // TODO remove this duplicate code StakePrevItemAsx & StakeItem
    transactionHistory.forEach((t) => {
      if (t.instrumentCode === symbol) {
        if (t.side.toLowerCase() === "buy" || t.side.toLowerCase() === "sell") {
          trans.push({
            orderID: t.brokerOrderId,
            timestamp: t.completedTimestamp,
            tranAmount: t.consideration,
            transactionType: t.side,
            comment: t.type,
          });
        }
      }
    });
    setTransactions(trans);
  };

  useEffect(async () => {
    getTransactions();
    setSymbolAsx(symbol.replace(".XAU", ".AX"));
  }, []);

  const getTotalChangeSum = () => {
    if (!transactions) return;
    let sum = 0;
    transactions.forEach((t) => {
      if (t.transactionType.toLowerCase() === "buy") {
        sum -= Number.parseFloat(t.tranAmount);
      } else {
        sum += Number.parseFloat(t.tranAmount);
      }
    });
    // setChangeSum(sum.toFixed(2));
    setChangeSum(sum);
  };

  useEffect(() => {
    getTotalChangeSum();
    getLastSoldDate();
  }, [transactions]);

  if (!transactionHistory) {
    return <div>empty</div>;
  }

  return (
    <>
      <tr
        onClick={() => {
          setIsChartModalOpen(!isChartModalOpen);
        }}
        className="text-right hover:bg-gray-100 cursor-pointer"
      >
        <td className="py-1 text-center cursor-pointer border-l-8">{index + 1}</td>
        <td className="text-left">{symbolAsx}</td>
        <td className={`${isPositive(changeSum) ? "text-green-600" : "text-red-600"} text-right`}>
          {showValueWithSign(changeSum, "")}
        </td>
        <td>{lastSoldDate}</td>
      </tr>

      {isChartModalOpen && (
        <StakeChartModal
          symbol={symbolAsx}
          transactions={transactions}
          isOpen={isChartModalOpen}
          onClose={handleChartModalClose}
        />
      )}
    </>
  );
};
