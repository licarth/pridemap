import { isValid, parse } from "date-fns";
import "rc-slider/assets/index.css";
import {
  createContext,
  default as React,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import useGoogleSheets from "use-google-sheets";
import { map } from "./computeMapSvg";
import _ from "lodash";

export const PrideSelectContext = createContext({
  project: null,
});

export const PrideSelectContextProvider = ({ children }) => {
  const [weekendNumber, setWeekendNumber] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [mode, setMode] = useState(null);

  const [previewedWeekendNumber, setPreviewedWeekendNumber] = useState();

  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    sheetId: "1P7xHRf4C7Gh6HBc1FdJbdxO73UqgM-_TbAm6341SutI",
  });

  const resetSelection = useCallback(() => {
    setSelectedCity(null);
    setWeekendNumber(null);
    setMode("weekend");
  }, [setSelectedCity, setWeekendNumber]);

  const prides = useMemo(() => {
    return (
      !loading &&
      !error &&
      data[0].data.slice(1).flatMap((p) => {
        const lat = Number(p.Latitude);
        const lng = Number(p.Longitude);
        const weekendNumber = Number(p.weekendNumber);
        if (isNaN(lat) || isNaN(lng) | !weekendNumber) {
          return [];
        }

        const parseDate = (string, defaultValue) => {
          try {
            const newLocal = parse(string, "dd/MM", new Date(2022, 1));
            return isValid(newLocal) ? newLocal : defaultValue;
          } catch {
            return defaultValue;
          }
        };
        return [
          {
            pin: map.getPin({
              lat,
              lng,
              svgOptions: { radius: 0.4 },
            }),
            city: p.city,
            lat,
            lng,
            weekendNumber,
            paradeStartDate: parseDate(p.paradeStartDate),
          },
        ];
      })
    );
  }, [loading, error, data]);

  const maxWeekendNumber = prides
    ? Math.max(...prides.map((p) => p.weekendNumber))
    : null;
  const minWeekendNumber = prides
    ? Math.min(...prides.map((p) => p.weekendNumber))
    : null;

  const nextWeekend = useCallback(() => {
    setMode("weekend");
    return setWeekendNumber((w) =>
      w ? Math.min(w + 1, maxWeekendNumber) : minWeekendNumber
    );
  }, [setWeekendNumber, maxWeekendNumber]);

  const previousWeekend = useCallback(() => {
    setMode("weekend");
    return setWeekendNumber((w) => Math.max(w - 1, minWeekendNumber));
  }, [setWeekendNumber, minWeekendNumber]);

  const pridesByCities = useMemo(() => _.keyBy(prides, "city"), [prides]);

  console.log(`weekendNumber: ${weekendNumber}`);
  console.log(`previewedWeekendNumber: ${previewedWeekendNumber}`);
  console.log(`selectedCity: ${selectedCity}`);
  console.log(`mode: ${mode}`);

  return (
    <PrideSelectContext.Provider
      value={{
        maxWeekendNumber,
        minWeekendNumber,
        weekendNumber,
        nextWeekend,
        previousWeekend,
        selectWeekend: (weekendNumber) => {
          setWeekendNumber(weekendNumber);
          setMode("weekend");
        },
        setWeekendNumber,
        previewedWeekendNumber,
        setPreviewedWeekendNumber,
        prides,
        loading,
        error,
        selectedPride: pridesByCities[selectedCity],
        selectedCity,
        selectCity: (city) => {
          setWeekendNumber(pridesByCities[city].weekendNumber);
          setSelectedCity(city);
          setMode("city");
        },
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
