import React, { useState, useEffect, useRef } from "react";
import { formatTime } from "../helpers/formatTime";

import alarmOnSound from "../assets/sound/alarm-sound.mp3";

import { MODES, COLORS } from "../config";

import Alarm from "./Alarm";
import Timer from "./Timer";

import "./style/ClockDate.css";

const alarmSound = new Audio(alarmOnSound);

const ClockDate = () => {
  /********************STATES**************************************/

  const [convert, setConvert] = useState(0);
  const [date, setDate] = useState("");
  const [modeCounter, setModeCounter] = useState(0);
  const [colorCounter, setColorCounter] = useState(0);
  const [showDotsS, setShowDotsS] = useState(false);
  const [mode, setMode] = useState("");
  const [playAlarm, setPlayAlarm] = useState(false);
  const [time, setTime] = useState({
    hour: "",
    minutes: "",
    seconds: "",
    period: "",
  });

  const [alarmClock, setAlarmClock] = useState({
    hour: "",
    minutes: "",
    seconds: "",
  });
  const showDots = useRef();

  /********************FUNCTIONS**************************************/

  const convertTime = (value) => {
    setConvert(value);
    localStorage.setItem("&C", value);
    clock();
  };

  const clock = () => {
    const convert = JSON.parse(localStorage.getItem("&C"));
    const now = new Date();
    const hour = formatTime(now.getHours());
    const minutes = formatTime(now.getMinutes());
    const second = formatTime(now.getSeconds());
    const convertHour = convert && hour >= 13 ? hour - 12 : hour;

    setAlarmClock({
      hour: hour,
      minutes: minutes,
      seconds: second,
    });

    setConvert(convert);

    setTime({
      hour: convert ? Math.abs(convertHour) : convertHour,
      minutes: minutes,
      seconds: second,
      period: convert ? (hour - 12 < 0 ? "am" : "pm") : "",
    });
    setDate(now.toDateString().toUpperCase());
    showDots.current = !showDots.current;
    setShowDotsS(showDots.current);

    const alarmTime = localStorage.getItem("alarmtime");

    const clockTime = `${hour}:${minutes}`;
    checkSetAlarm(clockTime, alarmTime);
  };

  const checkSetAlarm = (clockTime, alarmTime) => {
    const pausealarm = localStorage.getItem("pausealarm");
    if (alarmTime === clockTime) {
      setPlayAlarm(true);
      if (pausealarm) {
        setPlayAlarm(false);
        alarmSound.pause();
        return;
      }
      alarmSound.play();
    } else {
      setPlayAlarm(false);
      alarmSound.pause();
      localStorage.removeItem("pausealarm");
    }
  };

  const changeClockMode = () => {
    setModeCounter((prevState) => {
      if (prevState >= MODES.length) {
        return (prevState = 0);
      }
      return prevState + 1;
    });

    setMode(MODES[modeCounter]);
  };

  const changeClockColor = () => {
    setColorCounter((prevState) => {
      if (prevState >= COLORS.length - 1) {
        return (prevState = 0);
      }
      return prevState + 1;
    });
  };

  /********************EFFECTS**************************************/

  useEffect(() => {
    const timeInterval = setInterval(clock, 1000);
    return () => {
      clearInterval(timeInterval);
    };
  });

  /*****************************************************************/

  return (
    <div className="clock">
      <div className={`date-time ${COLORS[colorCounter]}`}>
        <div
          onClick={changeClockMode}
          className={`title-clock title-clock-${COLORS[colorCounter]}`}
        >
          <span> {modeCounter !== 0 ? mode : "CLOCK"} </span>
        </div>
        <div>
          {/* clock */}
          {modeCounter === 0 && (
            <div>
              <div
                onClick={changeClockColor}
                className={`wrapper wrapper-${COLORS[colorCounter]}`}
              >
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
                </div>{" "}
              </div>
              <button
                className={`hour-converter-btn btn-${COLORS[colorCounter]}`}
                onClick={() => convertTime(!convert)}
              >
                {convert ? 24 : 12}-hour
              </button>
            </div>
          )}
          {mode === "ALARM" && (
            <Alarm
              alarmClock={alarmClock}
              themeColor={COLORS[colorCounter]}
              playAlarm={playAlarm}
              changeClockColor={changeClockColor}
            >
              <div className="alarm-time">
                <span className="time-alarm">{alarmClock.hour}:</span>
                <span className="time-alarm">{alarmClock.minutes}</span>
                <span className="second-alarm">{alarmClock.seconds}</span>
              </div>
            </Alarm>
          )}
          {mode === "TIMER" && <Timer changeClockColor={changeClockColor} themeColor={COLORS[colorCounter]} />}
        </div>
      </div>
    </div>
  );
};

export default ClockDate;

//add stopwatch and temporizator with sound
