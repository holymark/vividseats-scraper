
import * as fs from 'fs';
import * as path from 'path';
import { DataItem } from "../types.js"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const customPushData = async (data: DataItem[], url: string) => {

    // Create a directory name based on the URL
    const folderName = url.replace(/https?:\/\//, '').replace(/[\/:?]/g, '_');
    const folderPath = path.join(__dirname, 'scraped_data', folderName);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    // Save the data to a file within the directory
    const dataFilePath = path.join(folderPath, 'data.json');
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

