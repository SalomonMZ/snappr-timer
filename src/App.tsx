import { useEffect, useRef, useState } from "react";

const MAX_TIME_ALLOWED = 120;
const MIN_TIME_ALLOWED = 0;

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const desiredTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);
  const [desiredTime, setDesiredTime] = useState<number>(() => {
    const savedTime = Number(sessionStorage.getItem("timerValue"));
    return savedTime > MIN_TIME_ALLOWED ? savedTime : 0;
  });

  const clearTimerInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTimer = (time: number) => {
    clearTimerInterval(); 
    setDesiredTime(time);
    desiredTimeRef.current = time;

    intervalRef.current = setInterval(() => {
      if (desiredTimeRef.current > 0) {
        setDesiredTime((prev) => {
          const updated = Math.max(prev - 1, 0);
          desiredTimeRef.current = updated;
          return updated;
        });
      } else {
        clearTimerInterval();
      }
    }, 1000);
  };

  useEffect(() => {
    if (desiredTime >= MIN_TIME_ALLOWED) {
      sessionStorage.setItem("timerValue", desiredTime.toString());
    }
  }, [desiredTime]);

  useEffect(() => {
    if (desiredTime > MIN_TIME_ALLOWED) {
      startTimer(desiredTime);
    }
    return clearTimerInterval;
  }, []);

  const handleClick = () => {
    const newTime = Number(inputRef.current?.value);
    inputRef.current!.value = "";
    if (newTime > MAX_TIME_ALLOWED || newTime < MIN_TIME_ALLOWED) {
      return;
    }
    startTimer(newTime);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Your timer: {desiredTime}s
        </h1>
        <input
          type="text"
          placeholder="Enter the time for your timer (0 - 120s)"
          ref={inputRef}
          max={120}
          min={0}
          className="w-full max-w-md p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700"
        />
        <button
          onClick={handleClick}
          className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Start your timer
        </button>
      </div>
    </div>
  );
}

export default App;
