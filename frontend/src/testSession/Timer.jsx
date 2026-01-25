import { useEffect, useState } from "react";

export default function Timer({ durationMinutes, onTimeUp }) {
  const [secondsLeft, setSecondsLeft] = useState(
    durationMinutes * 60
  );

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="timer">
      Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}
