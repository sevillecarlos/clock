import React, { useState, useEffect, useRef } from "react";
import { formatTime } from "../helpers/formatTime";
import ReactAudioPlayer from "react-audio-player";
import alarmSound from "../assets/sound/alarm-sound.mp3";
import "./style/ClockDate.css";

const ClockDate = () => {
  const MODES = ["ALARM", "TIMER"];
  const COLORS = [
    "#ff0a54",
    "#0aefff",
    "#db00b6",
    "#ff4800",
    "#a5be00",
    "#80FFDB",
    "#f5dfbb",
  ];
  const ALARM_DIGITS = [
    "HOUR_FIRST_DIGIT",
    "HOUR_SECOND_DIGIT",
    "MINUTE_FIRST_DIGIT",
    "MINUTE_SECOND_DIGIT",
    "END",
  ];

  const TIMER_DIGITS = [
    "MINUTE_FIRST_DIGIT",
    "MINUTE_SECOND_DIGIT",
    "SECONDS_FIRST_DIGIT",
    "SECONDS_SECOND_DIGIT",
    "END",
  ];

  let interval = null;

  const [convert, setConvert] = useState(0);
  const [date, setDate] = useState("");
  const [modeCounter, setModeCounter] = useState(0);
  const [colorCounter, setColorCounter] = useState(0);

  const [alarmDigitCounter, setAlarmDigitCounter] = useState(0);
  const [timerDigitCounter, setTimerDigitCounter] = useState(0);

  const [showDotsS, setShowDotsS] = useState(false);
  const [mode, setMode] = useState("");

  const [turnAlarmDigit, setTurnAlarmDigit] = useState("");
  const [turnTimerDigit, setTurnTimerDigit] = useState("");

  const [startTimer, setStartTimer] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);
  const [counterTimer, setCounterTimer] = useState(0);

  const [playAlarm, setPlayAlarm] = useState(false);

  const [digitsTimerSeconds, setDigitsTimerSeconds] = useState(0);
  const [digitsTimerMinutes, setDigitsTimerMinutes] = useState(0);

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

  const [timer, setTimer] = useState({
    minuteFirstDigit: 0,
    minuteSecondDigit: 0,
    secondsFirstDigit: 0,
    secondsSecondDigit: 0,
    nanoSeconds: 59,
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

    const clockTime = `${hour}:${minutes}`;
    checkSetAlarm(clockTime, alarmTime);
  };

  const checkSetAlarm = (clockTime, alarmTime) => {
    const pausealarm = localStorage.getItem("pausealarm");
    if (alarmTime === clockTime) {
      if (pausealarm) {
        setPlayAlarm(false);
        return;
      }
      setPlayAlarm(true);
    } else {
      // localStorage.removeItem("pausealarm");
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

  const changeDigitTimer = () => {
    setTimerDigitCounter((prevState) => {
      if (prevState >= TIMER_DIGITS.length - 1) {
        return (prevState = 0);
      }
      return prevState + 1;
    });

    setTurnTimerDigit(TIMER_DIGITS[timerDigitCounter]);
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

  const setTimeTimer = () => {
    if (turnTimerDigit === "MINUTE_FIRST_DIGIT") {
      setTimer((prevState) => {
        if (timer.minuteFirstDigit > 5) timer.minuteFirstDigit = 0;
        return { ...prevState, minuteFirstDigit: timer.minuteFirstDigit++ };
      });
    }

    if (turnTimerDigit === "MINUTE_SECOND_DIGIT") {
      setTimer((prevState) => {
        if (timer.minuteSecondDigit > 9) timer.minuteSecondDigit = 0;
        return { ...prevState, minuteSecondDigit: timer.minuteSecondDigit++ };
      });
    }
    if (turnTimerDigit === "SECONDS_FIRST_DIGIT") {
      setTimer((prevState) => {
        if (timer.secondsFirstDigit > 5) timer.secondsFirstDigit = 0;
        return { ...prevState, secondsFirstDigit: timer.secondsFirstDigit++ };
      });
    }

    if (turnTimerDigit === "SECONDS_SECOND_DIGIT") {
      setTimer((prevState) => {
        if (timer.secondsSecondDigit > 9) timer.secondsSecondDigit = 0;
        return { ...prevState, secondsSecondDigit: timer.secondsSecondDigit++ };
      });
    }
  };

  const setTimerStart = () => {
    setStartTimer(true);
    setStopTimer(true);
    const joinSecondsDigits = parseInt(
      `${timer.secondsFirstDigit}${timer.secondsSecondDigit}`
    );

    const joinMinutesDigits = parseInt(
      `${timer.minuteFirstDigit}${timer.minuteSecondDigit}`
    );
    setDigitsTimerSeconds(joinSecondsDigits);
    setDigitsTimerMinutes(joinMinutesDigits);

    const timerInterval = setInterval(
      () => {
        setCounterTimer((prevState) => {
          return prevState - 1;
        });

        const pauseTimer = localStorage.getItem("pausetimer");

        if (pauseTimer) {
          clearInterval(timerInterval);
          localStorage.removeItem("pausetimer");
        }
      },

      20
    );
  };

  const pauseTimer = () => {
    setStopTimer(false);
    localStorage.setItem("pausetimer", true);
  };

  useEffect(() => {
    if (timer.nanoSeconds === 0) {
      setDigitsTimerSeconds((prevState) => {
        return prevState - 1;
      });
      timer.nanoSeconds = 59;
    }

    if (digitsTimerSeconds === 0) {
      setDigitsTimerSeconds(59);
      setDigitsTimerMinutes((prevState) => {
        return prevState - 1;
      });
    }

    if (startTimer) timer.nanoSeconds--;

    setTimer((prevState) => {
      return {
        ...prevState,
        minuteFirstDigit: Number(String(formatTime(digitsTimerMinutes))[0]),
        minuteSecondDigit: Number(String(formatTime(digitsTimerMinutes))[1]),
        secondsFirstDigit: Number(String(formatTime(digitsTimerSeconds))[0]),
        secondsSecondDigit: Number(String(formatTime(digitsTimerSeconds))[1]),
      };
    });
  }, [counterTimer]);

  useEffect(() => {}, []);

  useEffect(() => {
    const timeInterval = setInterval(clock, 1000);
    return () => {
      clearInterval(timeInterval);
    };
  });

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

  useEffect(() => {
    if (turnTimerDigit === "END") {
      const joinSecondsDigits = parseInt(
        `${timer.secondsFirstDigit}${timer.secondsSecondDigit}`
      );

      const joinMinutesDigits = parseInt(
        `${timer.minuteFirstDigit}${timer.minuteSecondDigit}`
      );
      setDigitsTimerSeconds(joinSecondsDigits);
      setDigitsTimerMinutes(joinMinutesDigits);
    }
  }, [turnTimerDigit, timer]);

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
          {mode === "TIMER" && (
            <div className="timer">
              {startTimer && turnTimerDigit === "END" ? (
                <>
                  <span>{formatTime(digitsTimerMinutes)}</span>
                  <span>:</span>
                  <span>{formatTime(digitsTimerSeconds)}</span>
                </>
              ) : (
                <>
                  {" "}
                  <span
                    style={{
                      color:
                        turnTimerDigit === "MINUTE_FIRST_DIGIT"
                          ? "rgb(68, 68, 61)"
                          : "",
                    }}
                  >
                    {timer.minuteFirstDigit}
                  </span>
                  <span
                    style={{
                      color:
                        turnTimerDigit === "MINUTE_SECOND_DIGIT"
                          ? "rgb(68, 68, 61)"
                          : "",
                    }}
                  >
                    {timer.minuteSecondDigit}
                  </span>
                  <span>:</span>
                  <span
                    style={{
                      color:
                        turnTimerDigit === "SECONDS_FIRST_DIGIT"
                          ? "rgb(68, 68, 61)"
                          : "",
                    }}
                  >
                    {timer.secondsFirstDigit}
                  </span>
                  <span
                    style={{
                      color:
                        turnTimerDigit === "SECONDS_SECOND_DIGIT"
                          ? "rgb(68, 68, 61)"
                          : "",
                    }}
                  >
                    {timer.secondsSecondDigit}
                  </span>
                </>
              )}

              <span className="nano-second-timer">
                {formatTime(timer.nanoSeconds)}
              </span>
            </div>
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
        {mode === "TIMER" && (
          <>
            {!stopTimer && (
              <button
                className="timer-time-btn confirm"
                style={{ color: COLORS[colorCounter] }}
                onClick={changeDigitTimer}
              >
                Change
              </button>
            )}
            {turnTimerDigit !== "END" ? (
              <button
                className="timer-time-btn set-time"
                style={{ color: COLORS[colorCounter] }}
                onClick={setTimeTimer}
              >
                Set time
              </button>
            ) : stopTimer ? (
              <button
                className="timer-time-btn pause-time"
                style={{ color: COLORS[colorCounter] }}
                onClick={pauseTimer}
              >
                Pause
              </button>
            ) : (
              <button
                className="timer-time-btn set-time"
                style={{ color: COLORS[colorCounter] }}
                onClick={setTimerStart}
              >
                Start
              </button>
            )}
          </>
        )}
      </div>
      {playAlarm && (
        <ReactAudioPlayer src={alarmSound} loop autoPlay={playAlarm} />
      )}
    </div>
  );
};

export default ClockDate;

//add stopwatch and temporizator with sound
