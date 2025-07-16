"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";

export default function PomodoroTimer() {
  const [customTime, setCustomTime] = useState({ hours: 0, minutes: 25, seconds: 0 });

  const [timerState, setTimerState] = useState({
    totalSeconds: 1500, // 25 mins default
    remainingSeconds: 1500,
    isRunning: false,
  });

  const audioRef = useRef(null);
  const { totalSeconds, remainingSeconds, isRunning } = timerState;

  const formatTime = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const tick = () => {
    setTimerState((prev) => {
      if (prev.remainingSeconds <= 0) {
        notify();
        playSound();
        return { ...prev, isRunning: false };
      }
      return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
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

  const notify = () => {
    if (Notification.permission === "granted") {
      new Notification("Custom Timer", {
        body: "Time's up!",
        icon: "/favicon.ico",
      });
    }
  };

  const playSound = () => {
    audioRef.current?.play();
  };

  const startPause = () => {
    if (!isRunning && remainingSeconds === 0) return;
    setTimerState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const reset = () => {
    const total =
      customTime.hours * 3600 + customTime.minutes * 60 + customTime.seconds;
    setTimerState({
      totalSeconds: total,
      remainingSeconds: total,
      isRunning: false,
    });
  };

  const handleInputChange = (field, value) => {
    const val = Math.max(0, parseInt(value) || 0);
    const updated = { ...customTime, [field]: val };
    setCustomTime(updated);

    const total = updated.hours * 3600 + updated.minutes * 60 + updated.seconds;
    setTimerState({
      totalSeconds: total,
      remainingSeconds: total,
      isRunning: false,
    });
  };

  const progress = totalSeconds === 0 ? 0 : ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  return (
    <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-8 shadow-2xl border border-white/20">
      <audio ref={audioRef} src="/bomb_timer.mp3" preload="auto" />

      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Custom Timer</h2>
          <p className="text-gray-600 text-sm">Set your own time and start</p>
        </div>
      </div>

      <div className="relative mb-8">
       <div className="relative w-full max-w-[256px] aspect-square mx-auto">
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
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 font-mono">
                {formatTime(remainingSeconds)}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {isRunning ? "Running" : "Paused"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <motion.button
          onClick={startPause}
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

        <motion.button
          onClick={reset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-gray-700 bg-white/80 hover:bg-white shadow-lg border border-gray-200"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </motion.button>
      </div>

      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        {["hours", "minutes", "seconds"].map((field) => (
          <input
            key={field}
            type="number"
            min={0}
            value={customTime[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="px-3 py-2 rounded-xl text-sm w-24 text-center text-gray-700 bg-white/70 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            placeholder={field}
          />
        ))}
      </div>
    </div>
  );
}
