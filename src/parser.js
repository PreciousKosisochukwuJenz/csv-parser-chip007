const csvToJson = require("convert-csv-to-json");
const converter = require("json-2-csv");
const sha256 = require("sha256");
const fm = require("./filemanager");

const process = async () => {
  const foldername = `${__dirname}/input-data`;
  const files = await fm.readFolder(foldername);

  files.forEach(async (file) => {
    if (file.endsWith("csv")) {
      let jsonArr = [];
      const strArr = file.split(".");
      const outfilename = `${strArr[0]}.json`;

      const json = csvToJson
        .fieldDelimiter(",")
        .getJsonFromCsv(`${__dirname}/input-data/${file}`);

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

      converter.json2csv(jsonArr, async (err, csv) => {
        if (err) console.error(err);

        await fm.write(
          `${__dirname}/output-data/${strArr[0]}.output.${strArr[1]}`,
          csv
        );
      });
    }
  });
};

process();
