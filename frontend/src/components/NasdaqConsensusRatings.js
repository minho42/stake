import { useEffect, useState } from "react";

export const NasdaqConsensusRatings = ({ symbol }) => {
  const [buyCount, setBuyCount] = useState(0);
  const [sellCount, setSellCount] = useState(0);
  const [holdCount, setHoldCount] = useState(0);

  const fetchNasdaqConsensusRatings = async () => {
    try {
      const res = await fetch(`http://localhost:4000/nasdaq/consensus/${symbol}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error("fetchNasdaqConsensusRatings failed");
      }
      setBuyCount(data.data.buy);
      setSellCount(data.data.sell);
      setHoldCount(data.data.hold);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNasdaqConsensusRatings();
  }, []);

  return (
    <div className="flex items-center justify-start space-x-2 px-1">
      {buyCount + sellCount + holdCount === 0 ? "-" : ""}

      {buyCount > 0 && (
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          {buyCount}
        </div>
      )}

      {sellCount > 0 && (
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
          </svg>
          {sellCount}
        </div>
      )}

      {holdCount > 0 && (
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a7 7 0 11-14 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 012 0v4.5a.5.5 0 001 0V3z"
              clipRule="evenodd"
            />
          </svg>
          {holdCount}
        </div>
      )}
    </div>
  );
};
