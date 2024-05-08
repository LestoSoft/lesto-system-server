import express, { Request, Response } from "express";
import { addApp, getApps } from "../hooks/application";
import multer from "multer";

const upload = multer();
const appRouter = express.Router();

appRouter.post("/", upload.single("file"), async (req: any, res: Response) => {
  try {
    const { name, port, proxy_pass, description } = req.body;
    await addApp({
      name,
      port,
      proxy_pass,
      description,
      image: req.file,
    });

    res.status(201).json({ message: "Application added successfully" });
  } catch (error) {
    console.error("Error adding application:", error);
    res.status(500).json({ error: "Adding application failed!" });
  }
});

appRouter.get("/", async (req: Request, res: Response) => {
  try {
    const apps = await getApps();
    res.json(apps);
  } catch (error) {
    console.error("Error getting applications:", error);
    res.status(500).json({ error: "Failed to get applications" });
  }
});

export default appRouter;
