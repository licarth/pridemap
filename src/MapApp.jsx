import React from "react";

import "./App.css";
import { MetaDescription } from "./components/MetaDescription";
import { SearchFrame } from "./components/SearchFrame";
import { PrideSelectContextProvider } from "./currentWeekNumberContext";
import Map from "./Map";

function InnerApp() {
  return (
    <>
      <MetaDescription />
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
