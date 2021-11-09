import { useEffect, useState } from "react";
import { showValueWithComma } from "../utils";

export const DividendItem = ({
  position: { symbol, marketValue, encodedName },
  transactionHistory,
  addTotalExpectedDividends,
  addTotalDividend,
  addTotalDividendTax,
}) => {
  const [dividendYield, setDividendYield] = useState(0);
  const [totalDividend, setTotalDividend] = useState(0);
  const [totalDividendTax, setTotalDividendTax] = useState(0);
  const [expectedDividend, setExpectedDividend] = useState(0);

  const fetchDividendYield = async () => {
    try {
      const res = await fetch(
        `https://global-prd-api.hellostake.com/api/instruments/getDWInstrumentStats/${encodedName}`
      );
      const data = await res.json();
      return data.fundamentalDataModel.dividendYield;
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

  useEffect(async () => {
    const dividendYield = await fetchDividendYield();
    setDividendYield(dividendYield);
    getTotalDividendInfo();
  }, []);

  useEffect(() => {
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
    <tr className="text-sm hover:bg-gray-100 cursor-pointer text-center">
      <td className="py-1 text-center">{symbol}</td>
      <td className="">{showValueWithComma(dividendYield)}%</td>
      <td className="text-right">{showValueWithComma(expectedDividend)}</td>
      <td className="text-right">{showValueWithComma(totalDividend)}</td>
      <td className="text-right">{showValueWithComma(totalDividendTax)}</td>
    </tr>
  );
};
