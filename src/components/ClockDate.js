import React, { useState, useEffect, useRef, useContext } from "react";
import ClockColorContext from "../store/ClockColorContext";
import { formatTime } from "../helpers/formatTime";
import "./style/ClockDate.css";

const ClockDate = () => {
  const MODES = ["ALARM", "TIMER"];
  const [convert, setConvert] = useState(0);
  const [date, setDate] = useState("");
  const [modeCounter, setModeCounter] = useState(0);
  const [showDotsS, setShowDotsS] = useState(false);
  const [mode, setMode] = useState("");
  const color = useContext(ClockColorContext);
  const showDots = useRef();

  const [time, setTime] = useState({
    hour: "",
    minutes: "",
    seconds: "",
    period: "",
  });

  const [alarm, setAlarm] = useState({
    hour: { firstDigit: "0", secondDigit: "0" },
    minutes: { firstDigit: "0", secondDigit: "0" },
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
    const convertHour = convert && hour >= 13 ? hour - 12 : hour;

    setConvert(convert);

    setTime({
      hour: convert ? Math.abs(convertHour) : convertHour,
      minutes: formatTime(now.getMinutes()),
      seconds: formatTime(now.getSeconds()),
      period: convert ? (hour - 12 < 0 ? "am" : "pm") : "",
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

  const changeClockMode = () => {
    setModeCounter((prevState) => {
      if (prevState >= 2) {
        return (prevState = 0);
      }
      return prevState + 1;
    });

    setMode(MODES[modeCounter]);
  };

  return (
    <div className="clock">
      <div className="date-time" style={{ background: color }}>
        <div onClick={changeClockMode} className="title-clock" style={{ color: color }}>
          <span > {modeCounter !== 0 ? mode : "CLOCK"} </span>
        </div>
        <div className="wrapper">
          {/* clock */}
          {modeCounter === 0 && (
            <>
              {" "}
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
            </>
          )}
          {mode === "ALARM" && (
            <>
              <div className="alarm-time">
                <span className="time-alarm">{time.hour}:</span>
                <span className="time-alarm">{time.minutes}</span>
                <span className="second-alarm">{time.seconds}</span>
                {time.period && (
                  <span className="period-alarm">{time.period}</span>
                )}
              </div>
              <div className="alarm">
                <span>{alarm.hour.firstDigit}</span>
                <span>{alarm.hour.secondDigit}</span>
                <span>:</span>
                <span>{alarm.minutes.firstDigit}</span>
                <span>{alarm.minutes.secondDigit}</span>
              </div>
            </>
          )}
        </div>
        {modeCounter === 0 && (
          <button
            className="hour-changer"
            style={{ color: color }}
            onClick={() => convertTime(!convert)}
          >
            {convert ? 24 : 12}-hour
          </button>
        )}
        {mode === "ALARM" && (
          <>
            <button
              className="alarm-time-btn set-time"
              style={{ color: color }}
            >
              Set time
            </button>
            <button className="alarm-time-btn confirm" style={{ color: color }}>
              Confirm
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ClockDate;

//add stopwatch and temporizator with sound
