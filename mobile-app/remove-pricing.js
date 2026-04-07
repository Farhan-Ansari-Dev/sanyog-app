const fs = require('fs');
const path = require('path');

// 1. Remove priceRange from types
const typesFile = path.join(__dirname, 'src/types/index.ts');
let typesContent = fs.readFileSync(typesFile, 'utf8');
typesContent = typesContent.replace(/\s*priceRange:\s*string;/, '');
fs.writeFileSync(typesFile, typesContent);

// 2. Remove priceRange from mockData
const mockFile = path.join(__dirname, 'src/services/mockData.ts');
let mockContent = fs.readFileSync(mockFile, 'utf8');
mockContent = mockContent.replace(/\s*priceRange:\s*'[^']+',/g, '');
fs.writeFileSync(mockFile, mockContent);

// 3. Remove price element from ServicesScreen
const servicesFile = path.join(__dirname, 'src/screens/services/ServicesScreen.tsx');
let servicesContent = fs.readFileSync(servicesFile, 'utf8');
servicesContent = servicesContent.replace(/<View style=\{\{\s*flexDirection:\s*'row',\s*alignItems:\s*'center'\s*\}\}>\s*<Ionicons name="pricetag-outline"[\s\S]*?<\/View>\s*<\/View>/, '</View>');
fs.writeFileSync(servicesFile, servicesContent);

// 4. Remove price element from ServiceGroupScreen
const serviceGroupFile = path.join(__dirname, 'src/screens/services/ServiceGroupScreen.tsx');
let sgContent = fs.readFileSync(serviceGroupFile, 'utf8');
sgContent = sgContent.replace(/\{cert\.processDuration\}\s*•\s*\{cert\.priceRange\}/g, '{cert.processDuration}');
fs.writeFileSync(serviceGroupFile, sgContent);

// 5. Remove price element from CertDetailScreen
const certDetailFile = path.join(__dirname, 'src/screens/services/CertDetailScreen.tsx');
let cdContent = fs.readFileSync(certDetailFile, 'utf8');
cdContent = cdContent.replace(/\s*\{\s*icon:\s*'pricetag-outline'\s*as\s*const,\s*label:\s*'Price Range',\s*value:\s*cert\.priceRange\s*\},/, '');
fs.writeFileSync(certDetailFile, cdContent);

console.log('Pricing removed successfully!');
