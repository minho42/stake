import { useEffect } from "react";
import ReactDOM from "react-dom";
import { formatDistance } from "date-fns";

export const StakeRatingsModal = ({ symbol, ratings, isOpen, onClose, isRatingBuy, isRatingSell }) => {
  const escClose = (e) => {
    if (e.keyCode === 27) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", escClose);
    return () => {
      document.removeEventListener("keydown", escClose);
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0">
      <div
        id="overlay"
        className="min-h-screen min-w-screen bg-black opacity-40"
        onClick={() => onClose()}
      ></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-screen flex flex-col bg-gray-200 rounded shadow-2xl space-y-1 p-2">
        <div className="bg-white rounded p-2">
          <div className="text-xl text-center">{symbol}</div>
        </div>
        <div className="rounded bg-white p-2 divide-y overflow-y-auto ">
          {ratings &&
            ratings.map((r) => {
              return (
                <div key={r.id} className="flex items-center py-1 space-x-1">
                  <div
                    className={`rounded px-1 py-0.5 
                    ${
                      isRatingBuy(r.rating_current)
                        ? "bg-green-500 text-white"
                        : isRatingSell(r.rating_current)
                        ? "bg-red-500 text-white"
                        : "bg-gray-200"
                    } `}
                  >
                    {r.rating_current}
                  </div>
                  <div className="">{r.analyst}</div>
                  <div className="">
                    (
                    {formatDistance(new Date(r.date), new Date(), {
                      includeSeconds: false,
                      addSuffix: false,
                    })}
                    )
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>,

    document.getElementById("modal-root")
  );
};
