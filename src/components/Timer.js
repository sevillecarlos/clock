import React, { useState, useEffect } from "react";
import { formatTime } from "../helpers/formatTime";

import PropTypes from "prop-types";

import timerOffSound from "../assets/sound/timer-off.mp3";
import { TIMER_DIGITS } from "../config";

const timerSound = new Audio(timerOffSound);

const Timer = (props) => {
  const { themeColor, changeClockColor } = props;
  /********************STATES**************************************/
  
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

  /********************EFFECTS**************************************/

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
  );
};

Timer.propTypes = {
  themeColor: PropTypes.string,
  changeClockColor: PropTypes.func,
};

export default Timer;
