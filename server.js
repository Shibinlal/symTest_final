const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const readline = require("readline");

const app = express();

app.use(fileUpload());

// Upload Endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  debugger;
  const file = req.files.file;
  let data = [];
  console.log(req.files.file.name);
  file.mv(`${__dirname}/public/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    async function processLineByLine() {
      const fileStream = fs.createReadStream(
        `${__dirname}/public/${file.name}`
      );

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });
      // Note: we use the crlfDelay option to recognize all instances of CR LF
      // ('\r\n') in input.txt as a single line break.

      for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        console.log(`Line from file: ${line}`);
        data.push(line);
      }
      res.json(data);
    }
    processLineByLine();
  });
});

app.listen(5000, () => console.log("Server Started..."));
