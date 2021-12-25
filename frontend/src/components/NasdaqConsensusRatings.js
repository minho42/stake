import { useEffect, useState } from "react";
import { ThumbUpIcon, ThumbDownIcon, HandIcon } from "@heroicons/react/solid";

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
          <ThumbUpIcon className="h-5 w-5 text-green-500" />
          {buyCount}
        </div>
      )}

      {sellCount > 0 && (
        <div className="flex items-center">
          <ThumbDownIcon className="h-5 w-5 text-red-400" />
          {sellCount}
        </div>
      )}

      {holdCount > 0 && (
        <div className="flex items-center">
          <HandIcon className="h-5 w-5 text-gray-300" />
          {holdCount}
        </div>
      )}
    </div>
  );
};
