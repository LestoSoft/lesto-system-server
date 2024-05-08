import { connection } from "../db/connection";
import { RefreshTokenEntity } from "../db/types";
import moment from "moment";

type CreateToken = Pick<RefreshTokenEntity, "token" | "userId">;
const getRefreshTokenTable = () =>
  connection.table<RefreshTokenEntity>("refreshToken");

export async function addToken({ token, userId }: CreateToken) {
  const newToken: RefreshTokenEntity = {
    token,
    userId,
    createdAt: moment(new Date()).format("dd-MM-yyyy HH:mm"),
    expiresAt: moment(new Date()).format("dd-MM-yyyy HH:mm"),
  };
  try {
    await getRefreshTokenTable().insert(newToken);
    return newToken;
  } catch (error) {
    console.error("Error adding refresh token:", error);
    throw error;
  }
}

export async function getToken({ token }: { token: string }) {
  return await getRefreshTokenTable().first().where({ token });
}

export async function updateToken({
  oldToken,
  newToken,
}: {
  oldToken: string;
  newToken: string;
}) {
  return await getRefreshTokenTable()
    .where({ token: oldToken })
    .update({
      token: newToken,
      createdAt: moment(new Date()).format("dd-MM-yyyy HH:mm"),
      expiresAt: moment(new Date()).format("dd-MM-yyyy HH:mm"),
    });
}

export async function deleteToken({ token }: { token: string }) {
  return await getRefreshTokenTable().where({ token }).del();
}
