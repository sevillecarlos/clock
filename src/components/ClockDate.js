import React, { useState, useEffect, useRef, useContext } from "react";
import ClockColorContext from "../store/ClockColorContext";
import { formatTime } from "../helpers/formatTime";
import "./style/ClockDate.css";

const ClockDate = () => {
  const [convert, setConvert] = useState(0);
  const [date, setDate] = useState("");
  const [showDotsS, setShowDotsS] = useState(false);
  const color = useContext(ClockColorContext);

  console.log(color);
  const showDots = useRef();

  const [time, setTime] = useState({
    hour: "",
    minutes: "",
    seconds: "",
    period: "",
  });

  useEffect(() => {
    const timeInterval = setInterval(clock, 1000);
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const clock = () => {
    const convert = JSON.parse(localStorage.getItem("&C"));
    const now = new Date();
    const hour = formatTime(now.getHours());
    const convertHour = convert ? hour - 12 : hour;
    setTime({
      hour: convert ? Math.abs(convertHour) : convertHour,
      minutes: formatTime(now.getMinutes()),
      seconds: formatTime(now.getSeconds()),
      period: convert ? (convertHour < 0 ? "am" : "pm") : "",
    });
    setDate(now.toDateString().toUpperCase());
    showDots.current = !showDots.current;
    setShowDotsS(showDots.current);
  };

  const convertTime = (value) => {
    setConvert(value);
    localStorage.setItem("&C", value);
    clock();
  };

  return (
    <div className="date-time" style={{ background: color }}>
      <div className="title-clock" style={{ color: color }}>
        <span>Clock</span>
      </div>
      <div className="wrapper">
        <div className="date">
          <h5>{date} </h5>
        </div>
        <div className="time">
          <span>{time.hour}</span>
          {showDotsS ? ":" : " "}
          <span>{time.minutes}</span>
          <span className="seconds">{time.seconds}</span>
          {time.period && <span className="period">{time.period}</span>}
        </div>
      </div>
      <button
        className="hour-changer"
        style={{ color: color }}
        onClick={() => convertTime(!convert)}
      >
        {convert ? 24 : 12}-hour
      </button>
    </div>
  );
};

export default ClockDate;


//add stopwatch and temporizator with sound