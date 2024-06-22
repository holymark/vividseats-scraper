import { promises as fs } from 'fs';
import path from 'path';

const directoryPath = './storage/datasets/default'; // Change to your directory path

async function createDirectoriesAndMergeJson(directoryPath) {
    try {
        // Read all files in the directory
        const files = await fs.readdir(directoryPath);

        // Filter JSON files
        const jsonFiles = files.filter(file => path.extname(file) === '.json');

        const subcategoryData = {};

        for (const file of jsonFiles) {
            const filePath = path.join(directoryPath, file);

            // Read and parse JSON file
            const data = await fs.readFile(filePath, 'utf8');
            const jsonData = JSON.parse(data);

            // Get _category and _subcategory
            const category = jsonData._category;
            const subcategory = jsonData._subcategory;

            if (category && subcategory) {
                // Store data for each subcategory
                if (!subcategoryData[category]) {
                    subcategoryData[category] = {};
                }
                if (!subcategoryData[category][subcategory]) {
                    subcategoryData[category][subcategory] = [];
                }
                subcategoryData[category][subcategory].push(jsonData);
            } else {
                console.log(`Missing _category or _subcategory in file: ${file}`);
            }
        }

        for (const category of Object.keys(subcategoryData)) {
            const categoryDir = path.join(directoryPath, category);
            
            // Ensure category directory exists
            await fs.mkdir(categoryDir, { recursive: true });

            for (const subcategory of Object.keys(subcategoryData[category])) {
                const subcategoryDir = path.join(categoryDir, subcategory);
                
                // Ensure subcategory directory exists
                await fs.mkdir(subcategoryDir, { recursive: true });

                // Merge and write the JSON files for this subcategory
                const mergedData = subcategoryData[category][subcategory];
                const outputFilePath = path.join(subcategoryDir, 'merged.json');
                await fs.writeFile(outputFilePath, JSON.stringify(mergedData, null, 2));
                console.log(`Created file: ${outputFilePath}`);
            }
        }
    } catch (err) {
        console.error('Error processing files:', err);
    }
}

createDirectoriesAndMergeJson(directoryPath);
