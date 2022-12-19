/* Declare constants. */
const HTTP_PORT: number = <number> (process.env["API-PORT"] ?? 6369);

/* Configure Express application. */
import express, {Express} from "express";

const app: Express = express();

/* Configure routes. */
app.get('/kimi', async (req, res) => {
    const response = await fetch("https://reddit.com/r/HuTaoNSFW/random.json", {
        redirect: "follow"
    });

    const json = await response.json();
    res.status(200).send(json);
});

/* Configure HTTP. */
import {createServer, Server} from "http";

const httpServer: Server = createServer(app);
httpServer.listen(HTTP_PORT, () => console.log("Server started."));