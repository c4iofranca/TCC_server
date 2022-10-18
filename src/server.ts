import express from "express";
import pi from "./routes/pi";
import cors from "cors";

const app = express();
app.use(cors());

app.use(pi);

app.listen(3333);
