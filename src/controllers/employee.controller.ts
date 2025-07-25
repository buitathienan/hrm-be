import { NextFunction, Request, Response } from "express";
import { employeeService } from "../services/employee.service";
import { AppError } from "../middlewares/errorMiddleware";

export const employeeController = {
  gettAllEmployees: async (req: Request, res: Response) => {
    const employees = await employeeService.findAllEmployees(
      req.query as Record<string, any>
    );
    res.status(200).json({ status: "success", data: employees });
  },

  addEmployee: async (req: Request, res: Response) => {
    const newEmployee = await employeeService.addEmployee(req.body);
    res.status(201).json({ status: "success", data: newEmployee });
  },

  updateEmployee: async (req: Request, res: Response) => {
    const existingEmployee = await employeeService.findEmployeeById(
      +req.params.id
    );
    if (!existingEmployee) {
      throw new AppError("Employee not found", 404);
    }

    const result = await employeeService.updateEmployee(
      existingEmployee.id,
      req.body
    );
    res.status(200).json({ status: "success", data: result });
  },

  deleteEmployee: async (req: Request, res: Response) => {
    const existingEmployee = await employeeService.findEmployeeById(
      +req.params.id
    );
    if (!existingEmployee) {
      throw new AppError("Employee not found", 404);
    }

    const result = await employeeService.deleteEmployee(existingEmployee.id);
    res.status(200).json({ status: "success", data: result.affected });
  },
};
