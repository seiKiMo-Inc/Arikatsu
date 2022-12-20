/* Declare constants. */
const HTTP_PORT: number = <number> (process.env["API-PORT"] ?? 6369);

import cors from "cors";

/* Configure Express application. */
import express, {Express} from "express";

const app: Express = express();
app.use(cors({ origin: true, credentials: true }));

/* Configure routes. */
app.get('/kimi', async (req, res) => {
    const response = await fetch("https://reddit.com/r/HuTaoNSFW/random.json", {
        redirect: "follow"
    });

    const json = await response.json();
    res.status(200).send(json);
});

app.get('/org', async (req, res) => {
    const response = await fetch("https://api.github.com/orgs/seiKiMo-Inc/members", {
        redirect: "follow", headers: { Authorization: `Bearer ${process.env["GH"]}` }
    });
    
    const json = await response.json();
    res.status(200).send(json);
});

/* Configure HTTP. */
import {createServer, Server} from "http";

const httpServer: Server = createServer(app);
httpServer.listen(HTTP_PORT, () => console.log("Server started."));
