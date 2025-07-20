import express from "express";
import cors from "cors";
import { db } from "./config/db";

const PORT = process.env.PORT;

db.initialize()
  .then(() => {
    console.log("Data source has been initialized");
  })
  .catch((err) => {
    console.error("Error during Datasource", err);
  });

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
