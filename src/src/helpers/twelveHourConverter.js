export const twelveHourConverter =  (time) => {
  const timeArr = time.split(":");
  const hour = timeArr.shift();
  const hourConvert = hour - 12;
  const period = hourConvert < 0 ? "AM" : "PM";
  return `${Math.abs(hourConvert)}:${timeArr.join(":")} ${period}`;
};
