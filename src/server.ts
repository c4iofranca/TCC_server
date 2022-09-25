import express from "express";
import pi from "./routes/pi";

const app = express();

app.use(pi);

app.listen(3333);
