const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const categories = [
  { name: 'Textbooks', desc: 'Buy and sell used textbooks' },
  { name: 'Electronics', desc: 'Laptops, phones, and gadgets' },
  { name: 'Dorm Supplies', desc: 'Everything for your dorm room' },
  { name: 'Course Notes', desc: 'Study materials and notes' },
  { name: 'Bikes', desc: 'Campus transportation' },
  { name: 'Accessories', desc: 'Fashion and personal items' },
  { name: 'Furniture', desc: 'Dorm and apartment furniture' },
  { name: 'Clothing', desc: 'New and gently used clothing' },
  { name: 'Event Tickets', desc: 'Campus events and activities' }
];

const outputDir = path.join(__dirname, '../public/images/categories');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

categories.forEach(category => {
  const canvas = createCanvas(500, 500);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 500, 500);

  // Draw border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 500, 500);

  // Draw text
  ctx.fillStyle = '#1a202c';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(category.name, 250, 200);

  ctx.fillStyle = '#4a5568';
  ctx.font = '24px Arial';
  ctx.fillText(category.desc, 250, 250);

  // Save the image
  const buffer = canvas.toBuffer('image/jpeg');
  const filename = `${category.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  fs.writeFileSync(path.join(outputDir, filename), buffer);
});

console.log('Category images generated successfully!'); 