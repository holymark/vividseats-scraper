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
  // Create a directory name based on the URL
  // const folderName = url.replace(/https?:\/\//, '').replace(/[\/:?]/g, '_');
  // const folderPath = path.join(__dirname, 'scraped_data', folderName);
  const directoryPath = path.join(
    __dirname,
    "scraped_data",
    category,
    subcategory
  );

  await fs.mkdir(directoryPath, { recursive: true });
  const filePath = path.join(directoryPath, "data.json");
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));

  // Create the directory if it doesn't exist
  //     if (!fs.existsSync(folderPath)) {
  //         fs.mkdirSync(folderPath, { recursive: true });
  //     }

  //     // Save the data to a file within the directory
  //     const dataFilePath = path.join(folderPath, 'data.json');
  //     fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
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
