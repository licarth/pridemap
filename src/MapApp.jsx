import { format } from "date-fns";
import React from "react";
import { Helmet } from "react-helmet";
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

const MapApp = () => (
  <PrideSelectContextProvider>
    <InnerApp />
  </PrideSelectContextProvider>
);

export default MapApp;
