import { useEffect, useState } from "react";
import { isPositive, showValueWithSign, showValueWithComma, getChangePercentage } from "../utils";
import { StakeChartModal } from "./StakeChartModal";
import { TrendingUpIcon } from "@heroicons/react/outline";

export const StakeItem = ({
  index,
  marketName,
  focusedIndex,
  setFocusedIndex,
  position: { symbol, openQty, mktPrice, marketValue, unrealizedDayPL, unrealizedPL, encodedName, name },
  equityValue,
  transactionHistory,
}) => {
  const [transactions, setTransactions] = useState(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [unrealizedDayPLPercentage, setUnrealizedDayPLPercentage] = useState(0);
  const [unrealizedPLPercentage, setUnrealizedPLPercentage] = useState(0);
  const [targetPrice, setTargetPrice] = useState(0);

  const fetchTargetPrice = async () => {
    try {
      const res = await fetch(`http://localhost:4000/nasdaq/consensus/${symbol}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error("fetchNasdaqConsensusRatings failed");
      }
      setTargetPrice(data.data.priceTarget);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllocationPercentage = () => {
    if (!equityValue) {
      return 100;
    }
    return Number.parseFloat(((marketValue / equityValue) * 100).toFixed(2));
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

  const setPercentages = () => {
    setUnrealizedDayPLPercentage(getChangePercentage(marketValue, unrealizedDayPL));
    setUnrealizedPLPercentage(getChangePercentage(marketValue, unrealizedPL));
  };

  useEffect(async () => {
    getTransactions();
    setPercentages();
    fetchTargetPrice();
  }, []);

  const keyboardShortcuts = (e) => {
    if (e.keyCode === 79 || e.keyCode === 13) {
      // open
      if (index === focusedIndex) {
        setIsChartModalOpen(!isChartModalOpen);
      }
    }
  };

  const targetPriceGraph = () => {
    if (!targetPrice) return;
    if (targetPrice > Number(mktPrice) + Number(mktPrice) * 0.2) {
      return <TrendingUpIcon className="h-5 w-5 text-green-600" />;
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
        className="text-right hover:bg-gray-100 cursor-pointer"
      >
        <td
          className={`py-1 text-center cursor-pointer border-l-8 px-1 ${
            index === focusedIndex ? "border-black" : "border-transparent"
          }`}
        >
          {index + 1}.
        </td>
        <td className="text-left">{symbol}</td>
        <td className="flex items-center justify-end gap-1">
          {targetPriceGraph()}
          {targetPrice ? targetPrice : "-"}
        </td>
        <td>{mktPrice}</td>
        <td>{showValueWithComma(marketValue, false)}</td>
        <td className={` ${isPositive(unrealizedDayPL) ? "text-green-600" : "text-red-600"}`}>
          {showValueWithSign(unrealizedDayPL, "")}
          <span className="ml-1">({showValueWithSign(unrealizedDayPLPercentage, "")}%)</span>
        </td>
        <td className={` ${isPositive(unrealizedPL) ? "text-green-600" : "text-red-600"}`}>
          {showValueWithSign(unrealizedPL, "")}
          <span className="ml-1">({showValueWithSign(unrealizedPLPercentage, "")}%)</span>
        </td>
        <td>{getAllocationPercentage()}%</td>
        <td onClick={(e) => e.stopPropagation()}>
          <a
            className="hover:text-blue-600 underline"
            href="https://finance.yahoo.com/quote/DOCN"
            target="_blank"
            rel="noopener noreferrer"
          >
            {symbol}
          </a>
        </td>
      </tr>

      {isChartModalOpen && (
        <StakeChartModal
          symbol={marketName === "asx" ? `${symbol}.AX` : symbol}
          name={name}
          mktPrice={mktPrice}
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
