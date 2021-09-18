import React from "react";
import Clock from "../components/Clock";

import "./style/Home.css";

const Home = () => {
  return (
    <div className="home">
      <Clock />
      <div class="footer">
        <p className="footer-text2">
          Code by{" "}
          <a
            className="footer-text1"
            href="https://github.com/sevillecarlos/clock"
          >
            @sevillecarlos
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;
