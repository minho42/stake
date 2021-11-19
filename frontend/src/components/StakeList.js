import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { SiteContext } from "../SiteContext";
import { StakeItem } from "./StakeItem";
import { isPositive, showValueWithSign, showValueWithComma, getChangePercentage } from "../utils";
import { Link } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { LoadingIcon } from "./LoadingIcon";
import { StakePieChart } from "./StakePieChart";

export const StakeList = () => {
  const { stakeToken, isStakeAuthLoading, userInfo } = useContext(UserContext);
  const {
    isStakeChartModalOpen,
    equityPositions,
    setEquityPositions,
    equityValue,
    setEquityValue,
    isEquityPositionsLoading,
    setIsEquityPositionsLoading,
    errorMessage,
    fetchEquityPositions,
    transactionHistory,
  } = useContext(SiteContext);
  const [equityValueInAud, setEquityValueInAud] = useState(0);
  const [currencyUsdAud, setCurrencyUsdAud] = useLocalStorage("currencyUsdAud", 0);
  const [currencyAudUsd, setCurrencyAudUsd] = useLocalStorage("currencyAudUsd", 0);
  const [focusedIndex, setFocusedIndex] = useLocalStorage("stakeFocusedIndex", 0);
  const [dayChangeSum, setDayChangeSum] = useState(0);
  const [totalChangeSum, setTotalChangeSum] = useState(0);
  const [dayChangePercentage, setDayChangePercentage] = useState(0);
  const [totalChangePercentage, setTotalChangePercentage] = useState(0);
  const [marketStatus, setMarketStatus] = useState(null);
  const [showItems, setShowItems] = useLocalStorage("stakeShowItems", true);

  const keyboardShortcuts = (e) => {
    if (isStakeChartModalOpen) return;

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
    // TODO: how not to make list blink? (becomes empty then fills in the list)
    // TODO: how not to close chartModal?
    setInterval(fetchEquityPositions, 30 * 1000);
  }, [stakeToken]);

  useEffect(() => {
    fetchCurrencyUsdAud();
    fetchCurrencyAudUsd();
    fetchMarketStatus();
    setInterval(fetchMarketStatus, 60 * 1000);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keyboardShortcuts);
    return () => {
      document.removeEventListener("keydown", keyboardShortcuts);
    };
  }, [focusedIndex, equityPositions, isStakeChartModalOpen]);

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
    <div className=" flex flex-col flex-grow px-3 pb-3 space-y-3">
      <div className="flex justify-center relative text-gray-500">
        {/* <StakePieChart equityPositions={equityPositions} equityValue={equityValue} /> */}
        <div className="absolute top-0 right-0 text-gray-500 space-y-0.5">
          {stakeToken && userInfo && (
            <div className="flex justify-end">{userInfo.firstName + " " + userInfo.lastName}</div>
          )}
          <div>AUD/USD: {currencyAudUsd && currencyAudUsd.toFixed(3)}</div>

          {stakeToken && (
            <div className="flex justify-end">
              <div
                className={`flex items-center justify-center rounded text-white px-2 ${
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
            <Link to="/login" className="hover:underline">
              Log in
            </Link>
          </div>
        ) : equityValue ? (
          <div className="flex items-center text-2xl">
            <div>${showValueWithComma(equityValueInAud, true)}</div>
            <div className={`ml-2 ${isPositive(totalChangeSum) ? "text-green-600" : "text-red-600"}`}>
              ({`${showValueWithSign(totalChangePercentage, "")}%`})
            </div>
            {isEquityPositionsLoading ? <LoadingIcon /> : ""}
          </div>
        ) : (
          <div>{errorMessage}</div>
        )}
      </div>

      <div className="flex justify-center">
        <button onClick={() => setShowItems(!showItems)} className="text-gray-400 underline">
          {showItems ? "Show less" : "Show more"}
        </button>
      </div>

      {showItems && (
        <div className="flex justify-center">
          {stakeToken && equityPositions && (
            <table className="w-11/12 font-medium text-center max-w-2xl">
              <thead>
                <tr className="border-b-2 border-gray-700 text-right">
                  <th className="text-center">No</th>
                  <th className="text-center">Code</th>
                  <th className="">Value</th>
                  <th className="">Day P/L</th>
                  <th className="">Total P/L</th>
                  <th className="">Allocation</th>
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
                      equityValue={equityValue}
                      transactionHistory={transactionHistory}
                    />
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-700 text-right">
                  <td className="text-center py-1">Totals</td>
                  <td></td>
                  <td>US${showValueWithComma(equityValue)}</td>
                  <td className={`${isPositive(dayChangeSum) ? "text-green-600" : "text-red-600"}`}>
                    {showValueWithSign(dayChangeSum, "")}
                    <span className="ml-1">({`${showValueWithSign(dayChangePercentage, "")}%`})</span>
                  </td>
                  <td className={`${isPositive(totalChangeSum) ? "text-green-600" : "text-red-600"}`}>
                    {showValueWithSign(totalChangeSum, "")}
                    <span className="ml-1">({`${showValueWithSign(totalChangePercentage, "")}%`})</span>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
