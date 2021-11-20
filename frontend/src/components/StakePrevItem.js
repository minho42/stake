import { useState, useEffect } from "react";
import { StakeChartModal } from "./StakeChartModal";

export const StakePrevItem = ({
  index,
  symbol,
  focusedIndexHistory,
  setFocusedIndexHistory,
  transactionHistory,
}) => {
  const [transactions, setTransactions] = useState(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  const handleChartModalClose = () => {
    setIsChartModalOpen(false);
  };

  const getTransactions = () => {
    if (!transactionHistory) return;

    const trans = [];

    transactionHistory.forEach((t) => {
      if (t.symbol === symbol) {
        if (t.transactionType === "Buy" || t.transactionType === "Sell") {
          trans.push({
            id: t.orderID,
            timestamp: t.timestamp,
            tranAmount: t.tranAmount,
            transactionType: t.transactionType,
          });
        }
      }
    });

    setTransactions(trans);
  };

  useEffect(async () => {
    getTransactions();
  }, []);

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
        className={`text-right hover:shadow-md cursor-pointer ${
          index === focusedIndexHistory ? "shadow-md" : ""
        }`}
      >
        <td
          className={`py-1 text-center cursor-pointer border-l-8  ${
            index === focusedIndexHistory ? "border-black" : "border-white"
          }`}
        >
          {index + 1}
        </td>
        <td className="text-center">{symbol}</td>
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
