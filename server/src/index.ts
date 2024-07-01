import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import financialRecordRouter from "./routes/financial-records";



const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());


const mongoURI: string =
  "mongodb+srv://heyanish2860:a0gkG6EBQ74bW141@cluster0.afkgwzi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURI)
  .then(() => console.log("CONNECTED TO MONGODB!"))
  .catch((err) => console.error("Failed to Connect to MongoDB:", err));

  app.use("/financial-records", financialRecordRouter);


app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});