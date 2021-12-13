import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { SiteContext } from "../SiteContext";
import { getChangePercentage } from "../utils";
import { Link } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { StakeList } from "./StakeList";

export const PortfolioList = ({}) => {
  const { stakeToken, isStakeAuthLoading, userInfo } = useContext(UserContext);
  const {
    isStakeChartModalOpen,
    equityPositions,
    equityPositionsAsx,
    equityValue,
    equityValueAsx,
    isEquityPositionsLoading,
    isEquityPositionsLoadingAsx,
    errorMessage,
    fetchEquityPositions,
    fetchEquityPositionsAsx,
    transactionHistory,
    transactionHistoryAsx,
    marketStatus,
    marketStatusAsx,
    fetchMarketStatus,
    fetchMarketStatusAsx,
    cashStatus,
  } = useContext(SiteContext);
  const [equityValueInAud, setEquityValueInAud] = useState(0);
  const [currencyUsdAud, setCurrencyUsdAud] = useLocalStorage("currencyUsdAud", 0);
  const [currencyAudUsd, setCurrencyAudUsd] = useLocalStorage("currencyAudUsd", 0);
  const [focusedIndex, setFocusedIndex] = useLocalStorage("stakeFocusedIndex", 0);
  const [dayChangeSum, setDayChangeSum] = useState(0);
  const [dayChangeSumAsx, setDayChangeSumAsx] = useState(0);
  const [totalChangeSum, setTotalChangeSum] = useState(0);
  const [totalChangeSumAsx, setTotalChangeSumAsx] = useState(0);
  const [dayChangePercentage, setDayChangePercentage] = useState(0);
  const [dayChangePercentageAsx, setDayChangePercentageAsx] = useState(0);
  const [totalChangePercentage, setTotalChangePercentage] = useState(0);
  const [totalChangePercentageAsx, setTotalChangePercentageAsx] = useState(0);

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

  const getDayChangeSumAsx = () => {
    let sum = 0;
    equityPositionsAsx.forEach((position) => {
      sum += Number.parseFloat(position.unrealizedDayPL);
    });
    setDayChangeSumAsx(sum.toFixed(2));
    setDayChangePercentageAsx(getChangePercentage(equityValueAsx, sum));
  };

  const getTotalChangeSum = () => {
    let sum = 0;
    equityPositions.forEach((position) => {
      sum += Number.parseFloat(position.unrealizedPL);
    });
    setTotalChangeSum(sum.toFixed(2));
    setTotalChangePercentage(getChangePercentage(equityValue, sum));
  };

  const getTotalChangeSumAsx = () => {
    let sum = 0;
    equityPositionsAsx.forEach((position) => {
      sum += Number.parseFloat(position.unrealizedPL);
    });
    setTotalChangeSumAsx(sum.toFixed(2));
    setTotalChangePercentageAsx(getChangePercentage(equityValueAsx, sum));
  };

  useEffect(() => {
    setInterval(fetchEquityPositions, 1000 * 30);
    setInterval(fetchEquityPositionsAsx, 1000 * 30);
  }, [stakeToken]);

  useEffect(() => {
    fetchCurrencyUsdAud();
    fetchCurrencyAudUsd();
    fetchMarketStatus();
    fetchMarketStatusAsx();
    setInterval(fetchMarketStatus, 60 * 1000);
    setInterval(fetchMarketStatusAsx, 60 * 1000);
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
    getDayChangeSumAsx();
    getTotalChangeSumAsx();

    if (equityPositionsAsx && equityPositionsAsx.length) {
      if (focusedIndex + 1 >= equityPositions.length) {
        setFocusedIndex(0);
      }
    }
  }, [equityValueAsx]);

  useEffect(() => {
    setEquityValueInAud(equityValue * currencyUsdAud);
  }, [currencyUsdAud]);

  return (
    <div className="flex flex-col flex-grow px-3 pb-3 space-y-3 min-h-screen bg-gray-100">
      <div className="flex justify-center relative text-gray-500">
        <div className="absolute top-1 right-0 text-gray-500 space-y-1 divide-y divide-gray-300 text-right uppercase">
          {stakeToken && userInfo && (
            <div className="flex justify-end">{userInfo.firstName + " " + userInfo.lastName}</div>
          )}
          <div>AUD/USD: {currencyAudUsd && currencyAudUsd.toFixed(3)}</div>
          <div>USD/AUD: {currencyUsdAud && currencyUsdAud.toFixed(3)}</div>
          <div>Buying power: {cashStatus && cashStatus.cashAvailableForTrade}</div>
          <div>Pending: {cashStatus && cashStatus.pendingOrdersAmount}</div>
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
        ) : (
          ""
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-3">
        {stakeToken && equityPositions && equityPositions.length > 0 && (
          <StakeList
            marketName="wall st"
            flag="🇺🇸"
            marketStatus={marketStatus}
            equityPositions={equityPositions}
            equityValue={equityValue}
            totalChangeSum={totalChangeSum}
            equityValueInAud={equityValueInAud}
            isEquityPositionsLoading={isEquityPositionsLoading}
            dayChangeSum={dayChangeSum}
            dayChangePercentage={dayChangePercentage}
            totalChangePercentage={totalChangePercentage}
            transactionHistory={transactionHistory}
            setFocusedIndex={setFocusedIndex}
            focusedIndex={focusedIndex}
          />
        )}

        {stakeToken && equityPositionsAsx && equityPositionsAsx.length > 0 && (
          <StakeList
            marketName="asx"
            flag="🇦🇺"
            marketStatus={marketStatusAsx}
            equityPositions={equityPositionsAsx}
            equityValue={equityValueAsx}
            totalChangeSum={totalChangeSumAsx}
            equityValueInAud={equityValueAsx}
            isEquityPositionsLoading={isEquityPositionsLoadingAsx}
            dayChangeSum={dayChangeSumAsx}
            dayChangePercentage={dayChangePercentageAsx}
            totalChangePercentage={totalChangePercentageAsx}
            transactionHistory={transactionHistoryAsx}
            setFocusedIndex={setFocusedIndex}
            focusedIndex={focusedIndex}
          />
        )}
      </div>
    </div>
  );
};
