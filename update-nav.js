const fs = require('fs');
const path = require('path');

const getHtmlFiles = (dir) => {
  const files = fs.readdirSync(dir);
  return files.filter(file => file.endsWith('.html'));
};

const updateNavMenu = (filePath) => {
  try {
    console.log(`Processing: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const clickerRegex = /<a\s+(?:class="active"\s+)?href="clicker\.html">Clicker<\/a>/g;
    const setsRegex = /<a\s+(?:class="active"\s+)?href="collectSets\.html">Sets Checklist<\/a>/g;
    const compareRegex = /<a\s+(?:class="active"\s+)?href="collectCompare(?:\.html)?">Compare<\/a>/g;
    
    content = content.replace(clickerRegex, '');
    content = content.replace(setsRegex, '');
    content = content.replace(compareRegex, '');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}: ${error.message}`);
  }
};

const main = () => {
  const htmlFiles = getHtmlFiles('.');
  
  console.log('Found HTML files:', htmlFiles);
  
  htmlFiles.forEach(file => {
    const filePath = path.join('.', file);
    updateNavMenu(filePath);
  });
  
  console.log('All files updated successfully!');
};

main();
