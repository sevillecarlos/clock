import Home from "./views/Home";
import "./App.css";
function App() {
  return (
    <div className="app">
      <Home />
      <div className="footer">
        <a href="https://github.com/sevillecarlos" target="blank">
          <span className="footer-text1">code by</span>{" "}
          <span className="footer-text2">Carlos🍒</span>
        </a>
      </div>
    </div>
  );
}

export default App;
