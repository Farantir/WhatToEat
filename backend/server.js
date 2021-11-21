const cfg = require('./config');
const express = require('express');
const Datasource = require('./datasource');

/**
 * @class Server
 * @description server instance for interacting with the database
 */
class Server {
    /**
     * creates a new server instance
     * @param {Datasource} ds 
     */
    constructor(ds) 
    { 
        this.ds = ds;
    }

    /**
     * starts the server
     */
    start()
    {
        const app = express();

        app.use(express.json());
        
        app.post('/', function(request, response){
          console.log(request.body);      // your JSON
           response.send(request.body);    // echo the result back
        });
        
        app.listen(cfg.server.port);
    }
}
