import { db } from "../config/db";
import { Employee } from "../entity/employee.entity";
import { AppError } from "../middlewares/errorMiddleware";

const employeeRepository = db.getRepository(Employee);

export const employeeService = {
  findAllEmployees: async (query?: { [key: string]: string | number }) => {
    const employees = await employeeRepository.find({
      order: { id: "ASC" },
      where: query ? query : null,
    });
    return employees;
  },
  findEmployeeById: async (id: number) => {
    const employee = await employeeRepository.findOneBy({ id });
    return employee;
  },
  addEmployee: async (employeeData: Employee) => {
    let newEmployee = new Employee();
    newEmployee = { ...employeeData };
    console.log("New employee data", newEmployee);

    await employeeRepository.save(newEmployee);

    return newEmployee;
  },
  updateEmployee: async (id: number, data: Partial<Employee>) => {
    const employee = await employeeRepository.update(id, data);
    return employee;
  },
  deleteEmployee: async (id: number) => {
    const employee = await employeeRepository.delete(id);
    return employee;
  },
};
