import  fs  from 'fs';
import  path  from 'path';

function readJsonFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

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

const inputDirectory = './storage/datasets/default';
const outputFilePath = './merged.json'; 

mergeJsonFiles(inputDirectory, outputFilePath);
