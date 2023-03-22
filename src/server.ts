import express from "express";
import cors from "cors";
import dataset from "./routes/dataset";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json())

app.use(dataset);

app.listen(3333);
