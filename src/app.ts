import express from "express";
import cors from "cors";
import { handleLogin, refresh, verify, logout } from "./db/auth";
import userRouter from "./routes/userRoute";
import appRouter from "./routes/appRouter";
require("dotenv").config();

const app = express();
const port = 3000;
app.use(cors(), express.json());
app.get("/", (req, res) => res.send("working"));

app.post("/login", handleLogin);
app.post("/refresh", refresh);

//Verifying everything after login request. The rest of the code (including Router) should be verified. The requests above do not need verification.
app.use(verify);
app.post("/logout", logout);

app.get("/api", (req, res) => res.send("working"));

app.use("/user", userRouter);
app.use("/app", appRouter);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
