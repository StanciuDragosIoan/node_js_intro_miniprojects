const fs = require('fs'),
    http = require('http'),
    contactManager = require("../custom_modules_static/contactManager"),
    logger = require("../custom_modules_static/logger"),
    imageUploader = require("../custom_modules_static/imageUploader");

http.createServer(function (req, res) {
//serve static resources

const url = req.url;
const method = req.method;
    if(url === "/image-uploader"){
      if(method === "GET"){
        imageUploader.displayWelcomeScreen(res);
        imageUploader.displayUploadForm(res);
        return res.end('');
      } else if(method === 'POST'){
        imageUploader.uploadImage(req, res);
      }
      
    }  else {
   
     

   
   
  fs.readFile(__dirname + req.url, function (err,data) {

    if (err) {
      res.writeHead(404);
      res.end(`
      <h1>
        404 Error page not found X_X!
      </h1>
      err message:
      <div>
        ${err}
      </div>
      `);
      return;
    }

    const testFolder = './uploads/';
    const fs = require('fs');

    fs.readdir(testFolder, (err, files) => {
      let gallery = "";
      const path = require("path");
      //filter images in order
      files.sort((a, b) =>  {
        return fs.statSync(testFolder + a).mtime.getTime() - 
               fs.statSync(testFolder + b).mtime.getTime();
    }).forEach(file => {
       // console.log(file);
        gallery +=`
          <img  
            style="
              display:block; 
              margin:auto; 
              margin-top:2rem; 
              margin-bottom:2rem; 
              max-width:700px;
              border: 5px solid #ccc;
              border-radius:5px;" 
            src="/uploads/${file}" alt="some image">
        `;
      });

      let htmlOutput = `

      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Gallery</title>
      </head>
      <body>
          
      <div style="${contactManager.card}">
      <h1>
        Welcome to  the image uploader Gallery
      </h1>
  
  </div>
    
  
     
  ${gallery} 

      
  <script>
         
  //reload page once in cliend side so that user sees the image
  window.addEventListener('DOMContentLoaded', (event) => {
   console.log('DOM fully loaded and parsed');
   if(document.URL.indexOf("#")==-1)
   {
       // Set the URL to whatever it was plus "#".
       url = document.URL+"#";
       location = "#";
       //Reload the page
       location.reload(true);

   }
});
</script>
      
      </body>
      </html>
      
      `;
     fs.writeFile("index.html", htmlOutput, (err) => {});
    });
     
      res.writeHead(200);
      return res.end(data);

    
  });
     
}
    

}).listen(5555);