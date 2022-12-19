/* Configure 'dotenv'. */
import "dotenv/config";

/* Declare constants. */
const HTTP_PORT: number = <number> (process.env["SERVER-PORT"] ?? 6368);
const IMAGE_DIRECTORY: string = <string> (process.env["IMAGE-DIRECTORY"] ?? `${process.cwd()}/images`);
const PASSWORD: string = <string> (process.env["UPLOAD-PASSWORD"] ?? "password");

/* Ensure directory is made. */
import {existsSync, mkdirSync, readdirSync, writeFileSync} from "fs";

if(!existsSync(IMAGE_DIRECTORY))
    mkdirSync(IMAGE_DIRECTORY);

/* Configure Express application. */
import express, {Express} from "express";

const app: Express = express();

/* Configure views. */
app.engine("html", require("ejs").renderFile);
app.set("views", `${__dirname}/../views`);
app.set("view engine", "html");

/* Configure middleware. */
import * as bodyParser from "body-parser";
app.use(bodyParser.json({limit: "50mb"}));

import fileUpload from "express-fileupload";
app.use(fileUpload());

app.use((req, res, next) => {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    next();
});

/* Configure routes. */
app.all('/', (req, res) => {
    const files: string[] = readdirSync(IMAGE_DIRECTORY);
    const file: string = files[Math.floor(Math.random() * files.length)];
    res.sendFile(`${IMAGE_DIRECTORY}/${file}`);
});

import {FileArray, UploadedFile} from "express-fileupload";
app.post('/upload', (req, res) => {
    if(!canUpload) {
        res.status(403).send("Uploading is disabled."); return;
    }

    const files: FileArray = req.files;
    const image: UploadedFile = <UploadedFile> files.file;

    if(!image) {
        res.status(400).send("No image provided."); return;
    }

    const path: string = `${IMAGE_DIRECTORY}/${image.name}`;
    writeFileSync(path, image.data);

    res.status(200).send({
        msg: "Uploaded successfully.",
        image: `https://arikatsu.lol/${image.name}`
    });
});

let canUpload: boolean = false;
app.get('/upload/:uploadPassword', (req, res) => {
    const password: string = req.params.uploadPassword;
    if(password !== PASSWORD) {
        res.status(403).send("Invalid password."); return;
    }

    res.render("upload");

    canUpload = true;
    setTimeout(() => canUpload = false, 1000 * 60);
});

app.all('/:image', (req, res) => {
    const image: string = req.params.image;
    const imagePath: string = `${IMAGE_DIRECTORY}/${image}`;
    if(!existsSync(imagePath)) {
        res.status(404).send("Image not found."); return;
    }

    res.sendFile(imagePath);
});

/* Configure HTTP. */
import {createServer, Server} from "http";

const httpServer: Server = createServer(app);
httpServer.listen(HTTP_PORT, () => console.log("Server started."));

/* Start API server. */
import "./api";