import NavBar from "./NavBar/NavBar";
import Chess from "./ChineseChess/ChineseChess";
import "./App.css";

function App() {
  return (
    <>
      <NavBar
        scrollToAbout={() =>
          window.location.assign("https://mingyuanc.github.io")
        }
      />
      <Chess />
    </>
  );
}
export default App;
