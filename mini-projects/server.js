//import http module for our server
const http = require("http");

//define port for our server to listen to
const PORT = process.env.port || 5000;

//create server
const server = http.createServer((req, res) => {
  //define url
  const url = req.url;

  switch (url) {
    case "/":
      //write client response
      res.write(`
    <h1>Welcome to our nodeJS Server</h1> 
    `);
      //send client response
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
