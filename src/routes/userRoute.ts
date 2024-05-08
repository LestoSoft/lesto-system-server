import express, { Request, Response } from "express";
import { addUser, getAllUsers } from "../hooks/users";
import { verify } from "../db/auth";

const userRouter = express.Router();

userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error getting applications:", error);
    res.status(500).json({ error: "Failed to get applications" });
  }
});

userRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { email, name, phone, password, username, admin } = req.body;
    await addUser({ email, name, phone, password, username, admin });
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
});

export default userRouter;
