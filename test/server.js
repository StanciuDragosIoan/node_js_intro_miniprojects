const http = require("http");
const inspect = require("util").inspect;
const os = require("os");
const fs = require("fs");
const path = require("path");

var Busboy = require("busboy");

http
  .createServer(function (req, res) {
    res.setHeader("Content-Type", "text/html");
    if (req.method === "POST") {
      var busboy = new Busboy({ headers: req.headers });
      busboy.on("file", function (
        fieldname,
        file,
        filename,
        encoding,
        mimetype
      ) {
        console.log(
          "File [" +
            fieldname +
            "]: filename: " +
            filename +
            ", encoding: " +
            encoding +
            ", mimetype: " +
            mimetype
        );
        const uploadDirectory = "./uploads";
        if (!fs.existsSync(uploadDirectory)) {
          fs.mkdirSync(uploadDirectory);
        }
        var saveTo = path.join(__dirname, "./uploads", path.basename(filename));
        file.pipe(fs.createWriteStream(saveTo));
        file.on("data", function (data) {
          console.log("File [" + fieldname + "] got " + data.length + " bytes");
        });
        file.on("end", function () {
          console.log("File [" + fieldname + "] Finished");
        });
      });
      busboy.on("field", function (
        fieldname,
        val,
        fieldnameTruncated,
        valTruncated,
        encoding,
        mimetype
      ) {
        console.log("Field [" + fieldname + "]: value: " + inspect(val));
      });
      busboy.on("finish", function () {
        // console.log("Done parsing form!");
        // res.writeHead(303, { Connection: "close", Location: "/" });
        // res.end();
        // res.writeHead(200, { Connection: "close" });
        res.end("That's all folks!");
      });
      return req.pipe(busboy);
    } else if (req.method === "GET") {
      //res.writeHead(200, { Connection: "close" });

      res.end(
        `
               <form method="POST" enctype="multipart/form-data">\
                <input type="file" name="filefield"><br />\
                <input type="submit">\
              </form>\
            `
      );
    }
    //res.writeHead(404);
    res.end();
  })
  .listen(8100, function () {
    console.log("Listening for requests");
  });

// Example output, using http://nodejs.org/images/ryan-speaker.jpg as the file:
//
// Listening for requests
// File [filefield]: filename: ryan-speaker.jpg, encoding: binary
// File [filefield] got 11971 bytes
// Field [textfield]: value: 'testing! :-)'
// File [filefield] Finished
// Done parsing form!
