const Datasource = require("./database/datasource")
const Server = require("./server")

async function startup()
{
    const ds = new Datasource()
    await ds.initialize()
    const server = new Server(ds)
    server.start()
}

startup()