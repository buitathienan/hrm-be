import { Request, Response } from "express";
import { employeeService } from "../services/employee.service";

export const employeeController = {
  gettAllEmployees: async (req: Request, res: Response) => {
    try {
      const employees = await employeeService.findAllEmployees();
      res.status(200).json({ success: true, data: employees });
    } catch (error) {
      res.status(500).json({ success: false, error: "Internal Server Error!" });
    }
  },
};
