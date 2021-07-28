import React, { useState, useEffect } from "react";
import { formatTime } from "../helpers/formatTime";
import { twelveHourConverter } from "../helpers/twelveHourConverter";
import "./style/ClockDate.css";

const ClockDate = () => {
  const [convert, setConvert] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState({
    hour: "",
    minutes: "",
    seconds: "",
  });

  useEffect(() => {
    const timeInterval = setInterval(clock, 1000);
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  useEffect(() => {
    const convert = JSON.parse(localStorage.getItem("&C"));
    setConvert(convert);
  }, []);

  const clock = () => {
    const convert = JSON.parse(localStorage.getItem("&C"));
    const now = new Date();
    setTime({
      hour: formatTime(now.getHours()),
      minutes: formatTime(now.getMinutes()),
      seconds: formatTime(now.getSeconds()),
    });
    setDate(now.toDateString().toUpperCase());
  };

  const convertTime = (value) => {
    setConvert(value);
    clock();
    localStorage.setItem("&C", value);
  };
  return (
    <div className="date-time">
      <div className="title-clock">
        <span>Clock</span>
      </div>
      <div className="wrapper">
        <h5>{date} </h5>
        <div className="time">
          <span>{time.hour}</span>:<span>{time.minutes}</span>
          <span className="seconds">{time.seconds}</span>
        </div>
      </div>
      <button className="hour-changer" onClick={() => convertTime(!convert)}>
        {convert ? 24 : 12}-hour
      </button>
    </div>
  );
};

export default ClockDate;
