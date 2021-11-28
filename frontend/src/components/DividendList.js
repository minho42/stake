import { useState, useEffect, useContext } from "react";
import { DividendItem } from "./DividendItem";
import { DividendDetailList } from "./DividendDetailList";
import { UserContext } from "../UserContext";
import { SiteContext } from "../SiteContext";
import { showValueWithComma } from "../utils";

export const DividendList = () => {
  const { stakeToken, isStakeAuthLoading } = useContext(UserContext);
  const { equityPositions, transactionHistory } = useContext(SiteContext);
  const [totalExpectedDividends, setTotalExpectedDividends] = useState(0);
  const [totalDividend, setTotalDividend] = useState(0);
  const [totalDividendTax, setTotalDividendTax] = useState(0);
  const [selectedSymbolForDetail, setSelectedSymbolForDetail] = useState(null);

  const addTotalExpectedDividends = (n) => {
    setTotalExpectedDividends(totalExpectedDividends + n);
  };

  const addTotalDividend = (n) => {
    setTotalDividend(totalDividend + n);
  };
  const addTotalDividendTax = (n) => {
    setTotalDividendTax(totalDividendTax + n);
  };

  return (
    <div className="flex items-center md:items-start justify-center md:justify-between divide-y md:divide-x flex-col md:flex-row ">
      <div className="flex justify-center px-3 py-3 w-full md:w-1/2">
        {stakeToken && equityPositions && (
          <table className="w-11/12 text-center max-w-md">
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
                    selectedSymbolForDetail={selectedSymbolForDetail}
                    setSelectedSymbolForDetail={setSelectedSymbolForDetail}
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
      {selectedSymbolForDetail && (
        <div className="flex justify-center px-3 py-3 w-full md:w-1/2 min-h-screen">
          <DividendDetailList symbol={selectedSymbolForDetail} transactionHistory={transactionHistory} />
        </div>
      )}
    </div>
  );
};
