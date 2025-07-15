"use client"

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee, Brain, Clock } from "lucide-react";

export default function PomodoroTimer() {
  const [customDurations, setCustomDurations] = useState({
    Work: 25,
    "Short Break": 5,
    "Long Break": 15,
  });

  const [timerState, setTimerState] = useState({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    session: "Work",
  });

  const audioRef = useRef(null);

  const { minutes, seconds, isRunning, session } = timerState;

  const formatTime = (mins, secs) =>
    `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  const tick = () => {
    setTimerState((prev) => {
      let { minutes, seconds, session } = prev;

      if (minutes === 0 && seconds === 0) {
        const nextSession =
          session === "Work"
            ? "Short Break"
            : session === "Short Break"
            ? "Long Break"
            : "Work";

        notify(nextSession);
        playSound();

        return {
          minutes: customDurations[nextSession],
          seconds: 0,
          isRunning: true,
          session: nextSession,
        };
      }

      if (seconds === 0) {
        minutes -= 1;
        seconds = 59;
      } else {
        seconds -= 1;
      }

      return { ...prev, minutes, seconds };
    });
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(tick, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  const notify = (nextSession) => {
    if (Notification.permission === "granted") {
      new Notification("Pomodoro Timer", {
        body: `Time for: ${nextSession}`,
        icon: "/favicon.ico",
      });
    }
  };

  const playSound = () => {
    audioRef.current?.play();
  };

  const startPause = () => {
    setTimerState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const reset = () => {
    const mins = customDurations[session];
    setTimerState((prev) => ({
      ...prev,
      minutes: mins,
      seconds: 0,
      isRunning: false,
    }));
  };

  const handleCustomChange = (type, value) => {
    const newVal = Math.max(1, parseInt(value) || 1);
    setCustomDurations((prev) => ({ ...prev, [type]: newVal }));
    if (session === type) {
      setTimerState((prev) => ({
        ...prev,
        minutes: newVal,
        seconds: 0,
        isRunning: false,
      }));
    }
  };

  const getSessionIcon = () => {
    switch (session) {
      case "Work":
        return <Brain className="w-6 h-6" />;
      case "Short Break":
        return <Coffee className="w-6 h-6" />;
      case "Long Break":
        return <Clock className="w-6 h-6" />;
      default:
        return <Brain className="w-6 h-6" />;
    }
  };

  const getSessionColor = () => {
    switch (session) {
      case "Work":
        return "from-red-500 to-orange-500";
      case "Short Break":
        return "from-green-500 to-emerald-500";
      case "Long Break":
        return "from-blue-500 to-indigo-500";
      default:
        return "from-red-500 to-orange-500";
    }
  };

  const total = customDurations[session] * 60;
  const remaining = minutes * 60 + seconds;
  const progress = ((total - remaining) / total) * 100;

  return (
    <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-8 shadow-2xl border border-white/20">
      <audio ref={audioRef} src="/bomb_timer.mp3" preload="auto" />
      
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className={`p-3 rounded-2xl bg-gradient-to-r ${getSessionColor()} text-white shadow-lg`}>
          {getSessionIcon()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{session}</h2>
          <p className="text-gray-600 text-sm">Stay focused and productive</p>
        </div>
      </div>

      <div className="relative mb-8">
        <div className="relative w-64 h-64 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-200" />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-800 font-mono">
                {formatTime(minutes, seconds)}
              </div>
              <div className="text-sm text-gray-500 mt-2">{isRunning ? "Running" : "Paused"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <motion.button onClick={startPause}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white shadow-lg ${
            isRunning
              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          }`}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isRunning ? "Pause" : "Start"}
        </motion.button>

        <motion.button onClick={reset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-gray-700 bg-white/80 hover:bg-white shadow-lg border border-gray-200"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </motion.button>
      </div>

      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        {["Work", "Short Break", "Long Break"].map((type) => (
          <input
            key={type}
            type="number"
            min={1}
            value={customDurations[type]}
            onChange={(e) => handleCustomChange(type, e.target.value)}
            className="px-3 py-2 rounded-xl text-sm w-24 text-center text-gray-700 bg-white/70 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            placeholder={`${type} min`}
          />
        ))}
      </div>
    </div>
  );
}
