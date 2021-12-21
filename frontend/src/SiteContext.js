import { createContext, useState, useEffect, useContext } from "react";
import { useLocalStorage } from "./components/useLocalStorage";
import { UserContext } from "./UserContext";

export const SiteContext = createContext(null);

export const SiteProvider = ({ children }) => {
  const { stakeToken, isStakeAuthLoading } = useContext(UserContext);
  const [isStakeChartModalOpen, setIsStakeChartModalOpen] = useState(false);
  const [equityPositions, setEquityPositions] = useLocalStorage("stakeEquityPositions", []);
  const [equityPositionsAsx, setEquityPositionsAsx] = useLocalStorage("stakeEquityPositionsAsx", []);
  const [prevSymbols, setPrevSymbols] = useLocalStorage("stakePrevSymbols", []);
  const [prevSymbolsAsx, setPrevSymbolsAsx] = useLocalStorage("stakePrevSymbolsAsx", []);
  const [equityValue, setEquityValue] = useLocalStorage("stakeEquityValue", 0);
  const [equityValueAsx, setEquityValueAsx] = useLocalStorage("stakeEquityValueAsx", 0);
  const [isEquityPositionsLoading, setIsEquityPositionsLoading] = useState(true);
  const [isEquityPositionsLoadingAsx, setIsEquityPositionsLoadingAsx] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [transactionHistory, setTransactionHistory] = useLocalStorage("stakeTransactionHistory", []);
  const [transactionHistoryAsx, setTransactionHistoryAsx] = useLocalStorage("stakeTransactionHistoryAsx", []);
  const [marketStatus, setMarketStatus] = useState(null);
  const [marketStatusAsx, setMarketStatusAsx] = useState(null);
  const [cashStatus, setCashStatus] = useState(null);

  const fetchCashStatus = async () => {
    try {
      const res = await fetch("http://localhost:4000/stake/cash", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error("fetchCashStatus failed");
      }
      setCashStatus(data.data);
    } catch (error) {
      console.log(error);
      setCashStatus(null);
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

  const fetchMarketStatusAsx = async () => {
    try {
      const res = await fetch("https://early-bird-promo.hellostake.com/marketStatus");
      const data = await res.json();
      if (!res.ok) {
        throw new Error("fetchMarketStatusAsx failed");
      }
      setMarketStatusAsx(data.status.current);
    } catch (error) {
      console.log(error);
      setMarketStatusAsx(null);
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

  const fetchTransactionHistoryAsx = async () => {
    try {
      const res = await fetch("http://localhost:4000/stake/asx/transaction-history", {
        credentials: "include",
      });
      if (res.status !== 200) {
        throw new Error("fetchTransactionHistoryAsx error");
      }
      const {
        data: { items },
      } = await res.json();
      if (items) {
        setTransactionHistoryAsx(items);
      } else {
        setTransactionHistoryAsx([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEquityPositions = async () => {
    if (isStakeChartModalOpen) return;

    // bug: when market closed and equityPositions are not updated, it doesn't fetch to get the latest
    // if (equityPositions.length > 0 && marketStatus !== "open") {
    //   setIsEquityPositionsLoading(false);
    //   return;
    // }

    setIsEquityPositionsLoading(true);
    if (!stakeToken) {
      setEquityPositions([]);
      setEquityValue(null);
      setIsEquityPositionsLoading(false);
      setPrevSymbols([]);
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
      setEquityPositions(equityPositionsSortedByValue);
      setEquityValue(equityValue);
      setIsEquityPositionsLoading(false);
    } catch (error) {
      setIsEquityPositionsLoading(false);
      setErrorMessage(error.message);
    }
  };

  const fetchEquityPositionsAsx = async () => {
    if (isStakeChartModalOpen) return;

    // bug: when market closed and equityPositions are not updated, it doesn't fetch to get the latest
    // if (equityPositionsAsx.length > 0 && marketStatusAsx !== "open") {
    //   setIsEquityPositionsLoadingAsx(false);
    //   return;
    // }

    setIsEquityPositionsLoadingAsx(true);
    if (!stakeToken) {
      setEquityPositionsAsx([]);
      setEquityValueAsx(null);
      setIsEquityPositionsLoadingAsx(false);
      setPrevSymbolsAsx([]);
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/stake/asx/equity-positions", {
        credentials: "include",
      });
      if (res.status !== 200) {
        throw new Error("fetchEquityPositionsAsx error");
      }
      const {
        data: { equityPositions, equityValue },
      } = await res.json();

      const equityPositionsSortedByValue = [...equityPositions].sort((a, b) => {
        if (Number.parseFloat(a.marketValue) >= Number.parseFloat(b.marketValue)) return -1;
        return 1;
      });
      setEquityPositionsAsx(equityPositionsSortedByValue);
      if (equityValue) {
        setEquityValueAsx(equityValue);
      } else {
        setEquityValueAsx(equityPositionsSortedByValue[0].marketValue);
      }
      setIsEquityPositionsLoadingAsx(false);
    } catch (error) {
      setIsEquityPositionsLoadingAsx(false);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchEquityPositions();
    fetchTransactionHistory();
    fetchMarketStatus();
    fetchEquityPositionsAsx();
    fetchTransactionHistoryAsx();
    fetchMarketStatusAsx();
    fetchCashStatus();
  }, [stakeToken]);

  const collectPrevSymbols = () => {
    if (!equityPositions || !transactionHistory) return;

    const currentSymbols = equityPositions.map((p) => p.symbol);
    const totalSymbols = transactionHistory.filter((t) => t.symbol).map((t) => t.symbol);
    const uniqueTotalSymbols = [...new Set(totalSymbols)];
    const prevUniqueSymbols = uniqueTotalSymbols.filter((symbol) => !currentSymbols.includes(symbol));
    setPrevSymbols(prevUniqueSymbols);
  };

  const collectPrevSymbolsAsx = () => {
    if (!equityPositionsAsx || !transactionHistoryAsx) return;

    // e.g. symbol: 'VAS.XAU'
    const currentSymbols = equityPositionsAsx.map((p) => p.instrumentCode);
    const totalSymbols = transactionHistoryAsx.filter((t) => t.instrumentCode).map((t) => t.instrumentCode);
    const uniqueTotalSymbols = [...new Set(totalSymbols)];
    const prevUniqueSymbols = uniqueTotalSymbols.filter((symbol) => !currentSymbols.includes(symbol));
    setPrevSymbolsAsx(prevUniqueSymbols);
  };

  useEffect(() => {
    collectPrevSymbols();
  }, [transactionHistory]);

  useEffect(() => {
    collectPrevSymbolsAsx();
  }, [transactionHistoryAsx]);

  return (
    <SiteContext.Provider
      value={{
        isStakeChartModalOpen,
        setIsStakeChartModalOpen,
        equityPositions,
        equityPositionsAsx,
        setEquityPositions,
        setEquityPositionsAsx,
        equityValue,
        equityValueAsx,
        setEquityValue,
        setEquityValueAsx,
        isEquityPositionsLoading,
        isEquityPositionsLoadingAsx,
        setIsEquityPositionsLoading,
        setIsEquityPositionsLoadingAsx,
        errorMessage,
        setErrorMessage,
        fetchEquityPositions,
        fetchEquityPositionsAsx,
        transactionHistory,
        transactionHistoryAsx,
        prevSymbols,
        prevSymbolsAsx,
        marketStatus,
        marketStatusAsx,
        fetchMarketStatus,
        fetchMarketStatusAsx,
        cashStatus,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
