import React, { useState, useEffect, useRef } from "react";
import { formatTime } from "../helpers/formatTime";

import alarmOnSound from "../assets/sound/alarm-sound.mp3";
import timerOffSound from "../assets/sound/timer-off.mp3";

import { MODES, COLORS, ALARM_DIGITS, TIMER_DIGITS } from "../config";

import "./style/Clock.css";

const alarmSound = new Audio(alarmOnSound);
const timerSound = new Audio(timerOffSound);

const ClockDate = () => {
  /********************STATES**************************************/

  /*********CLOCK*************/
  const [themeColor, setThemeColor] = useState("beige");
  const [date, setDate] = useState("");
  const [modeCounter, setModeCounter] = useState(0);
  const [showDotsS, setShowDotsS] = useState(false);
  const [mode, setMode] = useState("");
  const [playAlarm, setPlayAlarm] = useState(false);
  const [convert, setConvert] = useState(0);
  const [time, setTime] = useState({
    hour: "",
    minutes: "",
    seconds: "",
    period: "",
  });
  const showDots = useRef();

  /**********ALARM**********/
  const [alarmClock, setAlarmClock] = useState({
    hour: "",
    minutes: "",
    seconds: "",
  });
  const [alarmDigitCounter, setAlarmDigitCounter] = useState(0);
  const [turnAlarmDigit, setTurnAlarmDigit] = useState("");
  const [alarm, setAlarm] = useState({
    hourFirstDigit: 0,
    hourSecondDigit: 0,
    minuteFirstDigit: 0,
    minuteSecondDigit: 0,
  });

  /**********TIMER**********/
  const [timerDigitCounter, setTimerDigitCounter] = useState(0);
  const [turnTimerDigit, setTurnTimerDigit] = useState("");
  const [startTimer, setStartTimer] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);
  const [counterTimer, setCounterTimer] = useState(0);
  const [digitsTimerSeconds, setDigitsTimerSeconds] = useState(0);
  const [digitsTimerMinutes, setDigitsTimerMinutes] = useState(0);

  const [timer, setTimer] = useState({
    minuteFirstDigit: 0,
    minuteSecondDigit: 0,
    secondsFirstDigit: 0,
    secondsSecondDigit: 0,
    nanoSeconds: 0,
  });

  /********************FUNCTIONS**************************************/

  /*********CLOCK*************/
  const clock = () => {
    const convert = JSON.parse(localStorage.getItem("converter"));
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
    console.log(convertHour);
    setTime({
      hour: convert
        ? Math.abs(convertHour) === 0
          ? 12
          : Math.abs(convertHour)
        : convertHour,
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

  const convertTime = (value) => {
    setConvert(value);
    localStorage.setItem("converter", value);
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
    setThemeColor(COLORS[0] !== themeColor ? COLORS[0] : COLORS[1]);
    localStorage.setItem(
      "themecolor",
      COLORS[0] !== themeColor ? COLORS[0] : COLORS[1]
    );
  };

  /**********ALARM**********/

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

  const changeDigitAlarm = () => {
    setAlarmDigitCounter((prevState) => {
      if (prevState >= ALARM_DIGITS.length - 1) {
        return (prevState = 0);
      }
      return prevState + 1;
    });

    setTurnAlarmDigit(ALARM_DIGITS[alarmDigitCounter]);
  };
  const setTimeAlarm = () => {
    if (turnAlarmDigit === "HOUR_FIRST_DIGIT") {
      setAlarm((prevState) => {
        if (alarm.hourFirstDigit > 1) {
          return { ...prevState, hourFirstDigit: 0 };
        }
        return { ...prevState, hourFirstDigit: alarm.hourFirstDigit + 1 };
      });
    }

    if (turnAlarmDigit === "HOUR_SECOND_DIGIT") {
      setAlarm((prevState) => {
        if (alarm.hourFirstDigit === 0) {
          if (alarm.hourSecondDigit > 8) {
            return { ...prevState, hourSecondDigit: 0 };
          }
        }

        if (alarm.hourFirstDigit === 1) {
          if (alarm.hourSecondDigit > 8) {
            return { ...prevState, hourSecondDigit: 0 };
          }
        }

        if (alarm.hourFirstDigit === 2) {
          if (alarm.hourSecondDigit > 2) {
            return { ...prevState, hourSecondDigit: 0 };
          }
        }

        return { ...prevState, hourSecondDigit: alarm.hourSecondDigit + 1 };
      });
    }
    if (turnAlarmDigit === "MINUTE_FIRST_DIGIT") {
      setAlarm((prevState) => {
        if (alarm.minuteFirstDigit > 4) {
          return { ...prevState, minuteFirstDigit: 0 };
        }
        return { ...prevState, minuteFirstDigit: alarm.minuteFirstDigit + 1 };
      });
    }

    if (turnAlarmDigit === "MINUTE_SECOND_DIGIT") {
      setAlarm((prevState) => {
        if (alarm.minuteSecondDigit > 8) {
          return { ...prevState, minuteSecondDigit: 0 };
        }
        return { ...prevState, minuteSecondDigit: alarm.minuteSecondDigit + 1 };
      });
    }
  };

  const stopAlarm = () => {
    localStorage.setItem("pausealarm", true);
  };

  /**********TIMER**********/

  const changeDigitTimer = () => {
    setTimerDigitCounter((prevState) => {
      if (prevState >= TIMER_DIGITS.length - 1) {
        return (prevState = 0);
      }
      return prevState + 1;
    });

    setTurnTimerDigit(TIMER_DIGITS[timerDigitCounter]);
  };

  const setTimeTimer = () => {
    if (turnTimerDigit === "MINUTE_FIRST_DIGIT") {
      setTimer((prevState) => {
        if (timer.minuteFirstDigit > 4) {
          return { ...prevState, minuteFirstDigit: 0 };
        }
        return { ...prevState, minuteFirstDigit: timer.minuteFirstDigit + 1 };
      });
    }

    if (turnTimerDigit === "MINUTE_SECOND_DIGIT") {
      setTimer((prevState) => {
        if (timer.minuteSecondDigit > 8) {
          return { ...prevState, minuteSecondDigit: 0 };
        }
        return { ...prevState, minuteSecondDigit: timer.minuteSecondDigit + 1 };
      });
    }
    if (turnTimerDigit === "SECONDS_FIRST_DIGIT") {
      setTimer((prevState) => {
        if (timer.secondsFirstDigit > 4) {
          return { ...prevState, secondsFirstDigit: 0 };
        }
        return { ...prevState, secondsFirstDigit: timer.secondsFirstDigit + 1 };
      });
    }

    if (turnTimerDigit === "SECONDS_SECOND_DIGIT") {
      setTimer((prevState) => {
        if (timer.secondsSecondDigit > 8) {
          return { ...prevState, secondsSecondDigitf: 0 };
        }
        return {
          ...prevState,
          secondsSecondDigit: timer.secondsSecondDigit + 1,
        };
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

  /********************EFFECTS**************************************/

  useEffect(() => {
    const alarmTime = localStorage.getItem("alarmtime");
    const themeColor = localStorage.getItem("themecolor");
    if (themeColor) setThemeColor(themeColor);

    if (alarmTime) {
      const [
        hourFirstDigit,
        hourSecondDigit,
        minuteFirstDigit,
        minuteSecondDigit,
      ] = alarmTime.match(/\d+/g).join("");

      setAlarm({
        hourFirstDigit: parseInt(hourFirstDigit),
        hourSecondDigit: parseInt(hourSecondDigit),
        minuteFirstDigit: parseInt(minuteFirstDigit),
        minuteSecondDigit: parseInt(minuteSecondDigit),
      });
    }
  }, []);
  /************CLOCK*********/
  useEffect(() => {
    const timeInterval = setInterval(clock, 1000);
    return () => {
      clearInterval(timeInterval);
    };
  });

  /**********ALARM**********/
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

  /**********TIMER**********/
  useEffect(() => {
    if (startTimer) timer.nanoSeconds--;

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

  useEffect(() => {
    if (startTimer) {
      if (digitsTimerSeconds === 0 && digitsTimerMinutes === 0) {
        setDigitsTimerMinutes(0);
        setDigitsTimerSeconds(0);
        setStartTimer(false);
        setStopTimer(false);
        localStorage.setItem("pausetimer", true);
        timerSound.play();
      }
    }
  }, [digitsTimerMinutes, digitsTimerSeconds, startTimer]);

  /*****************************************************************/

  return (
    <div className="clock">
      <div className={`date-time ${themeColor}`}>
        <div
          onClick={changeClockMode}
          className={`title-clock title-clock-${themeColor}`}
        >
          <span> {modeCounter !== 0 ? mode : "CLOCK"} </span>
        </div>
        <div>
          {/* clock */}
          {modeCounter === 0 && (
            <div>
              <div
                onClick={changeClockColor}
                className={`wrapper wrapper-${themeColor}`}
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
                className={`hour-converter-btn btn-${themeColor}`}
                onClick={() => convertTime(!convert)}
              >
                {convert ? 24 : 12}-hour
              </button>
            </div>
          )}
          {mode === "ALARM" && (
            <>
              <div>
                <div
                  className={`wrapper wrapper-${themeColor}`}
                  onClick={changeClockColor}
                >
                  <div className={`alarm-time alarm-time-${themeColor}`}>
                    <span className="time-alarm">{alarmClock.hour}:</span>
                    <span className="time-alarm">{alarmClock.minutes}</span>
                    <span className="second-alarm">{alarmClock.seconds}</span>
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
                </div>
                {playAlarm ? (
                  <button
                    className={`alarm-time-btn btn-${themeColor}`}
                    onClick={stopAlarm}
                  >
                    Stop Alarm
                  </button>
                ) : (
                  <>
                    <button
                      className={`alarm-time-btn btn-${themeColor}`}
                      onClick={changeDigitAlarm}
                    >
                      Change
                    </button>{" "}
                    <button
                      className={`alarm-time-btn btn-${themeColor}`}
                      onClick={setTimeAlarm}
                    >
                      Set time
                    </button>
                  </>
                )}
              </div>
            </>
          )}
          {mode === "TIMER" && (
            <div>
              <div
                className={`wrapper wrapper-${themeColor}`}
                onClick={changeClockColor}
              >
                <div className="timer">
                  {startTimer && turnTimerDigit === "END" ? (
                    <>
                      <span>{formatTime(digitsTimerMinutes)}</span>
                      <span>:</span>
                      <span>{formatTime(digitsTimerSeconds)}</span>
                    </>
                  ) : (
                    <>
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
              </div>
              {!stopTimer && (
                <button
                  className={`timer-time-btn btn-${themeColor}`}
                  onClick={changeDigitTimer}
                >
                  Change
                </button>
              )}
              {turnTimerDigit !== "END" ? (
                <button
                  className={`timer-time-btn btn-${themeColor}`}
                  onClick={setTimeTimer}
                >
                  Set time
                </button>
              ) : stopTimer ? (
                <button
                  className={`timer-time-btn pause-time btn-${themeColor}`}
                  onClick={pauseTimer}
                >
                  Pause
                </button>
              ) : (
                <button
                  className={`timer-time-btn btn-${themeColor}`}
                  onClick={setTimerStart}
                >
                  Start
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClockDate;
