import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testCloudinaryConnection() {
  try {
    console.log('Cloudinary Configuration:');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key configured:', !!process.env.CLOUDINARY_API_KEY);
    console.log('API Secret configured:', !!process.env.CLOUDINARY_API_SECRET);
    
    // Test connection with ping
    console.log('\nTesting connection...');
    const pingResult = await cloudinary.api.ping();
    console.log('Connection successful!', pingResult);
    
    return true;
  } catch (error) {
    console.error('Cloudinary connection failed:', error);
    return false;
  }
}

async function testCloudinaryUpload() {
  try {
    // Create a test directory if it doesn't exist
    const testDir = path.join(__dirname, 'test-images');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    // Create a simple test image if it doesn't exist
    const testImagePath = path.join(testDir, 'test-image.png');
    if (!fs.existsSync(testImagePath)) {
      // Create a very simple 1x1 black PNG image
      const blackPixelPNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEBgIApD5fRAAAAABJRU5ErkJggg==', 'base64');
      fs.writeFileSync(testImagePath, blackPixelPNG);
    }
    
    console.log('\nUploading test image...');
    const result = await cloudinary.uploader.upload(testImagePath, {
      folder: 'campuskart/test',
      public_id: 'test-image-' + Date.now()
    });
    
    console.log('Upload successful!');
    console.log('Image URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
    return result;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    return null;
  }
}

// Run tests
async function runTests() {
  const connectionSuccess = await testCloudinaryConnection();
  
  if (connectionSuccess) {
    await testCloudinaryUpload();
  } else {
    console.log('\nSkipping upload test due to connection failure.');
  }
}

runTests().catch(console.error); 