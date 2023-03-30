import express from "express";
import cors from "cors";
import dataset from "./routes/dataset";
import bodyParser from "body-parser";
import predict from "./routes/predict";

const app = express();
app.use(cors());
app.use(bodyParser.json())

app.use(dataset);
app.use(predict);

app.listen(3333);
