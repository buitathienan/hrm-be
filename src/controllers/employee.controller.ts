import { NextFunction, Request, Response } from "express";
import { employeeService } from "../services/employee.service";

export const employeeController = {
  gettAllEmployees: async (req: Request, res: Response) => {
    const employees = await employeeService.findAllEmployees(
      req.query as Record<string, any>
    );
    res.status(200).json({ status: "success", data: employees });
  },
  addEmployee: async (req: Request, res: Response) => {
    const newEmployee = await employeeService.addEmployee(req.body);
    res.status(200).json({ status: "success", data: newEmployee });
  },
};
