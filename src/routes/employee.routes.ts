import express from "express";
import { employeeController } from "../controllers/employee.controller";

const router = express.Router();

router.get("/employees", employeeController.gettAllEmployees);
router.post("/employees", employeeController.addEmployee);
router.patch("/employees/:id", employeeController.updateEmployee);
router.delete("/employees/:id", employeeController.deleteEmployee);

export default router;
