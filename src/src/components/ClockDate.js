import React, { useState, useEffect } from "react";
import { formatTime } from "../helpers/formatTime";
import './style/ClockDate.css'

const ClockDate = () => {
  const [timeInfo, setTimeInfo] = useState("");
  const [dateInfo, setDateInfo] = useState("");

  useEffect(() => {
    updateTimeDate();
  }, []);

  const updateTimeDate = () => {
    setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      const min = now.getMinutes();
      const second = now.getSeconds();
      setTimeInfo(
        `${formatTime(hour)}:${formatTime(min)}:${formatTime(second)}`
      );
      setDateInfo(now.toDateString());
    }, 1000);
  };

  return (
    <div className="date-time">
      <h5>{timeInfo}</h5>
      <h5>{dateInfo}</h5>
      <button>Change to 12-hour clock</button>
    </div>
  );
};

export default ClockDate;
