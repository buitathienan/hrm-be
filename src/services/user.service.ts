import { db } from "../config/db";
import { Role, User } from "../entity/user.entity";
import { AppError } from "../middlewares/errorMiddleware";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userRepository = db.getRepository(User);

export const userService = {
  registerUser: async (
    email: string,
    password: string,
    role: Role,
    name: string
  ) => {
    const user = await userRepository.findOneBy({ email });

    if (user) {
      throw new AppError("Email already exist", 409);
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User();
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.name = name;
    newUser.role = role;

    return await userRepository.save(newUser);
  },

  loginUser: async (email: string, password: string) => {
    const user = await userRepository.findOneBy({ email: email });
    if (!user) throw new AppError("User not found", 404);

    const checkPassword = bcrypt.compareSync(password, user.password);

    if (!checkPassword) {
      throw new AppError("Email or password is incorrect", 401);
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      createdDate: user.createdDate,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24 hours" });
  },
};
