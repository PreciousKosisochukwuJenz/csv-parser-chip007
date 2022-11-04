const csvToJson = require("convert-csv-to-json");
const sha256 = require("sha256");
const fm = require("./filemanager");

const process = async () => {
  const foldername = `${__dirname}/input-data`;
  const csvfiles = await fm.readFolder(foldername);

  csvfiles.forEach(async (csv) => {
    if (csv.endsWith("csv")) {
      let jsonArr = [];
      const file = csv.split(".");
      const outfilename = `${file[0]}.json`;

      const json = csvToJson
        .fieldDelimiter(",")
        .getJsonFromCsv(`${__dirname}/input-data/${csv}`);

      for (const row of json) {
        const hash = sha256(JSON.stringify(row));
        const chip0007 = {
          format: "CHIP-0007",
          minting_tool: "SuperMinter/2.5.2",
          sensitive_content: false,
          hash,
          ...row,
        };
        jsonArr.push(chip0007);
      }

      await fm.write(
        `${__dirname}/json-output/${outfilename}`,
        JSON.stringify(jsonArr)
      );
    }
  });
};

process();
