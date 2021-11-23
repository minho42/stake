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
  const [transactionHistoryAsx, setTransactionHistoryAsx] = useLocalStorage("stakeTransactionHistoryASx", []);

  const fetchTransactionHistoryAsx = async () => {};

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

  const fetchEquityPositionsAsx = async () => {
    if (isStakeChartModalOpen) {
      console.log("open");
      return;
    }
    // TODO: fetchEquityPositionsAsx only when market is open
    // console.log("fetchEquityPositionsAsx");
    setIsEquityPositionsLoadingAsx(true);
    if (!stakeToken) {
      setEquityPositionsAsx([]);
      setEquityValueAsx(null);
      setIsEquityPositionsLoadingAsx(false);
      // setPrevSymbolsAsx([]);
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

  const fetchEquityPositions = async () => {
    if (isStakeChartModalOpen) {
      console.log("open");
      return;
    }
    // TODO: fetchEquityPositions only when market is open
    // console.log("fetchEquityPositions");
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

  useEffect(() => {
    fetchEquityPositions();
    fetchEquityPositionsAsx();
    fetchTransactionHistory();
    fetchTransactionHistoryAsx();
  }, [stakeToken]);

  useEffect(() => {
    if (!equityPositions || !transactionHistory) return;

    const currentSymbols = equityPositions.map((p) => p.symbol);
    const totalSymbols = transactionHistory.filter((t) => t.symbol).map((t) => t.symbol);
    const uniqueTotalSymbols = [...new Set(totalSymbols)];
    const prevUniqueSymbols = uniqueTotalSymbols.filter((symbol) => !currentSymbols.includes(symbol));
    setPrevSymbols(prevUniqueSymbols);
    // TODO: ?change dependency only to symbols from the lists so it doesn't get triggers if dependency is fetched regularly

    // setPrevSymbolsAsx(...)
  }, [transactionHistory]);

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
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
