import React, { useState } from "react";
import ClockDate from "../components/ClockDate";
import ClockColorContext from "../../store/ClockColorContext";

import "./style/Home.css";

const Home = () => {
  const [color, setColor] = useState("#ff8600");

  const changeColor = (e) => setColor(e.target.name);
  console.log(color);
  return (
    <ClockColorContext.Provider value={color}>
      <div className="home">
        <ClockDate color={color} />
        <div className="colors">
          <button
            onClick={changeColor}
            name="#ff8600"
            className="orange btn-color"
          ></button>
          <button
            onClick={changeColor}
            name="#ff0a54"
            className="pink btn-color"
          ></button>
          <button
            onClick={changeColor}
            name="#0aefff"
            className="blue btn-color"
          ></button>
          <button
            onClick={changeColor}
            name="#e71d36"
            className="red btn-color"
          ></button>
        </div>
      </div>
    </ClockColorContext.Provider>
  );
};

export default Home;
