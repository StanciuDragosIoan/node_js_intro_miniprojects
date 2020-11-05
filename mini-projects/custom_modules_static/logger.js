const fs = require("fs");
// const path = require("path");
const logger = {
  renderLoggerForm: (res) => {
    res.write(`
            <form
                style="${logger.formStyles}"
                action="/logger"
                method="POST"
            >
                <input 
                  name="logText"
                  style="${logger.formField}"
                  type="text">
                <button 
                  style="${logger.formBtn}"
                  type="submit">
                  Log something
                </button>
            </form>
        `);
  },

  formStyles: `
        display:block; 
        margin:auto; 
        margin-top:1rem;
        padding:2rem; 
        font-size:1rem; 
        background: #ddd; 
        border: 2px solid #000; 
        border-radius:5px;
        max-width:600px;
    `,

  formBtn: `
    display:block;
    margin:auto;
    width:60%;
    padding:0.5rem;
    font-size:2rem;
    margin-top:3rem;
  `,

  formField: `
    display:block;
    margin:auto;
    text-align:center;
    font-size:2rem;
    margin-top:1rem;
  `,

  processForm: (req, res) => {
    const body = [];
    //on data to start reading data
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    //on end to finish reading stream
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString(); 
      logger.logToFile(res, parsedBody);
    });
  },

  logToFile: (res, parsedBody) => {
    //define logs dir
    const logDirectory = "./logs";
    //process data to log
    const dataToLog = parsedBody.split("=")[1].split("+").join(" ");
    const date = new Date()
      .toString()
      .replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, "$2-$1-$3");
    //create dir if it does not exist
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory);
    }
    fs.appendFile(
      "./logs/logs.txt",
      `Logged at: ${date}, textLogged: ${dataToLog} \n`,
      function (err) {
        if (err) throw err;
      }
    );
    //redirect back to homepage
    res.statusCode = 302; //redirect
    res.setHeader("Location", "/index.html");

    return res.end();
  },
};

module.exports = logger;
