import { useEffect, useState } from "react";
import { StakeRatingsModal } from "./StakeRatingsModal";
import { ThumbUpIcon, ThumbDownIcon, HandIcon } from "@heroicons/react/solid";

export const StakeRatings = ({ symbol, selectedFilterCount }) => {
  const [ratings, setRatings] = useState(null);
  const [filteredRatings, setFilteredRatings] = useState(null);
  const [buyCount, setBuyCount] = useState(0);
  const [sellCount, setSellCount] = useState(0);
  const [holdCount, setHoldCount] = useState(0);
  const [isRatingsModalOpen, setIsRatingsModalOpen] = useState(false);

  const handleRatingsModalClose = () => {
    setIsRatingsModalOpen(false);
  };

  const isRatingBuy = (rating) => {
    const buys = ["buy", "outperform", "overweight", "positive"];
    return buys.some((b) => rating.toLowerCase().includes(b.toLowerCase()));
  };

  const isRatingSell = (rating) => {
    const buys = ["sell", "underperform", "underweight"];
    return buys.some((b) => rating.toLowerCase().includes(b.toLowerCase()));
  };

  const countBuySell = (ratings) => {
    let buy = 0;
    let sell = 0;
    let hold = 0;

    ratings.forEach((r) => {
      if (isRatingBuy(r.rating_current)) {
        buy++;
      } else if (isRatingSell(r.rating_current)) {
        sell++;
      } else {
        hold++;
      }
    });
    setBuyCount(buy);
    setSellCount(sell);
    setHoldCount(hold);
  };

  const fetchRatings = async () => {
    try {
      const res = await fetch(
        `https://global-prd-api.hellostake.com/api/data/calendar/ratings?tickers=${symbol}&pageSize=50`
      );
      const { ratings } = await res.json();
      // ETFs don't have ratings
      if (!ratings) return;
      setRatings(ratings);
      // setRatings(ratings.slice(0, selectedFilterCount));
      // countBuySell(ratings.slice(0, selectedFilterCount));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  useEffect(() => {
    if (!ratings) return;
    setFilteredRatings(ratings.slice(0, selectedFilterCount));
    countBuySell(ratings.slice(0, selectedFilterCount));
  }, [ratings, selectedFilterCount]);

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsRatingsModalOpen(!isRatingsModalOpen);
        }}
        className="flex items-center justify-start space-x-2 px-1 hover:bg-gray-100 cursor-pointer"
      >
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

      {ratings && isRatingsModalOpen && (
        <StakeRatingsModal
          symbol={symbol}
          ratings={filteredRatings}
          isOpen={isRatingsModalOpen}
          onClose={handleRatingsModalClose}
          isRatingBuy={isRatingBuy}
          isRatingSell={isRatingSell}
        />
      )}
    </>
  );
};
