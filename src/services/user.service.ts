import { db } from "../config/db";
import { Role, User } from "../entity/user.entity";
import { AppError } from "../middlewares/errorMiddleware";
import bcrypt from "bcryptjs";

const userRepository = db.getRepository(User);

export const userService = {
  registerUser: async (email: string, password: string, role: Role, name: string) => {
    const user = await userRepository.findOneBy({ email });

    if (user) {
      throw new AppError("Email already exist", 409);
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User();
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.name = name
    newUser.role = role;

    return await userRepository.save(newUser);
  },
};
