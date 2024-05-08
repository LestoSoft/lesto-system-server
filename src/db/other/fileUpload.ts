import fs from "fs";

export const fileUpload = async (app: string, resolvedFile: any) => {
  if (resolvedFile) {
    const { buffer, originalname } = resolvedFile;

    if (!fs.existsSync(`${process.env.SHARE}/${app}`)) {
      fs.mkdirSync(`${process.env.SHARE}/${app}`);
    }

    fs.writeFileSync(`${process.env.SHARE}/${app}/${originalname}`, buffer);
    return app;
  }
};
