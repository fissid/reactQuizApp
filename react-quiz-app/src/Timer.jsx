import { useEffect } from "react";

export default function Timer({ dispatch, secondsRemained }) {
  const min = Math.floor(secondsRemained / 60);
  const sec = secondsRemained % 60;
  useEffect(
    function () {
      const timerID = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);
      return function () {
        clearInterval(timerID);
      };
    },
    [dispatch]
  );
  return (
    <div className="timer">
      {min < 10 && "0"}
      {min}:{sec < 10 && "0"}
      {sec}
    </div>
  );
}
