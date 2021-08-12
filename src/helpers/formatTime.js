export const formatTime = (time) => {
    return time.toString().length !== 2 ? `0${time}` : time;
  };