import { db } from "../config/db"
import { Employee } from "../entity/employee.entity"

const userRepository = db.getRepository(Employee)

export const employeeService = {
    findAllEmployees: async () => {
        const employees = await userRepository.find()
        return employees
    }
}