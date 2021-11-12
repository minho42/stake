import { useEffect, useState } from "react";
import { isPositive, showValueWithSign, showValueWithComma, getChangePercentage } from "../utils";
import { StakeChartModal } from "./StakeChartModal";

export const StakeItem = ({
  index,
  focusedIndex,
  setFocusedIndex,
  position: { symbol, openQty, marketValue, unrealizedDayPL, unrealizedPL, encodedName, name },
  equityValue,
  transactionHistory,
}) => {
  const [transactions, setTransactions] = useState(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [unrealizedDayPLPercentage, setUnrealizedDayPLPercentage] = useState(0);
  const [unrealizedPLPercentage, setUnrealizedPLPercentage] = useState(0);

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

  const setPercentages = () => {
    setUnrealizedDayPLPercentage(getChangePercentage(marketValue, unrealizedDayPL));
    setUnrealizedPLPercentage(getChangePercentage(marketValue, unrealizedPL));
  };

  useEffect(async () => {
    getTransactions();
    setPercentages();
  }, []);

  const keyboardShortcuts = (e) => {
    if (e.keyCode === 79 || e.keyCode === 13) {
      // open
      if (index === focusedIndex) {
        setIsChartModalOpen(!isChartModalOpen);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyboardShortcuts);
    return () => {
      document.removeEventListener("keydown", keyboardShortcuts);
    };
  }, [focusedIndex]);

  return (
    <>
      <tr
        onClick={() => {
          setFocusedIndex(index);
          setIsChartModalOpen(!isChartModalOpen);
        }}
        className={`text-right hover:shadow-md cursor-pointer ${index === focusedIndex ? "shadow-md" : ""}`}
      >
        <td
          className={`py-1 text-center cursor-pointer border-l-8  ${
            index === focusedIndex ? "border-black" : "border-white"
          }`}
        >
          {index + 1}
        </td>
        <td className="text-center">{symbol}</td>
        <td>${showValueWithComma(marketValue, false)}</td>
        <td className={` ${isPositive(unrealizedDayPL) ? "text-green-600" : "text-red-600"}`}>
          {showValueWithSign(unrealizedDayPL, "")}
          <span className="ml-1">({showValueWithSign(unrealizedDayPLPercentage, "")}%)</span>
        </td>
        <td className={` ${isPositive(unrealizedPL) ? "text-green-600" : "text-red-600"}`}>
          {showValueWithSign(unrealizedPL, "")}
          <span className="ml-1">({showValueWithSign(unrealizedPLPercentage, "")}%)</span>
        </td>
        <td className="">{Number.parseFloat(((marketValue / equityValue) * 100).toFixed(2))}%</td>
      </tr>

      {isChartModalOpen && (
        <StakeChartModal
          symbol={symbol}
          name={name}
          marketValue={marketValue}
          unrealizedPL={unrealizedPL}
          unrealizedPLPercentage={unrealizedPLPercentage}
          transactions={transactions}
          isOpen={isChartModalOpen}
          onClose={handleChartModalClose}
        />
      )}
    </>
  );
};
