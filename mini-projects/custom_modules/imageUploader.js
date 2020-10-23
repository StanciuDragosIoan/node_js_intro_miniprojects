//import contactManager and logger for styles share
const contactManager = require("./contactManager");
const logger = require("./logger");
const imageUploader = {
  displayWelcomeScreen: (res) => {
    res.write(`
            <div style="${contactManager.card}">
                <h1>
                  Welcome to image uploader
                </h1>
                <p 
                  style="${contactManager.text}">
                  An app to manage your gallery of pictures
                </p>
            </div>
            `);
  },

  displayUploadForm: (res) => {
    res.write(`
      <form
      style="${logger.formStyles}"
      action=""
      method="POST"
  >
      
      <input 
        style="${imageUploader.uploadBtn}"
        type="file" 
        />
       
  </form>
      `);
  },

  uploadBtn: `
    display:block!important;
    margin:auto!important;
    margin-top:2rem!important;
  `,
};

module.exports = imageUploader;
