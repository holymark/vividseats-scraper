import  fs  from 'fs';
import  path  from 'path';

// Function to read a JSON file and return its content as an object
function readJsonFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

// Function to merge multiple JSON files into one
function mergeJsonFiles(inputDirectory, outputFilePath) {
  const files = fs.readdirSync(inputDirectory).filter(file => file.endsWith('.json'));
  
  let mergedData = [];

  files.forEach(file => {
    const filePath = path.join(inputDirectory, file);
    const data = readJsonFile(filePath);
    mergedData.push(data);
  });

  fs.writeFileSync(outputFilePath, JSON.stringify(mergedData, null, 2), 'utf-8');
  console.log(`Merged JSON data saved to ${outputFilePath}`);
}

// Define the input directory containing JSON files and the output file path
const inputDirectory = './storage/datasets/default'; // Change this to your input directory
const outputFilePath = './merged.json'; // Change this to your desired output file path

// Merge the JSON files
mergeJsonFiles(inputDirectory, outputFilePath);
