import { connection } from "../db/connection";
import { UserEntity } from "../db/types";
import { v4 } from "uuid";
import bcrypt from "bcrypt";

type CreateUser = Pick<
  UserEntity,
  "email" | "name" | "phone" | "password" | "username" | "admin"
>;

const getUserTable = () => connection.table<UserEntity>("user");
export async function getAllUsers() {
  return await getUserTable().select();
}

export async function getUser(id: string) {
  return await getUserTable().first().where({ id });
}

export async function getUserByEmail(email: string) {
  return await getUserTable().first().where({ email });
}
export async function addUser({
  email,
  name,
  phone,
  password,
  username,
  admin,
}: CreateUser) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user: UserEntity = {
    id: v4(),
    email,
    name,
    phone,
    password: hashedPassword,
    username,
    admin,
  };
  return await getUserTable().insert(user);
}
