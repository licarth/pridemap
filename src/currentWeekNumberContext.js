import DottedMap from "dotted-map/without-countries";
import { flow } from "fp-ts/lib/function";
import _ from "lodash";
import "rc-slider/assets/index.css";
import {
  createContext,
  default as React,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGoogleSheets from "use-google-sheets";
import { formatWeekend } from "./formatWeekend";
import { parseDate } from "./parseDate";

const formatWeekendUrl = flow(formatWeekend, (s) => _.replace(s, / /g, "_"));

const weekendNumberPerName = _.keyBy(
  _.range(1, 53).map(Number),
  formatWeekendUrl
);

export const PrideSelectContext = createContext({
  project: null,
});

export const PrideSelectContextProvider = ({ children }) => {
  const { mode, id } = useParams();

  const navigate = useNavigate();

  const selectWeekend = useCallback(
    (weekendNumber) => navigate(`/weekend/${formatWeekendUrl(weekendNumber)}`),
    [navigate]
  );

  const selectCity = useCallback(
    (city) => navigate(`/city/${city}`),
    [navigate]
  );

  const [previewedWeekendNumber, setPreviewedWeekendNumber] = useState();

  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    sheetId: "1P7xHRf4C7Gh6HBc1FdJbdxO73UqgM-_TbAm6341SutI",
  });

  const [map, setMap] = useState();

  useEffect(() => {
    fetch("/map.json")
      .then((response) => response.json())
      .then((json) => {
        setMap(new DottedMap({ map: json }));
      });
  }, []);

  const prides = useMemo(() => {
    return (
      !loading &&
      !error &&
      map &&
      data[0].data.slice(1).flatMap((p) => {
        const lat = Number(p.Latitude);
        const lng = Number(p.Longitude);
        const weekendNumber = Number(p.weekendNumber);
        const shouldShowPride =
          !isNaN(lat) &&
          !isNaN(lng) &&
          (isNotEmpty(p.instagram) ||
            isNotEmpty(p.facebook) ||
            isNotEmpty(p.twitter) ||
            isNotEmpty(p.source));

        if (!shouldShowPride) {
          return [];
        }

        return [
          {
            ...p,
            pin: map.getPin({
              lat,
              lng,
            }),
            city: p.city,
            lat,
            lng,
            weekendNumber,
            paradeStartDate: parseDate(p.paradeStartDate),
            festivalStartDate: parseDate(p.festivalStartDate),
            festivalEndDate: parseDate(p.festivalEndDate),
          },
        ];
      })
    );
  }, [loading, error, data, map]);

  const pridesByCities = useMemo(() => _.keyBy(prides, "city"), [prides]);

  const { weekendNumber, selectedCity } = useMemo(() => {
    let weekendNumber = null;
    let selectedCity = null;

    if (loading) {
    } else if (mode === "weekend") {
      if (!weekendNumberPerName[id]) {
        navigate("/");
        return { weekendNumber, selectedCity };
      }
      weekendNumber = weekendNumberPerName[id];
    } else if (mode === "city") {
      if (!pridesByCities[id]) {
        navigate("/");
        return { weekendNumber, selectedCity };
      }
      weekendNumber = pridesByCities[id].weekendNumber;
      selectedCity = id;
    }

    return { weekendNumber, selectedCity };
  }, [mode, id, loading, pridesByCities, navigate]);

  const resetSelection = useCallback(() => {
    selectWeekend("");
  }, [selectWeekend]);

  const pridesWithDate =
    prides?.length && prides.filter((p) => !!p.weekendNumber);

  const minWeekendNumber = pridesWithDate
    ? Math.min(...pridesWithDate.map((p) => p.weekendNumber))
    : null;

  const maxWeekendNumber = pridesWithDate
    ? Math.max(...pridesWithDate.map((p) => p.weekendNumber))
    : null;

  const nextWeekend = useCallback(() => {
    selectWeekend(
      weekendNumber
        ? Math.min(weekendNumber + 1, maxWeekendNumber)
        : minWeekendNumber
    );
  }, [weekendNumber, selectWeekend, maxWeekendNumber, minWeekendNumber]);

  const previousWeekend = useCallback(() => {
    selectWeekend(Math.max(weekendNumber - 1, minWeekendNumber));
  }, [weekendNumber, selectWeekend, minWeekendNumber]);

  const allWeekendNumbers = useMemo(
    () => _.range(minWeekendNumber, maxWeekendNumber + 1).map(Number),
    [minWeekendNumber, maxWeekendNumber]
  );

  return (
    <PrideSelectContext.Provider
      value={{
        allWeekendNumbers,
        weekendNumberPerName,
        maxWeekendNumber,
        minWeekendNumber,
        weekendNumber,
        nextWeekend,
        previousWeekend,
        selectWeekend,
        previewedWeekendNumber,
        setPreviewedWeekendNumber,
        prides,
        loading,
        error,
        selectedPride: pridesByCities[selectedCity],
        selectedCity,
        selectCity,
        mode,
        resetSelection,
      }}
    >
      {children}
    </PrideSelectContext.Provider>
  );
};

export const usePrideSelect = () => {
  return useContext(PrideSelectContext);
};

const isNotEmpty = (str) => str && str.trim().length > 0;
