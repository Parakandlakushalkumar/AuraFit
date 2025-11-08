import { useEffect, useRef, useState } from "react";

const formatTime = (secs) => {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

const StopwatchTimer = ({ duration = 30 }) => {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setRunning(false);
            setDone(true);
            try {
              // Non-blocking completion cue
              window?.navigator?.vibrate?.(200);
            } catch {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const handleStartPause = () => {
    if (remaining === 0) return; // do nothing when finished
    setRunning((r) => !r);
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
    setDone(false);
    setRemaining(duration);
  };

  return (
    <div
      className={
        "w-full flex flex-col items-center justify-center gap-4 p-4 rounded-xl border " +
        (done
          ? "border-green-500/50 bg-green-500/5 shadow-[0_0_0_3px_rgba(34,197,94,0.25)]"
          : running
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-card/60")
      }
      aria-live="polite"
    >
      <div className="text-4xl md:text-5xl font-mono font-bold tracking-wider text-foreground">
        {formatTime(remaining)}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={running ? "Pause timer" : "Start timer"}
          onClick={handleStartPause}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            running
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          aria-label="Reset timer"
          onClick={handleReset}
          className="px-4 py-2 rounded-md text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Reset
        </button>
      </div>
      {done && (
        <div className="text-sm text-success mt-1" role="status">
          Complete! Take a breath.
        </div>
      )}
    </div>
  );
};

export default StopwatchTimer;
