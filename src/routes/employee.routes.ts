import express from "express";
import { employeeController } from "../controllers/employee.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/employees",authMiddleware ,employeeController.gettAllEmployees);
router.post("/employees", employeeController.addEmployee);
router.patch("/employees/:id", employeeController.updateEmployee);
router.delete("/employees/:id", employeeController.deleteEmployee);

export default router;
