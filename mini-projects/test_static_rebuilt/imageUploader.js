//import contactManager and logger for styles share
const contactManager = require("./contactManager");
const logger = require("./logger");

const os = require("os");
const fs = require("fs");
const path = require("path");
const Busboy = require("busboy");

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
    <style>
      .btn:hover {
        background: #000;
        color:#ccc;
        border: 2px solid #ccc!important;
      }
      
      .file-input  {
        display: block;
        margin:auto;
        width: 15rem;
        padding:1rem;
      }
    </style>
    <h1 style="${imageUploader.header}">Upload Image</h1>
      <form 
        style="${logger.formStyles}" 
        action="/image-uploader" 
        method="post" 
        enctype="multipart/form-data"
      >
              <input 
                class="file-input" 
                type="file"  
                name="filefield"
              ><br />  
              <input 
                class="btn" 
                style="${imageUploader.uploadBtn}" 
                type="submit" 
                value="Upload img"
              >
      </form>
      `);
  },

  uploadBtn: `
    display:block!important;
    margin:auto!important;
    margin-top:2rem!important;
    width:15rem;
    font-size: 2rem;
    border: 2px solid #000;
    border-radius:5px; 
  `,

  header: ` 
    text-align:center;
  `,

  uploadImage: (req, res) => {
    const busboy = new Busboy({ headers: req.headers });
    busboy.on(
        "file", 
        (fieldname, file, filename, encoding, mimetype) => {
      console.log(
        "File [" +
          fieldname +
          "]: filename: " +
          `${filename}.jpg` +
          ", encoding: " +
          encoding +
          ", mimetype: " +
          mimetype
      );
      const uploadDirectory = "./uploads";
      if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory);
      }
  
      const id = Math.random().toString(12).substring(2, 17);
      const saveTo = path.join(
          __dirname, 
          "uploads", path.basename(`${id}.jpg`));
      file.pipe(fs.createWriteStream(saveTo));
     
    });
  
    busboy.on("finish", function () { 
      return res.end(`
      <h1 
        style="${imageUploader.header}"
      >File uploaded successfully</h1>
    <script>
      setTimeout(()=> {
        window.location.href = "http://localhost:5555/index.html";
      }, 2000);
    </script>
      `);
      
    });
    return req.pipe(busboy);
  } 
};

module.exports = imageUploader;
