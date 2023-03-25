import { useEffect, useState } from "react";
import { showValueWithComma } from "../utils";

export const DividendItem = ({
  position: { symbol, marketValue, encodedName },
  transactionHistory,
  addTotalExpectedDividends,
  addTotalDividend,
  addTotalDividendTax,
  selectedSymbolForDetail,
  setSelectedSymbolForDetail,
}) => {
  const [dividendYield, setDividendYield] = useState(0);
  const [totalDividend, setTotalDividend] = useState(0);
  const [totalDividendTax, setTotalDividendTax] = useState(0);
  const [expectedDividend, setExpectedDividend] = useState(0);

  const handleClick = () => {
    setSelectedSymbolForDetail(symbol);
  };

  const fetchDividendYield = async () => {
    try {
      const res = await fetch(
        `https://global-prd-api.hellostake.com/api/instruments/getDWInstrumentStats/${encodedName}`
      );
      const data = await res.json();
      setDividendYield(data.fundamentalDataModel.dividendYield);
    } catch (error) {
      console.log(error);
      return -1;
    }
  };

  const getTotalDividendInfo = () => {
    if (!transactionHistory) return;

    let dividendSum = 0;
    let dividendTaxSum = 0;

    transactionHistory.forEach((t) => {
      if (t.symbol === symbol) {
        if (t.transactionType === "Dividend") {
          dividendSum += t.tranAmount;
        }
        if (t.transactionType === "Dividend Tax") {
          dividendTaxSum += t.tranAmount;
        }
      }
    });
    setTotalDividend(dividendSum);
    setTotalDividendTax(-dividendTaxSum);
  };

  useEffect(() => {
    fetchDividendYield();
  }, []);

  useEffect(() => {
    getTotalDividendInfo();
    const expectedDividend = (marketValue * dividendYield) / 100;
    setExpectedDividend(expectedDividend);
    addTotalExpectedDividends(expectedDividend);
  }, [dividendYield]);

  useEffect(() => {
    addTotalDividend(totalDividend);
  }, [totalDividend]);

  useEffect(() => {
    addTotalDividendTax(totalDividendTax);
  }, [totalDividendTax]);

  if (dividendYield <= 0) return null;
  return (
    <tr
      onClick={handleClick}
      className={`cursor-pointer text-right ${selectedSymbolForDetail === symbol ? "bg-primary" : ""}`}
    >
      <td className="py-1 text-left">{symbol}</td>
      <td className="">{showValueWithComma(dividendYield)}%</td>
      <td className="">{showValueWithComma(expectedDividend)}</td>
      <td className="">{showValueWithComma(totalDividend)}</td>
      <td className="">{showValueWithComma(totalDividendTax)}</td>
    </tr>
  );
};
