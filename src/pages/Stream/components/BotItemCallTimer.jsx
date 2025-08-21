/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from "react";
import ClockIcon from "../../../assets/images/svg/clock.svg";

const BotItemCallTimer = ({ isActive }) => {
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setTime(0); // Reset the timer when isActive is false
    }

    // Cleanup the interval on component unmount
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };
  return (
    <Button className="!bg-primaryColor/15 text-primaryColor w-full flex flex-row items-center gap-3">
      <img src={ClockIcon} className="w-5 h-5" />
      <p>{formatTime(time)}</p>
    </Button>
  );
};

export default BotItemCallTimer;
