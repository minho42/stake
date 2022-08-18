import { timestampToDate, dateStrToTimestamp } from "../utils";

export const DividendDetailList = ({ symbol, transactionHistory }) => {
  return (
    <div className="flex flex-col items-center w-full space-y-2">
      <div className="w-11/12 text-center max-w-md text-base font-semibold bg-gray-200">{symbol}</div>

      <table className="w-11/12 text-center max-w-md">
        <thead>
          <tr className="border-b-2 border-gray-700">
            <th>Date</th>
            <th>Type</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {transactionHistory
            // sort by date transactionType
            .filter((t) => t.symbol === symbol)
            .map((t) => {
              if (t.transactionType === "Dividend" || t.transactionType === "Dividend Tax") {
                return (
                  <tr key={t.timestamp}>
                    <td>{timestampToDate(dateStrToTimestamp(t.timestamp))}</td>
                    <td>{t.transactionType}</td>
                    <td
                      className={`text-right ${
                        t.transactionType === "Dividend" ? "text-green-600 font-semibold" : ""
                      }`}
                    >
                      {t.tranAmount}
                    </td>
                  </tr>
                );
              }
            })}
        </tbody>
      </table>
    </div>
  );
};
