import { Helmet } from "react-helmet";
import { helmetJsonLdProp } from "react-schemaorg";
import { format, formatDuration, intervalToDuration } from "date-fns";
import { usePrideSelect } from "../currentWeekNumberContext";

export const MetaDescription = () => {
  const { selectedPride } = usePrideSelect();

  const DEFAULT_DESCRIPTION = "Find all details about prides in Europe in 2024";

  const pageDescription = selectedPride
    ? prideDescription(selectedPride)
    : DEFAULT_DESCRIPTION;
  const pageTitle = `${
    selectedPride ? selectedPride.city + " Pride | " : ""
  }Pride Map 2024`;
  return (
    <Helmet
      script={[
        selectedPride?.paradeStartDate
          ? helmetJsonLdProp({
              "@context": "https://schema.org",
              "@type": "Event",
              name: selectedPride?.name || selectedPride.city + " Pride Parade",
              location: {
                "@type": "Place",
                name: `${selectedPride.city}, ${selectedPride.country}`,
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
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="twitter:card" content="summary" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content="https://pridemap.eu/twitter-tag.png" />
    </Helmet>
  );
};

const prideDescription = (selectedPride) => {
  function pStart(fmt) {
    return format(selectedPride.paradeStartDate, fmt);
  }
  function fStart(fmt) {
    return format(selectedPride.festivalStartDate, fmt);
  }

  function fDuration() {
    return formatDuration(
      intervalToDuration({
        start: selectedPride.festivalStartDate,
        end: selectedPride.festivalEndDate,
      }),
      ["day"]
    );
  }

  let desc = [];

  if (selectedPride.paradeStartDate) {
    desc.push(
      `${selectedPride.city} Pride is in ${pStart(
        "MMMM"
      )}, parade will happen on ${pStart("MMMM, do yyyy")}.`
    );
  } else {
    desc.push(
      `${selectedPride.city} Pride Parade is not yet announced. Stay tuned!`
    );
  }

  if (selectedPride.festivalStartDate && selectedPride.festivalEndDate) {
    desc.push(
      `There will be a pride festival${
        selectedPride.festivalName ? ` (${selectedPride.festivalName})` : ""
      }: it will start on ${fStart("MMMM, do")} and last ${fDuration()}.`
    );
    if (selectedPride.festivalDescription) {
      desc.push(selectedPride.festivalDescription);
    }
  }

  return desc.join(" ");
};
