const fs = require('fs');
const xml = fs.readFileSync('_temp_content.xml', 'utf-8');

// match all text:p tags
const regex = /<text:p[^>]*>(.*?)<\/text:p>/g;
let match;
let lines = [];
while ((match = regex.exec(xml)) !== null) {
  // strip nested tags like <text:span>
  let clean = match[1].replace(/<[^>]*>/g, '').trim();
  if (clean) lines.push(clean);
}

fs.writeFileSync('_temp_pdf_text.txt', lines.join('\n'));
console.log('Extracted ' + lines.length + ' lines.');
