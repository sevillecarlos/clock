import React, { useState, useEffect, useRef } from "react";
import { formatTime } from "../helpers/formatTime";
import ReactAudioPlayer from "react-audio-player";
import alarmSound from "../assets/sound/alarm-sound.mp3";
import "./style/ClockDate.css";

const ClockDate = () => {
  const MODES = ["ALARM", "TIMER"];
  const COLORS = ["#ff8600", "#ff0a54", "#0aefff", "#e71d36"];
  const ALARM_DIGITS = [
    "HOUR_FIRST_DIGIT",
    "HOUR_SECOND_DIGIT",
    "MINUTE_FIRST_DIGIT",
    "MINUTE_SECOND_DIGIT",
    "END",
  ];

  const [convert, setConvert] = useState(0);
  const [date, setDate] = useState("");
  const [modeCounter, setModeCounter] = useState(0);
  const [colorCounter, setColorCounter] = useState(0);

  const [alarmDigitCounter, setAlarmDigitCounter] = useState(0);

  const [showDotsS, setShowDotsS] = useState(false);
  const [mode, setMode] = useState("");

  const [turnAlarmDigit, setTurnAlarmDigit] = useState("");

  const [playAlarm, setPlayAlarm] = useState(false);

  const showDots = useRef();

  const [time, setTime] = useState({
    hour: "",
    minutes: "",
    seconds: "",
    period: "",
  });

  const [alarm, setAlarm] = useState({
    hourFirstDigit: 0,
    hourSecondDigit: 0,
    minuteFirstDigit: 0,
    minuteSecondDigit: 0,
  });

  const clock = () => {
    const convert = JSON.parse(localStorage.getItem("&C"));
    const now = new Date();
    const hour = formatTime(now.getHours());
    const minutes = formatTime(now.getMinutes());
    const second = formatTime(now.getSeconds());
    const convertHour = convert && hour >= 13 ? hour - 12 : hour;

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
    const pausealarm = localStorage.getItem("pausealarm");
    if (alarmTime) {
      const clockTime = `${hour}:${minutes}`;
      if (alarmTime === clockTime) {
        // if (pausealarm) {
        //   setPlayAlarm(false);
        //   return;
        // }

        console.log(alarmTime);
//here is the issue of the delay on the alarm SET TIME  button
        // setPlayAlarm(true);
      } else {
        // setPlayAlarm(false);
        // localStorage.removeItem("pausealarm");
      }
    }
  };

  const convertTime = (value) => {
    setConvert(value);
    localStorage.setItem("&C", value);
    clock();
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

  const changeDigit = () => {
    setAlarmDigitCounter((prevState) => {
      if (prevState >= ALARM_DIGITS.length - 1) {
        return (prevState = 0);
      }
      return prevState + 1;
    });

    setTurnAlarmDigit(ALARM_DIGITS[alarmDigitCounter]);
  };

  const stopAlarm = () => {
    localStorage.setItem("pausealarm", true);
  };

  const setTimeAlarm = () => {
    if (turnAlarmDigit === "HOUR_FIRST_DIGIT") {
      setAlarm((prevState) => {
        if (alarm.hourFirstDigit > 2) alarm.hourFirstDigit = 0;
        return { ...prevState, hourFirstDigit: alarm.hourFirstDigit++ };
      });
    }

    if (turnAlarmDigit === "HOUR_SECOND_DIGIT") {
      setAlarm((prevState) => {
        if (alarm.hourFirstDigit === 0) {
          if (alarm.hourSecondDigit > 9) alarm.hourSecondDigit = 0;
        }

        if (alarm.hourFirstDigit === 1) {
          if (alarm.hourSecondDigit > 9) alarm.hourSecondDigit = 0;
        }

        if (alarm.hourFirstDigit === 2) {
          if (alarm.hourSecondDigit > 3) alarm.hourSecondDigit = 0;
        }

        return { ...prevState, hourSecondDigit: alarm.hourSecondDigit++ };
      });
    }
    if (turnAlarmDigit === "MINUTE_FIRST_DIGIT") {
      setAlarm((prevState) => {
        if (alarm.minuteFirstDigit > 5) alarm.minuteFirstDigit = 0;
        return { ...prevState, minuteFirstDigit: alarm.minuteFirstDigit++ };
      });
    }

    if (turnAlarmDigit === "MINUTE_SECOND_DIGIT") {
      setAlarm((prevState) => {
        if (alarm.minuteSecondDigit > 9) alarm.minuteSecondDigit = 0;
        return { ...prevState, minuteSecondDigit: alarm.minuteSecondDigit++ };
      });
    }
  };

  useEffect(() => {
    const timeInterval = setInterval(clock, 1000);
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  useEffect(() => {
    if (turnAlarmDigit === "END") {
      const {
        hourFirstDigit,
        hourSecondDigit,
        minuteFirstDigit,
        minuteSecondDigit,
      } = alarm;
      const alarmTime = `${hourFirstDigit}${hourSecondDigit}:${minuteFirstDigit}${minuteSecondDigit}`;
      localStorage.setItem("alarmtime", alarmTime);
    }
  }, [turnAlarmDigit, alarm]);

  return (
    <div className="clock">
      <div className="date-time" style={{ background: COLORS[colorCounter] }}>
        <div
          onClick={changeClockMode}
          className="title-clock"
          style={{ color: COLORS[colorCounter] }}
        >
          <span> {modeCounter !== 0 ? mode : "CLOCK"} </span>
        </div>
        <div onClick={changeClockColor} className="wrapper">
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
                <span
                  style={{
                    color:
                      turnAlarmDigit === "HOUR_FIRST_DIGIT"
                        ? "rgb(68, 68, 61)"
                        : "",
                  }}
                >
                  {alarm.hourFirstDigit}
                </span>
                <span
                  style={{
                    color:
                      turnAlarmDigit === "HOUR_SECOND_DIGIT"
                        ? "rgb(68, 68, 61)"
                        : "",
                  }}
                >
                  {alarm.hourSecondDigit}
                </span>
                <span>:</span>
                <span
                  style={{
                    color:
                      turnAlarmDigit === "MINUTE_FIRST_DIGIT"
                        ? "rgb(68, 68, 61)"
                        : "",
                  }}
                >
                  {alarm.minuteFirstDigit}
                </span>
                <span
                  style={{
                    color:
                      turnAlarmDigit === "MINUTE_SECOND_DIGIT"
                        ? "rgb(68, 68, 61)"
                        : "",
                  }}
                >
                  {alarm.minuteSecondDigit}
                </span>
              </div>
            </>
          )}
        </div>
        {modeCounter === 0 && (
          <button
            className="hour-changer"
            style={{ color: COLORS[colorCounter] }}
            onClick={() => convertTime(!convert)}
          >
            {convert ? 24 : 12}-hour
          </button>
        )}
        {mode === "ALARM" &&
          (playAlarm ? (
            <button
              className="alarm-time-btn set-time"
              style={{ color: COLORS[colorCounter] }}
              onClick={stopAlarm}
            >
              Stop Alarm
            </button>
          ) : (
            <>
              <button
                className="alarm-time-btn confirm"
                style={{ color: COLORS[colorCounter] }}
                onClick={changeDigit}
              >
                Change
              </button>{" "}
              <button
                className="alarm-time-btn set-time"
                style={{ color: COLORS[colorCounter] }}
                onClick={setTimeAlarm}
              >
                Set time
              </button>
            </>
          ))}
      </div>
      {playAlarm && (
        <ReactAudioPlayer src={alarmSound} loop autoPlay={playAlarm} />
      )}
    </div>
  );
};

export default ClockDate;

//add stopwatch and temporizator with sound
