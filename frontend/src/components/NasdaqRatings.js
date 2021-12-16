import { useEffect, useState } from "react";

export const NasdaqRatings = ({ symbol }) => {
  const [ratingType, setRatingType] = useState(null);

  const fetchNasdaqRatings = async () => {
    try {
      const res = await fetch(`http://localhost:4000/nasdaq/ratings/${symbol}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error("fetchNasdaqRatings failed");
      }
      // console.log(data.data.data);
      setRatingType(data.data.data.meanRatingType);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNasdaqRatings();
  }, []);

  return <div>{ratingType}</div>;
};
