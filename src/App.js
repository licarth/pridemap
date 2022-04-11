import { format } from "date-fns";
import { Helmet } from "react-helmet";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { helmetJsonLdProp } from "react-schemaorg";
import "./App.css";
import { SearchFrame } from "./components/SearchFrame";
import {
  PrideSelectContextProvider,
  usePrideSelect,
} from "./currentWeekNumberContext";
import Map from "./Map";

function InnerApp() {
  const { selectedPride } = usePrideSelect();

  return (
    <>
      <Helmet
        script={[
          selectedPride?.paradeStartDate
            ? helmetJsonLdProp({
                "@context": "https://schema.org",
                "@type": "Event",
                name:
                  selectedPride?.name || selectedPride.city + " Pride Parade",
                location: {
                  "@type": "Place",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: selectedPride.city,
                    addressCountry: selectedPride.country,
                  },
                },
                startDate: format(selectedPride.paradeStartDate, "dd-MM-yyyy"),
              })
            : {},
        ]}
      >
        <meta charSet="utf-8" />
        <title>
          {selectedPride ? selectedPride.city + " Pride" : "Pride Map 2022"}
        </title>
      </Helmet>
      <SearchFrame />
      <Map />
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
