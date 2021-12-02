import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { LoadingIcon } from "./LoadingIcon";
import { useLocalStorage } from "./useLocalStorage";
import { Line, ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { SiteContext } from "../SiteContext";
import { isPositive, showValueWithSign, timestampToDate, dateStrToTimestamp } from "../utils";
import { StakeTransactions } from "./StakeTransactions";

export const StakeChartModal = ({
  symbol,
  name,
  marketValue,
  unrealizedPL,
  unrealizedPLPercentage,
  transactions,
  isOpen,
  onClose,
}) => {
  const [chartData, setChartData] = useLocalStorage(`stakeChartData-${symbol}`, []);
  const [chartDataTimeFramed, setChartDataTimeFramed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeFrameName, setSelectedTimeFrameName] = useLocalStorage(`stakeChartTimeFrame`, "1y");
  const { setIsStakeChartModalOpen } = useContext(SiteContext);
  const timeFrames = [
    {
      name: "1m",
      inDays: 21,
    },
    {
      name: "3m",
      inDays: 21 * 3,
    },
    {
      name: "6m",
      inDays: 21 * 6,
    },
    {
      name: "1y",
      inDays: 5 * 52 * 1,
    },
    {
      name: "2y",
      inDays: 5 * 52 * 2,
    },
    {
      name: "5y",
      inDays: 5 * 52 * 5,
    },
    // {
    //   name: "10y",
    //   inDays: 5 * 52 * 10,
    // },
    // {
    //   name: "all",
    //   inDays: 0,
    // },
  ];

  const CustomLineDot = ({ cx, cy, stroke, payload, value }) => {
    // if (payload.transaction) {
    //   console.log(payload);
    // }

    const r = 6;
    const strokeColor = "black";
    const strokeWidth = 1;
    const strokeOpacity = 0.8;
    const green = "#065F46";
    const red = "#EF4444";
    if (payload.transactionType && payload.transactionType.toLowerCase() === "buy") {
      return (
        <circle
          id={payload.orderID}
          cx={cx}
          cy={cy}
          r={r}
          fill="#10B981"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
        />
      );
    } else if (payload.transactionType && payload.transactionType.toLowerCase() === "sell") {
      return (
        <circle
          id={payload.orderID}
          cx={cx}
          cy={cy}
          r={r}
          fill={red}
          stroke={strokeColor}
          stroke-width={strokeWidth}
          stroke-opacity={strokeOpacity}
        />
      );
    } else return <></>;
  };

  const handleTimeFrameChange = (e) => {
    setSelectedTimeFrameName(e.target.innerHTML);
  };

  const fetchChartData = async (symbol) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/chart/data/${symbol}`);
      if (res.status !== 200) {
        throw new Error("StakeChartModal error");
      }
      let {
        data: { timestamp, quote },
      } = await res.json();

      let tempChartData = [];
      if (timestamp && quote) {
        timestamp.forEach((item, i) => {
          tempChartData.push({ timestamp: item, quote: quote[i] });
        });
      }

      if (transactions) {
        transactions.forEach((t) => {
          const transactionDateFromChartData = tempChartData.find((item) => {
            return Math.abs(item.timestamp - dateStrToTimestamp(t.timestamp)) / 60 / 60 < 24;
          });

          // remove same date first before pushing transaction data to prevent duplicate dates
          const removeIndex = tempChartData.findIndex((d) => {
            const a = new Date(d.timestamp * 1000);
            const b = new Date(dateStrToTimestamp(t.timestamp) * 1000);
            return (
              a.getYear() === b.getYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
            );
          });

          // console.log(`removeIndex: ${removeIndex}`);
          if (removeIndex >= 0) {
            tempChartData.splice(removeIndex, 1);
          }

          tempChartData.push({
            orderID: t.orderID,
            timestamp: dateStrToTimestamp(t.timestamp),
            quote: transactionDateFromChartData.quote,
            transaction: transactionDateFromChartData.quote,
            transactionType: t.transactionType,
          });
        });
      }

      tempChartData.sort((a, b) => {
        if (a.timestamp > b.timestamp) return 1;
        else return -1;
      });

      tempChartData = tempChartData.map(({ orderID, timestamp, quote, transaction, transactionType }) => {
        return {
          orderID: orderID,
          timestamp: timestampToDate(timestamp),
          quote,
          transaction,
          transactionType,
        };
      });

      setChartData(tempChartData);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setChartData([]);
      setIsLoading(false);
    }
  };

  const keyboardShortcuts = (e) => {
    if (e.keyCode === 27) {
      onClose();
    }
    // TODO: refactor this to reduce duplicate
    else if (e.keyCode === 37 || e.keyCode === 74) {
      let selectedTimeFrameIndex = timeFrames.findIndex((tf) => tf.name === selectedTimeFrameName);

      let newIndex = selectedTimeFrameIndex - 1;
      if (newIndex < 0) {
        newIndex = timeFrames.length - 1;
      }
      let newTimeFrameName = timeFrames[newIndex].name;
      setSelectedTimeFrameName(newTimeFrameName);
    } else if (e.keyCode === 39 || e.keyCode === 75) {
      let selectedTimeFrameIndex = timeFrames.findIndex((tf) => tf.name === selectedTimeFrameName);

      let newIndex = selectedTimeFrameIndex + 1;
      if (newIndex > timeFrames.length - 1) {
        newIndex = 0;
      }
      let newTimeFrameName = timeFrames[newIndex].name;
      setSelectedTimeFrameName(newTimeFrameName);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyboardShortcuts);
    setIsStakeChartModalOpen(true);
    return () => {
      document.removeEventListener("keydown", keyboardShortcuts);
      setIsStakeChartModalOpen(false);
    };
  }, [selectedTimeFrameName]);

  useEffect(() => {
    fetchChartData(symbol);
    setIsStakeChartModalOpen(true);
    return () => {
      setIsStakeChartModalOpen(false);
    };
  }, []);

  useEffect(() => {
    if (!chartData || !selectedTimeFrameName) return;

    const selectedTimeFrame = timeFrames.find((tf) => tf.name === selectedTimeFrameName);
    let days = 0;
    if (selectedTimeFrame) {
      days = selectedTimeFrame.inDays;
    } else {
      days = 0;
    }

    setChartDataTimeFramed(chartData.slice(-days));
  }, [selectedTimeFrameName, chartData]);

  if (!isOpen) {
    return null;
  }

  const xAxisFormatter = (item) => {
    if (!item) return;
    if (typeof item !== "string") return;
    return item.slice(3, 10);
  };

  const yAxisFormatter = (item) => {
    if (!item) return;
    return Number(item).toFixed(2);
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0">
      <div
        id="overlay"
        className="min-h-screen min-w-screen bg-black opacity-40"
        onClick={() => onClose()}
      ></div>

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex bg-gray-200 space-x-1 p-2">
        <div className="flex flex-col space-y-1">
          <div className="bg-white p-2 relative">
            <div className="flex justify-center text-xl">
              {symbol}
              {unrealizedPL && (
                <div className={`flex ${isPositive(unrealizedPL) ? "text-green-600" : "text-red-600"}`}>
                  <div className="ml-2">{showValueWithSign(unrealizedPL)}</div>
                  <div className="ml-2">({showValueWithSign(unrealizedPLPercentage, "")}%)</div>
                </div>
              )}
            </div>
            {name && <div className="text-center text-gray-500">{name}</div>}
            <div className="absolute top-2 right-2">
              {(isLoading || !chartDataTimeFramed) && <LoadingIcon />}
            </div>
          </div>
          <div className="bg-white p-2">
            <div className="flex justify-center text-gray-600 space-x-1">
              {timeFrames.map((tf) => {
                return (
                  <button
                    onClick={handleTimeFrameChange}
                    key={tf.name}
                    className={`${
                      selectedTimeFrameName === tf.name ? " border-black" : "border-white"
                    } border-b-4  px-2 py-0.5 uppercase focus:outline-none`}
                  >
                    {tf.name}
                  </button>
                );
              })}
            </div>
            <ComposedChart
              width={700}
              height={360}
              data={chartDataTimeFramed}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="1"
                stroke="#abafb1"
                xAxis={false}
                yAxis={false}
                // color="#f9f9f9"
              />
              <XAxis
                dataKey="timestamp"
                fontSize="11px"
                color="#666666"
                tickSize="0"
                tickMargin="10"
                tickFormatter={xAxisFormatter}
              />
              <YAxis
                fontSize="12px"
                color="#666666"
                tickSize="0"
                tickCount="7"
                tickMargin="10"
                tickFormatter={yAxisFormatter}
                domain={["dataMin", "dataMax"]}
                // domain={[
                //   (dataMin) => {
                //     console.log(dataMin);
                //     return dataMin;
                //   },
                //   (dataMax) => {
                //     console.log(dataMax);
                //     return dataMax;
                //   },
                // ]}
                // domain={[0, (dataMax) => Math.ceil(dataMax / 100) * 100 + 200]}
                allowDataOverflow={true}
              />
              <Tooltip isAnimationActive={false} />
              <defs>
                <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#cccccc" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="quote"
                fill="url(#gradientArea)"
                stroke="#000000"
                strokeWidth="1.4"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="transaction"
                dot={<CustomLineDot />}
                // dot={{
                //   fill: "black",
                //   stroke: "white",
                //   strokeWidth: 2,
                //   r: 6,
                // }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </div>
        </div>

        <StakeTransactions transactions={transactions} />
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};
