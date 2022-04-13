import "leaflet/dist/leaflet.css";
import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Loader } from "./Loader";

const MapApp = React.lazy(() => import("./MapApp"));

const MapAppSuspense = () => (
  <Suspense fallback={<Loader />}>
    <MapApp />
  </Suspense>
);

const OuterApp = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/:mode/:id" element={<MapAppSuspense />} />
      <Route path="*" element={<MapAppSuspense />} />
    </Routes>
  </BrowserRouter>
);

export default OuterApp;
