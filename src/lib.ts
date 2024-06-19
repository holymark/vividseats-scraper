import * as fs from "fs/promises";
import * as path from "path";
import { DataItem } from "../types.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const customPushData = async (
  data: DataItem[],
  category: string,
  subcategory: string
) => {
  const directoryPath = path.join(
    __dirname,
    "scraped_data",
    category,
    subcategory
  );

  console.log({ path: directoryPath });
  await fs.mkdir(directoryPath, { recursive: true });
  const filePath = path.join(directoryPath, "data.json");
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

export const flattenURLs = (
  categoryObj: any
): { url: string; subcategory: string }[] => {
  const urls: { url: string; subcategory: string }[] = [];
  const extractURLs = (value: any, subcategory: string) => {
    if (typeof value === "string") {
      urls.push({ url: value, subcategory });
    } else if (Array.isArray(value)) {
      value.forEach((url) => extractURLs(url, subcategory));
    } else if (typeof value === "object") {
      Object.entries(value).forEach(([key, val]) => extractURLs(val, key));
    }
  };
  Object.entries(categoryObj).forEach(([key, val]) => extractURLs(val, key));
  return urls;
};
