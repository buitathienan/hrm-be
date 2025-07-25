import express from "express";
import { userController } from "../controllers/user.controller";

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
// router.post("/employees", employeeController.addEmployee);
// router.patch("/employees/:id", employeeController.updateEmployee);
// router.delete("/employees/:id", employeeController.deleteEmployee);

export default router;
