import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { ALARM_DIGITS } from "../config";

const Alarm = (props) => {
  /********************PROPS**************************************/

  const { children, themeColor, playAlarm, changeClockColor } = props;
  /********************STATES**************************************/

  const [alarmDigitCounter, setAlarmDigitCounter] = useState(0);
  const [turnAlarmDigit, setTurnAlarmDigit] = useState("");
  const [alarm, setAlarm] = useState({
    hourFirstDigit: 0,
    hourSecondDigit: 0,
    minuteFirstDigit: 0,
    minuteSecondDigit: 0,
  });
  /********************FUNCTIONS**************************************/

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
        console.log(alarm.hourFirstDigit);
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

  const stopAlarm = () => {
    localStorage.setItem("pausealarm", true);
  };

  /********************EFFECTS**************************************/
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

  /*****************************************************************/
  return (
    <div>
      <div
        className={`wrapper wrapper-${themeColor}`}
        onClick={changeClockColor}
      >
        {children}
        <div className="alarm">
          <span
            style={{
              color:
                turnAlarmDigit === "HOUR_FIRST_DIGIT" ? "rgb(68, 68, 61)" : "",
            }}
          >
            {alarm.hourFirstDigit}
          </span>
          <span
            style={{
              color:
                turnAlarmDigit === "HOUR_SECOND_DIGIT" ? "rgb(68, 68, 61)" : "",
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
  );
};

Alarm.propTypes = {
  themeColor: PropTypes.string,
  playAlarm: PropTypes.bool,
  changeClockColor: PropTypes.func,
};

export default Alarm;
