const XLSX = require("xlsx");
const workbook = XLSX.readFile("assets/search.xlsx");

async function GetLatestValuesFromDataArchive() {
  const worksheet = await workbook.Sheets[workbook.SheetNames[0]];
  const valuesToReturn = [];

  for (let index = 5; index < 13; index++) {
    const path = worksheet[`B${index}`].v;
    const value = worksheet[`C${index}`].v;

    valuesToReturn.push({ id: path, value: value });
  }

  return valuesToReturn;
}

export default GetLatestValuesFromDataArchive;
