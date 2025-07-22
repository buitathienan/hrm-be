import express from "express";
import { employeeController } from "../controllers/employee.controller";

const router = express.Router();

router.get("/employees", employeeController.gettAllEmployees);


export default router