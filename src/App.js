import { useEffect } from "react";
import "./App.css";
import {
  PrideSelectContextProvider,
  usePrideSelect,
} from "./currentWeekNumberContext";
import Map from "./Map";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import { helmetJsonLdProp } from "react-schemaorg";
import { format } from "date-fns";

function InnerApp() {
  const { nextWeekend, previousWeekend, resetSelection, selectedPride } =
    usePrideSelect();
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

  return (
    <>
      <Helmet
        script={[
          selectedPride?.paradeStartDate
            ? helmetJsonLdProp({
                "@context": "https://schema.org",
                "@type": "Event",
                name:
                  selectedPride.name || selectedPride.city + " Pride Parade",
                location: {
                  "@type": "Place",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: selectedPride.city,
                    addressCountry: selectedPride.country,
                  },
                },
                date: format(selectedPride.paradeStartDate, "dd-MM-yyyy"),
              })
            : {},
        ]}
      >
        <meta charSet="utf-8" />
        <title>
          {selectedPride ? selectedPride.city + " Pride" : "Pride Map 2022"}
        </title>
      </Helmet>
      <Map />;
    </>
  );
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
