const fs = require('fs'),
    http = require('http'),
    contactManager = require("../custom_modules_static/contactManager"),
    logger = require("../custom_modules_static/logger"),
    imageUploader = require("../custom_modules_static/imageUploader");

http.createServer(function (req, res) {
//serve static resources
    const method = req.method;
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
          if(method === "GET"){

       
          contactManager.displayWelcomeScreen(res);
          
          contactManager.displayAddContact(res);
         
          contactManager.displayFilter(res);
            
          //contactManager.displayContacts(res);
          return res.end();
        } 
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
          if (req.method === "GET") {
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

     
    if(req.url === "/contacts.json"){
      //serve contacts statically instead of 'serving from bkend'
      res.writeHead(200); 
      return res.end(`
      ${JSON.parse(data).contacts.map(c=> {
         res.write(`<div class="contact" style=${contactManager.card};>
           <p>Name: ${c.name}</p>
           <p>E-mail: ${c.email} </p>
           <p>Phone: ${c.phone} </p>
           <p>Date added: ${c.added} </p>
           <p>
             <a 
               href="http://localhost:5555/contact-manager/delete" 
                   onclick="setCookie('${c.id}')"
                 >
                   Delete Contact
                 </a></p>
   
               <p>
                 <a 
               href="http://localhost:5555/contact-manager/edit" 
                   onclick="setCookie('${c.id}')" 
                   target="_blank"
                 >
                   Edit Contact
                 </a></p>
             <hr style="max-width:15rem;">
           </div>
         `);
       })
      }`);
    //  return res.end(`${data}`);
    } else {
      res.writeHead(200);
      return res.end(data);
    }
  

    
  });

}).listen(5555);