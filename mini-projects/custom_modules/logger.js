const fs = require("fs");
const path = require("path");
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
    padding:1rem;
    font-size:2rem;
    margin-top:3rem;
  `,

  formField: `
    display:block;
    margin:auto;
    text-align:center;
    font-size:2rem;
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
      console.log(`parsedBody here: ${parsedBody}`);
      logger.logToFile(res, parsedBody);
    });
  },

  logToFile: (res, parsedBody) => {},
};

module.exports = logger;
