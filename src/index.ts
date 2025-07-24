import express from "express";
import cors from "cors";
import { db } from "./config/db";
import employeeRouters from "./routes/employee.routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import userRouter from "./routes/user.routes";

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

// Routing
app.get("/", (req, res) => {
  res.send("Welcome to hrm API");
});
app.use("/api/v1/", employeeRouters);
app.use("/api/v1/", userRouter);

//Error middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
