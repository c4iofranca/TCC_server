import express from "express";
import cors from "cors";
import dataset from "./routes/dataset";

const app = express();
app.use(cors());

app.use(dataset);

app.listen(3333);
