import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { SiteStatusContext } from "../SiteStatusContext";
import { useUpdatePortfolioInfo } from "./useUpdatePortfolioInfo";
import { StakeItem } from "./StakeItem";
import { isPositive, showValueWithSign, showValueWithComma, getChangePercentage } from "../utils";
import { Link } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { LoadingIcon } from "./LoadingIcon";
import { StakePieChart } from "./StakePieChart";

export const StakeList = () => {
  const { stakeToken, isStakeAuthLoading } = useContext(UserContext);
  const { isStateChartModalOpen } = useContext(SiteStatusContext);
  const [equityPositions, setEquityPositions] = useLocalStorage("stakeEquityPositions", []);
  const [equityValue, setEquityValue] = useLocalStorage("stakeEquityValue", 0);
  const [transactionHistory, setTransactionHistory] = useLocalStorage("stakeTransactionHistory", []);
  const [equityValueInAud, setEquityValueInAud] = useState(0);
  useUpdatePortfolioInfo("Stake", equityValueInAud);
  const [currencyUsdAud, setCurrencyUsdAud] = useLocalStorage("currencyUsdAud", 0);
  const [currencyAudUsd, setCurrencyAudUsd] = useLocalStorage("currencyAudUsd", 0);
  const [userInfo, setUserInfo] = useLocalStorage("stakeUserInfo", {});
  // const [focusedIndex, setFocusedIndex] = useState(0);
  const [focusedIndex, setFocusedIndex] = useLocalStorage("stakeFocusedIndex", 0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [dayChangeSum, setDayChangeSum] = useState(0);
  const [totalChangeSum, setTotalChangeSum] = useState(0);
  const [dayChangePercentage, setDayChangePercentage] = useState(0);
  const [totalChangePercentage, setTotalChangePercentage] = useState(0);
  const [totalExpectedDividends, setTotalExpectedDividends] = useState(0);
  const [totalDividend, setTotalDividend] = useState(0);
  const [totalDividendTax, setTotalDividendTax] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [marketStatus, setMarketStatus] = useState(null);
  const [showItems, setShowItems] = useLocalStorage("stakeShowItems", true);

  const keyboardShortcuts = (e) => {
    if (isStateChartModalOpen) return;

    if (e.keyCode === 40 || e.keyCode === 74) {
      // move down
      let newIndex = focusedIndex + 1;
      if (newIndex > equityPositions.length - 1) {
        newIndex = 0;
      }
      setFocusedIndex(newIndex);
    } else if (e.keyCode === 38 || e.keyCode === 75) {
      // move up
      let newIndex = focusedIndex - 1;
      if (newIndex < 0) {
        newIndex = equityPositions.length - 1;
      }
      setFocusedIndex(newIndex);
    }
  };

  const fetchMarketStatus = async () => {
    try {
      const res = await fetch("https://global-prd-api.hellostake.com/api/utils/marketStatus");
      const data = await res.json();
      if (!res.ok) {
        throw new Error("fetchMarketStatus failed");
      }
      // console.log(data.response.status.current);
      setMarketStatus(data.response.status.current);
    } catch (error) {
      console.log(error);
      setMarketStatus(null);
    }
  };

  const addTotalExpectedDividends = (n) => {
    setTotalExpectedDividends(totalExpectedDividends + n);
  };

  const addTotalDividend = (n) => {
    setTotalDividend(totalDividend + n);
  };
  const addTotalDividendTax = (n) => {
    setTotalDividendTax(totalDividendTax + n);
  };

  const fetchUserInfo = async () => {
    if (!stakeToken) return;

    try {
      const res = await fetch(`https://global-prd-api.hellostake.com/api/sessions/v2/${stakeToken}`);
      if (!res.ok) {
        throw new Error("fetchUserInfo failed");
      }
      const data = await res.json();
      setUserInfo(data);
    } catch (error) {
      console.log(error);
      setUserInfo(null);
    }
  };

  const fetchCurrencyUsdAud = async () => {
    try {
      const res = await fetch("http://localhost:4000/currency/UsdAud");
      const { rate } = await res.json();
      setCurrencyUsdAud(rate);
    } catch (error) {
      console.log(error);
      setCurrencyUsdAud(0);
    }
  };

  const fetchCurrencyAudUsd = async () => {
    try {
      const res = await fetch("http://localhost:4000/currency/AudUsd");
      const { rate } = await res.json();
      setCurrencyAudUsd(rate);
    } catch (error) {
      console.log(error);
      setCurrencyAudUsd(0);
    }
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

  const fetchEquityPositions = async () => {
    setIsLoading(true);
    if (!stakeToken) {
      setEquityPositions([]);
      setEquityValue(null);
      setDayChangeSum(0);
      setTotalChangeSum(0);
      setTotalChangePercentage(0);
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/stake/equity-positions", {
        credentials: "include",
      });
      if (res.status !== 200) {
        throw new Error("fetchEquityPositions error");
      }
      const {
        data: { equityPositions, equityValue },
      } = await res.json();

      const equityPositionsSortedByValue = [...equityPositions].sort((a, b) => {
        if (Number.parseFloat(a.marketValue) >= Number.parseFloat(b.marketValue)) return -1;
        return 1;
      });
      // console.log(equityPositionsSortedByValue);
      setEquityPositions(equityPositionsSortedByValue);
      setEquityValue(equityValue);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  };

  const getDayChangeSum = () => {
    let sum = 0;
    equityPositions.forEach((position) => {
      sum += Number.parseFloat(position.unrealizedDayPL);
    });
    setDayChangeSum(sum.toFixed(2));
    setDayChangePercentage(getChangePercentage(equityValue, sum));
  };

  const getTotalChangeSum = () => {
    let sum = 0;
    equityPositions.forEach((position) => {
      sum += Number.parseFloat(position.unrealizedPL);
    });
    setTotalChangeSum(sum.toFixed(2));
    setTotalChangePercentage(getChangePercentage(equityValue, sum));
  };

  useEffect(() => {
    fetchEquityPositions();
    fetchUserInfo();

    // TODO: fetchEquityPositions only when market is open
    // TODO: how not to make list blink? (becomes empty then fills in the list)
    // setInterval(fetchEquityPositions, 60 * 1000);
  }, [stakeToken]);

  useEffect(() => {
    fetchCurrencyUsdAud();
    fetchCurrencyAudUsd();
    fetchMarketStatus();
    // setInterval(fetchMarketStatus, 60 * 1000);
    fetchTransactionHistory();
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keyboardShortcuts);
    return () => {
      document.removeEventListener("keydown", keyboardShortcuts);
    };
  }, [focusedIndex, isStateChartModalOpen]);

  useEffect(() => {
    getDayChangeSum();
    getTotalChangeSum();
    setEquityValueInAud(equityValue * currencyUsdAud);

    if (equityPositions && equityPositions.length) {
      if (focusedIndex + 1 >= equityPositions.length) {
        setFocusedIndex(0);
      }
    }
  }, [equityValue]);

  useEffect(() => {
    setEquityValueInAud(equityValue * currencyUsdAud);
  }, [currencyUsdAud]);

  return (
    <div className=" flex flex-col flex-grow px-3 py-3 space-y-3 bg-white rounded-xl border border-gray-300">
      <div className="flex justify-center relative text-gray-500">
        Stake
        <StakePieChart equityPositions={equityPositions} equityValue={equityValue} />
        <div className="absolute top-0 right-0 text-xs text-gray-500 space-y-0.5">
          {stakeToken && userInfo && (
            <div className="flex justify-end">{userInfo.firstName + " " + userInfo.lastName}</div>
          )}
          <div>AUD/USD: {currencyAudUsd.toFixed(3)}</div>

          {stakeToken && (
            <div className="flex justify-end">
              <div
                className={`flex items-center justify-center rounded-lg text-white px-2 ${
                  marketStatus === "open" ? "bg-green-500" : "bg-red-400"
                }`}
              >
                {marketStatus}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center space-y-2">
        {isStakeAuthLoading ? (
          <div>Checking token...</div>
        ) : !stakeToken ? (
          <div>
            <Link to="/login" className="text-green-500 hover:underline">
              Log in
            </Link>
          </div>
        ) : equityValue ? (
          <div className="flex items-center text-3xl font-light">
            <div>${showValueWithComma(equityValueInAud, true)}</div>
            <div className={`ml-2 ${isPositive(totalChangeSum) ? "text-green-600" : "text-red-600"}`}>
              ({`${showValueWithSign(totalChangePercentage, "")}%`})
            </div>
            {isLoading ? <LoadingIcon /> : ""}
          </div>
        ) : (
          <div>{errorMessage}</div>
        )}
      </div>

      <div className="flex justify-center">
        <button onClick={() => setShowItems(!showItems)} className="text-xs text-gray-400 underline">
          {showItems ? "Show less" : "Show more"}
        </button>
      </div>

      {showItems && (
        <div className="flex justify-center">
          {stakeToken && equityPositions && (
            <table className="w-11/12">
              <thead>
                <tr className="border-b-2 border-gray-700 text-right">
                  <th className="text-sm font-medium text-center">Code</th>
                  {/* <th className="text-sm font-medium">Units</th> */}
                  <th className="text-sm font-medium">Value</th>
                  <th className="text-sm font-medium">Day P/L</th>
                  <th className="text-sm font-medium">Total P/L</th>
                  <th className="text-sm font-medium">Dividend yield</th>
                  <th className="text-sm font-medium">Ex-dividend</th>
                  <th className="text-sm font-medium">Dividend</th>
                  <th className="text-sm font-medium">Dividend tax</th>
                  {/* <th className="text-sm font-medium">Ratings</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {equityPositions.map((position, index) => {
                  return (
                    <StakeItem
                      index={index}
                      focusedIndex={focusedIndex}
                      setFocusedIndex={setFocusedIndex}
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
                <tr className="border-t-2 border-gray-700 text-sm text-right">
                  <td className="text-center uppercase py-1">Totals</td>
                  {/* <td></td> */}
                  <td>US${showValueWithComma(equityValue)}</td>
                  <td className={`${isPositive(dayChangeSum) ? "text-green-600" : "text-red-600"}`}>
                    {showValueWithSign(dayChangeSum)}
                    <span className="ml-1">({`${showValueWithSign(dayChangePercentage, "")}%`})</span>
                  </td>
                  <td className={`${isPositive(totalChangeSum) ? "text-green-600" : "text-red-600"}`}>
                    {showValueWithSign(totalChangeSum)}
                    <span className="ml-1">({`${showValueWithSign(totalChangePercentage, "")}%`})</span>
                  </td>
                  <td></td>
                  <td>{showValueWithComma(totalExpectedDividends)}</td>
                  <td>{showValueWithComma(totalDividend)}</td>
                  <td>{showValueWithComma(totalDividendTax)}</td>
                  {/* <td></td> */}
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
