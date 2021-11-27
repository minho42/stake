import { showValueWithComma, timestampToDate, dateStrToTimestamp } from "../utils";

export const StakeTransactions = ({ transactions }) => {
  if (!transactions || transactions.length < 1) {
    return (
      <div className="bg-white rounded p-2 divide-y space-y-1 overflow-y-auto" style={{ height: 470 }}>
        <div className="text-base text-center">No transaction data</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded p-2 divide-y space-y-1 overflow-y-auto" style={{ height: 470 }}>
      <div className="text-xl text-center">Transactions</div>
      {transactions.map((t) => {
        return (
          <div key={t.id} className="flex items-center text-gray-500 py-1 hover:bg-gray-100 gap-1">
            <div
              className={`${
                t.transactionType === "Buy" ? "bg-black" : "bg-red-500"
              } flex items-center justify-center rounded-full w-4 h-4 text-white`}
            >
              {`${t.transactionType === "Buy" ? "B" : "S"}`}
            </div>
            {timestampToDate(dateStrToTimestamp(t.timestamp))}:
            <div
              className={`${t.transactionType === "Buy" ? "text-black" : "text-red-600"} flex rounded px-1 `}
            >
              {showValueWithComma(Math.abs(t.tranAmount))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
