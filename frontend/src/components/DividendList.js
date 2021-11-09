import { useState, useEffect, useContext } from "react";
import { DividendItem } from "./DividendItem";
import { UserContext } from "../UserContext";
import { SiteContext } from "../SiteContext";
import { showValueWithComma } from "../utils";
import { useLocalStorage } from "./useLocalStorage";

export const DividendList = () => {
  const { stakeToken, isStakeAuthLoading } = useContext(UserContext);
  const { equityPositions } = useContext(SiteContext);
  const [totalExpectedDividends, setTotalExpectedDividends] = useState(0);
  const [totalDividend, setTotalDividend] = useState(0);
  const [totalDividendTax, setTotalDividendTax] = useState(0);
  const [transactionHistory, setTransactionHistory] = useLocalStorage("stakeTransactionHistory", []);

  const addTotalExpectedDividends = (n) => {
    setTotalExpectedDividends(totalExpectedDividends + n);
  };

  const addTotalDividend = (n) => {
    setTotalDividend(totalDividend + n);
  };
  const addTotalDividendTax = (n) => {
    setTotalDividendTax(totalDividendTax + n);
  };

  const fetchTransactionHistory = async () => {
    try {
      const res = await fetch("http://localhost:4000/stake/transaction-history", {
        credentials: "include",
      });
      if (res.status !== 200) {
        throw new Error("fetchTransactionHistory error");
      }
      const { data } = await res.json();
      if (data) {
        setTransactionHistory(data);
      } else {
        setTransactionHistory([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex justify-center px-3 py-6 min-w-full space-y-3">
        {stakeToken && equityPositions && (
          <table className="w-11/12 text-sm font-medium text-center max-w-md">
            <thead>
              <tr className="border-b-2 border-gray-700">
                <th>Code</th>
                <th>Dividend yield</th>
                <th className="text-right">Ex-dividend</th>
                <th className="text-right">Dividend</th>
                <th className="text-right">Dividend tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {equityPositions.map((position) => {
                return (
                  <DividendItem
                    key={position.symbol}
                    position={position}
                    transactionHistory={transactionHistory}
                    addTotalExpectedDividends={addTotalExpectedDividends}
                    addTotalDividend={addTotalDividend}
                    addTotalDividendTax={addTotalDividendTax}
                  />
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-700">
                <td className="uppercase py-1">Totals</td>
                <td>-</td>
                <td className="text-right">{showValueWithComma(totalExpectedDividends)}</td>
                <td className="text-right">{showValueWithComma(totalDividend)}</td>
                <td className="text-right">{showValueWithComma(totalDividendTax)}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};
