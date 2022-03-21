import { useEffect } from "react";
import "./App.css";
import {
  PrideSelectContextProvider,
  usePrideSelect,
} from "./currentWeekNumberContext";
import Map from "./Map";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function InnerApp() {
  const { nextWeekend, previousWeekend, resetSelection } = usePrideSelect();
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.keyCode === 27) {
        // Escape
        resetSelection();
      } else if (e.keyCode === 37) {
        // Left arrow
        previousWeekend();
      } else if (e.keyCode === 39) {
        // Right arrow
        nextWeekend();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextWeekend, previousWeekend, resetSelection]);

  return <Map />;
}

const App = () => (
  <PrideSelectContextProvider>
    <InnerApp />
  </PrideSelectContextProvider>
);

const OuterApp = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/:mode/:id" element={<App />} />
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
);

export default OuterApp;
