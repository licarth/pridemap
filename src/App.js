import { useEffect } from "react";
import "./App.css";
import {
  PrideSelectContextProvider,
  usePrideSelect,
} from "./currentWeekNumberContext";
import Map from "./Map";

function App() {
  const { nextWeekend, previousWeekend } = usePrideSelect();
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.keyCode === 37) {
        previousWeekend();
      } else if (e.keyCode === 39) {
        nextWeekend();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextWeekend, previousWeekend]);

  return <Map />;
}

export default () => (
  <PrideSelectContextProvider>
    <App />
  </PrideSelectContextProvider>
);
