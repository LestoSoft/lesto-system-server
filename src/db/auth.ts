import { Request, Response, NextFunction } from "express";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "../hooks/users";
import bcrypt from "bcrypt";
import {
  addToken,
  deleteToken,
  getToken,
  updateToken,
} from "../hooks/refreshToken";

interface ClaimsInterface {
  sub: string;
  email: string;
  username: string;
}

interface AuthRequest extends Request {
  claims?: ClaimsInterface;
}

const secret = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");
const refreshSecret = Buffer.from("pRpAaRXZHbPI8lntnclN0Q==", "base64");

const generateRefreshToken = (claims: ClaimsInterface) => {
  return jwt.sign(claims, refreshSecret);
};

export async function handleLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json("Invalid credentials!");
    }

    const claims: ClaimsInterface = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    const accessToken = jwt.sign(claims, secret, {
      expiresIn: "8h",
    });
    const refreshToken = generateRefreshToken(claims);
    await addToken({ token: refreshToken, userId: user.id });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  //take refresh token from the user
  const refreshToken = req.body.token;
  //send error if no token or not valid
  if (!refreshToken) {
    return res.status(401).json("You are not authenticated!");
  }
  const storedToken = await getToken({ token: refreshToken });
  if (!storedToken) {
    return res.status(403).json("Your refresh token is not valid!");
  }

  //if OK, create access and refresh tokens and send them to user
  jwt.verify(
    refreshToken,
    refreshSecret,
    async (err, claims: ClaimsInterface) => {
      const { sub, email, username } = claims;

      if (err) {
        return res.status(403).json("Refresh token is not valid!");
      }
      const newAccessToken = jwt.sign({ sub, email, username }, secret, {
        expiresIn: "8h",
      });

      const newRefreshToken = generateRefreshToken({ sub, email, username });

      await updateToken({ oldToken: refreshToken, newToken: newRefreshToken });
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    }
  );
}

export async function logout(req: Request, res: Response) {
  const refreshToken = req.body.token;
  await deleteToken({ token: refreshToken });
  res.status(200).json("You logged out successfully.");
}

export async function verify(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const accessToken = authHeader.split(" ")[1];
    jwt.verify(accessToken, secret, (err, claims: ClaimsInterface) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      req.claims = claims;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
}
