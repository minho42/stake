import { useState, useEffect } from "react";
import { StakeChartModal } from "./StakeChartModal";
import { isPositive, showValueWithSign } from "../utils";
import { formatDistance } from "date-fns";

export const StakePrevItem = ({
  index,
  symbol,
  focusedIndexHistory,
  setFocusedIndexHistory,
  transactionHistory,
}) => {
  const [transactions, setTransactions] = useState(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [changeSum, setChangeSum] = useState(0);
  const [lastSoldDate, setLastSoldDate] = useState(null);

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

    // TODO remove this duplicate code StakePrevItem & StakeItem
    transactionHistory.forEach((t) => {
      if (t.symbol === symbol) {
        if (t.transactionType.toLowerCase() === "buy" || t.transactionType.toLowerCase() === "sell") {
          trans.push({
            orderID: t.orderID,
            timestamp: t.timestamp,
            tranAmount: t.tranAmount,
            transactionType: t.transactionType,
            comment: t.comment,
          });
        }
      }
    });

    setTransactions(trans);
  };

  useEffect(async () => {
    getTransactions();
  }, []);

  const getTotalChangeSum = () => {
    if (!transactions) return;
    let sum = 0;
    transactions.forEach((t) => {
      sum += Number.parseFloat(t.tranAmount);
    });
    // setChangeSum(sum.toFixed(2));
    setChangeSum(sum);
  };

  useEffect(() => {
    getTotalChangeSum();
    getLastSoldDate();
  }, [transactions]);

  const keyboardShortcuts = (e) => {
    if (e.keyCode === 79 || e.keyCode === 13) {
      // open
      if (index === focusedIndexHistory) {
        setIsChartModalOpen(!isChartModalOpen);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyboardShortcuts);
    return () => {
      document.removeEventListener("keydown", keyboardShortcuts);
    };
  }, [focusedIndexHistory]);

  return (
    <>
      <tr
        onClick={() => {
          setFocusedIndexHistory(index);
          setIsChartModalOpen(!isChartModalOpen);
        }}
        className="text-right hover:bg-gray-100 cursor-pointer"
      >
        <td
          className={`py-1 text-center border-l-8  ${
            index === focusedIndexHistory ? "border-black" : "border-transparent"
          }`}
        >
          {index + 1}
        </td>
        <td className="text-left">{symbol}</td>
        <td className={`${isPositive(changeSum) ? "text-green-600" : "text-red-600"} text-right`}>
          {showValueWithSign(changeSum, "")}
        </td>
        <td>{lastSoldDate}</td>
      </tr>

      {isChartModalOpen && (
        <StakeChartModal
          symbol={symbol}
          transactions={transactions}
          isOpen={isChartModalOpen}
          onClose={handleChartModalClose}
        />
      )}
    </>
  );
};
