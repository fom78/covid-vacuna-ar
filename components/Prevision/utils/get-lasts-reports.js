import fs from "fs-extra";
import path from "path";

export default function getNewReports(reports) {
  const dataPath = path.join("public", "data");
  const QTY_REPORTS_FOR_MEDIA = -1*3;

  const newReports = reports.slice(QTY_REPORTS_FOR_MEDIA).map((date) => {
    const fileName = date + ".json";
    const completeFile = dataPath + "/" + fileName;

    const json = fs.readJsonSync(completeFile);
    return json;
  })
  return newReports;
}
