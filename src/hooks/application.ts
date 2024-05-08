import { connection } from "../db/connection";
import { fileUpload } from "../db/other/fileUpload";
import { AppEntity } from "../db/types";
import { v4 } from "uuid";

type CreateApp = Omit<AppEntity, "id" | "image">;
const getAppTable = () => connection.table<AppEntity>("application");

export async function getApps() {
  try {
    const apps = await getAppTable().select();
    return apps;
  } catch (error) {
    console.error("Error fetching application:", error);
    throw error;
  }
}

export async function addApp({
  name,
  port,
  proxy_pass,
  description,
  image,
}: CreateApp & { image: any }) {
  const newApp: AppEntity = {
    id: v4(),
    name,
    port,
    proxy_pass,
    description,
    image: image ? image.originalname : null,
  };
  try {
    if (image) {
      await fileUpload(name, image);
    }

    await getAppTable().insert(newApp);
    return name;
  } catch (error) {
    console.error("Error adding application:", error);
    throw error;
  }
}
