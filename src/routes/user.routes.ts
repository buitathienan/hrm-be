import express from "express";
import { userController } from "../controllers/user.controller";

const router = express.Router();

router.post("/users", userController.registerUser);
// router.post("/employees", employeeController.addEmployee);
// router.patch("/employees/:id", employeeController.updateEmployee);
// router.delete("/employees/:id", employeeController.deleteEmployee);

export default router;
