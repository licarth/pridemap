import { GoogleSpreadsheet } from "google-spreadsheet";
// import { parseDate } from "./parseDate";
import fs from "fs";

(async () => {
  const doc = new GoogleSpreadsheet(
    "1P7xHRf4C7Gh6HBc1FdJbdxO73UqgM-_TbAm6341SutI"
  );
  doc.useApiKey("AIzaSyApxCH8P9AHi9gJmDm4wFzljmhAfGoa9b0");
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];

  fs.writeFileSync("../public/sitemap.xml", ``);
  (await sheet.getRows({ offset: 1 })).map((p) => {
    console.log(p.city);
    fs.appendFileSync(
      "../public/sitemap.xml",
      `\nhttps://pridemap.eu/city/${p.city}`
    );
  });
})();
