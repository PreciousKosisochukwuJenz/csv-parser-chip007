const fs = require("fs");

class FileManager {
  write = async (filename, data) => {
    fs.writeFile(filename, data, (err) => {
      if (err) console.error(err);
    });
  };

  readFolder = async (foldername) => {
    return fs.readdirSync(foldername);
  };
}

module.exports = new FileManager();
