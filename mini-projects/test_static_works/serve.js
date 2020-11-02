const fs = require('fs'),
    http = require('http'),
    contactManager = require("../custom_modules_static/contactManager"),
    logger = require("../custom_modules_static/logger"),
    imageUploader = require("../custom_modules_static/imageUploader");

http.createServer(function (req, res) {
//serve static resources

    // if(req.url === "/test"){
    //     return res.end("test");
    // }  
    
    switch(req.url){
      case "/test":
        return res.end("test");
        break;
      case "/gallery":
        
          return res.end("gallery");
          
      
          
       break;
      case "/logger":
        if (req.method === "GET") {
          res.write(`
          <h1  
          >Welcome to our Logger Application</h1> 
          `);
          logger.renderLoggerForm(res);
          return res.end();
        } else if (req.method === "POST") {
          //return res.end("POST HERE");
          return logger.processForm(req, res);
        }
        break;
        case "/contact-manager":
          contactManager.displayWelcomeScreen(res);
          
          contactManager.displayAddContact(res);
         
          contactManager.displayFilter(res);
            
          //contactManager.displayContacts(res);
          return res.end();
          break;
        case "/contact-manager/edit":
          if (method === "GET") {
            //render edit form
            contactManager.renderEditContact(res, userId);
          } else if (method === "POST") {
            //do the actual edit in the back-end
            contactManager.editContact(req, res, userId);
          }
          break;
        case "/contact-manager/delete":
          if (method === "GET") {
            //delete and redirect to home
            contactManager.deleteContact(req, res, userId);
          }
          break;
        case "/contact-manager/add":
          if (method === "POST") {
            contactManager.addContact(req, res);
          }
          break;
        //return res.end("gallery");
    }

   
   
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

     
    res.writeHead(200);
    return res.end(data);

    
  });

}).listen(5555);