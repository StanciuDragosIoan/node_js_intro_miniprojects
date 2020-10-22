//import http module for our server
const http = require("http");
const contactManager = require("./custom_modules/contactManager");
const logger = require("./custom_modules/logger");

//define port for our server to listen to
const PORT = process.env.port || 5000;

//create server
const server = http.createServer((req, res) => {
  //define url
  const url = req.url;
  //define method
  const method = req.method;
  switch (url) {
    case "/":
      //write client response
      res.write(`
    <h1>Welcome to our nodeJS Server</h1> 
    `);
      //send client response
      res.end();
      break;
    case "/logger":
      if (method === "GET") {
        res.write(`
        <h1  
        >Welcome to our Logger Application</h1> 
        `);
        logger.renderLoggerForm(res);
        res.end();
      } else if (method === "POST") {
        logger.processForm(req, res);
      }
      break;
    case "/contact-manager":
      contactManager.displayWelcomeScreen(res);
      contactManager.displayAddContact(res);
      contactManager.displayContacts(res);
      break;
    case "/contact-manager/add":
      if (method === "POST") {
        contactManager.addContact(req, res);
      }
      break;
    default:
      res.write(`
      <h1>404 page not found X_x</h1>  
      `);
      res.end();
      break;
  }
});

//log some output to see everything's ok
console.log(`Server is running on port: 
            ${PORT} so our API is alive =)
            `);

//start the server
server.listen(PORT);
