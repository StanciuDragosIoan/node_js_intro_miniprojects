var static = require('node-static');
 
//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./public');
 
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
         
           
        file.serve(request, response);
        if(request.url === "/test"){
            response.end("test");
        }
        
        
            //file.serve(request, response);
           
        
    }).resume();
}).listen(8080);