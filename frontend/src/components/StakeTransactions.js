import { useState } from "react";
import { showValueWithComma, timestampToDate, dateStrToTimestamp } from "../utils";

export const StakeTransactions = ({ transactions }) => {
  if (!transactions || transactions.length < 1) {
    return (
      <div className="bg-white p-2 divide-y space-y-1 overflow-y-auto" style={{ height: 470 }}>
        <div className="text-base text-center">No transaction data</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-2 divide-y space-y-1 overflow-y-auto" style={{ height: 470 }}>
      <div className="text-xl text-center">Transactions</div>

      {transactions.map((t) => {
        return (
          <div
            key={t.orderID}
            className="flex flex-col items-center text-gray-500 py-0.5 hover:bg-gray-100 gap-1"
          >
            <div className="flex w-44 items-center gap-1">
              <div
                className={`${
                  t.transactionType.toLowerCase() === "buy" ? "bg-black" : "bg-red-500"
                } flex items-center justify-center  w-4 h-4 text-white`}
              >
                {`${t.transactionType.toLowerCase() === "buy" ? "B" : "S"}`}
              </div>
              <div>{timestampToDate(dateStrToTimestamp(t.timestamp))}:</div>
              <div
                className={`${
                  t.transactionType.toLowerCase() === "buy" ? "text-black" : "text-red-600"
                } flex px-1`}
              >
                {showValueWithComma(Math.abs(t.tranAmount))}
              </div>
            </div>
            <div className=" text-xs font-light text-gray-500 px-2 py-0.5">{t.comment}</div>
          </div>
        );
      })}
    </div>
  );
};
