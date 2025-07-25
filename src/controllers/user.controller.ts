import { Request, Response } from "express";
import { userService } from "../services/user.service";

export const userController = {
    registerUser: async (req: Request, res: Response) => {
        await userService.registerUser(req.body.email, req.body.password, req.body.role, req.body.name)
        res.status(200).json({message: "User registered successfully", status: "success"})
    },

    loginUser: async (req: Request, res: Response) => {
        const token = await userService.loginUser(req.body.email, req.body.password)
        res.json({token: token})
    }
}