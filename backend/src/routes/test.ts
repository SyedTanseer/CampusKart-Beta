import express = require('express');
import { Request, Response, RouterType } from 'express';
import cloudinary from '../config/cloudinary';
import { profileUpload } from '../config/cloudinary';
import multer from 'multer';
import path from 'path';
import User from '../models/User';
import { authenticateToken } from '../middleware/auth';

const router: RouterType = express.Router();

// Serve an HTML form for testing
router.get('/cloudinary-form', (req: Request, res: Response) => {
  // Get the current host and protocol
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  
  const htmlForm = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cloudinary Upload Test</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        button { padding: 10px 15px; background: #4CAF50; color: white; border: none; cursor: pointer; }
        .results { margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px; }
        pre { overflow-x: auto; }
      </style>
    </head>
    <body>
      <h1>Cloudinary Upload Test</h1>
      <p>Testing from: ${baseUrl}</p>
      
      <div class="form-group">
        <button id="testConnection">Test Cloudinary Connection</button>
      </div>
      
      <form id="uploadForm">
        <div class="form-group">
          <label for="imageFile">Select Image:</label>
          <input type="file" id="imageFile" name="test_image" accept="image/*" required>
        </div>
        <button type="submit">Upload to Cloudinary</button>
      </form>
      
      <div class="results" id="results">
        <h2>Results:</h2>
        <pre id="resultContent">No results yet</pre>
      </div>
      
      <script>
        document.getElementById('testConnection').addEventListener('click', async () => {
          try {
            // Using relative URL to avoid CORS issues
            const response = await fetch('/api/test/cloudinary-status');
            const data = await response.json();
            document.getElementById('resultContent').textContent = JSON.stringify(data, null, 2);
          } catch (error) {
            document.getElementById('resultContent').textContent = 'Error: ' + error.message;
          }
        });
        
        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData();
          const fileInput = document.getElementById('imageFile');
          if (fileInput.files.length > 0) {
            formData.append('test_image', fileInput.files[0]);
            
            try {
              // Using relative URL to avoid CORS issues
              const response = await fetch('/api/test/cloudinary-test-upload', {
                method: 'POST',
                body: formData
              });
              const data = await response.json();
              document.getElementById('resultContent').textContent = JSON.stringify(data, null, 2);
            } catch (error) {
              document.getElementById('resultContent').textContent = 'Error: ' + error.message;
            }
          }
        });
      </script>
    </body>
    </html>
  `;
  
  res.send(htmlForm);
});

// Test Cloudinary configuration
router.get('/cloudinary-status', async (req: Request, res: Response) => {
  try {
    // Simple ping to Cloudinary to check connection
    const result = await cloudinary.api.ping();
    res.json({ 
      status: 'success', 
      message: 'Cloudinary connection successful',
      result,
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        // Redact sensitive information
        api_key_configured: !!process.env.CLOUDINARY_API_KEY,
        api_secret_configured: !!process.env.CLOUDINARY_API_SECRET
      }
    });
  } catch (error) {
    console.error('Cloudinary connection error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to connect to Cloudinary',
      error: error instanceof Error ? error.message : String(error),
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        // Redact sensitive information
        api_key_configured: !!process.env.CLOUDINARY_API_KEY,
        api_secret_configured: !!process.env.CLOUDINARY_API_SECRET
      }
    });
  }
});

// Test Cloudinary upload with a simple placeholder image
router.post('/cloudinary-test-upload', async (req: Request, res: Response) => {
  try {
    console.log('Received upload request');
    
    // Use single multer upload with error handling
    profileUpload.single('test_image')(req, res, async (err) => {
      if (err) {
        console.error('Multer/Cloudinary error:', err);
        return res.status(400).json({ 
          status: 'error', 
          message: 'File upload failed in multer middleware',
          error: err instanceof Error ? err.message : String(err)
        });
      }
      
      // Check if file was uploaded
      if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).json({ 
          status: 'error', 
          message: 'No file uploaded' 
        });
      }
      
      console.log('File uploaded successfully via multer:', req.file);
      
      // Try manual upload as fallback
      try {
        // Get a unique filename
        const uniqueFilename = `test-direct-${Date.now()}`;
        
        // Try direct Cloudinary upload if multer-storage-cloudinary failed
        const manualUploadResult = await cloudinary.uploader.upload(
          (req.file as Express.Multer.File).path,
          { 
            folder: 'campuskart/test',
            public_id: uniqueFilename,
            resource_type: 'auto'
          }
        );
        
        console.log('Manual upload successful:', manualUploadResult);
        
        res.json({ 
          status: 'success', 
          message: 'File uploaded successfully to Cloudinary',
          file: req.file,
          cloudinary: manualUploadResult
        });
      } catch (directUploadError) {
        console.error('Direct Cloudinary upload failed:', directUploadError);
        return res.status(500).json({ 
          status: 'error', 
          message: 'Direct Cloudinary upload failed',
          error: directUploadError instanceof Error ? directUploadError.message : String(directUploadError),
          cloudinaryConfig: {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key_configured: !!process.env.CLOUDINARY_API_KEY,
            api_secret_configured: !!process.env.CLOUDINARY_API_SECRET
          }
        });
      }
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to upload to Cloudinary',
      error: error instanceof Error ? error.message : String(error),
      cloudinaryConfig: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key_configured: !!process.env.CLOUDINARY_API_KEY,
        api_secret_configured: !!process.env.CLOUDINARY_API_SECRET
      }
    });
  }
});

// Serve a simple HTML form for testing direct Cloudinary uploads
router.get('/cloudinary-direct', (req: Request, res: Response) => {
  // Get the current host and protocol
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  
  const htmlForm = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Direct Cloudinary Upload Test</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        button { padding: 10px 15px; background: #4CAF50; color: white; border: none; cursor: pointer; }
        .results { margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px; }
        pre { overflow-x: auto; }
      </style>
      <!-- Include Cloudinary SDK -->
      <script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript"></script>
    </head>
    <body>
      <h1>Direct Cloudinary Upload Test</h1>
      <p>Testing from: ${baseUrl}</p>
      
      <div class="form-group">
        <button id="testConnection">Test Cloudinary Connection</button>
      </div>
      
      <div class="form-group">
        <button id="upload_widget" class="cloudinary-button">Upload files</button>
      </div>
      
      <div class="results" id="results">
        <h2>Results:</h2>
        <pre id="resultContent">No results yet</pre>
      </div>
      
      <script>
        // First test connection
        document.getElementById('testConnection').addEventListener('click', async () => {
          try {
            // Using relative URL to avoid CORS issues
            const response = await fetch('/api/test/cloudinary-status');
            const data = await response.json();
            document.getElementById('resultContent').textContent = JSON.stringify(data, null, 2);
          } catch (error) {
            document.getElementById('resultContent').textContent = 'Error: ' + error.message;
          }
        });
        
        // Direct Cloudinary Widget Upload
        var myWidget = cloudinary.createUploadWidget({
          cloudName: '${process.env.CLOUDINARY_CLOUD_NAME}', 
          uploadPreset: 'campuskart',
          folder: 'campuskart/test',
          sources: ['local', 'camera'],
          multiple: false
        }, (error, result) => { 
          if (!error && result && result.event === "success") { 
            console.log('Done! Here is the image info: ', result.info); 
            document.getElementById('resultContent').textContent = JSON.stringify(result.info, null, 2);
          }
          
          if (error) {
            console.error('Widget error:', error);
            document.getElementById('resultContent').textContent = 'Error: ' + JSON.stringify(error, null, 2);
          }
        });
        
        document.getElementById("upload_widget").addEventListener("click", function(){
          myWidget.open();
        }, false);
      </script>
    </body>
    </html>
  `;
  
  res.send(htmlForm);
});

// Create an upload preset programmatically
router.get('/create-upload-preset', async (req: Request, res: Response) => {
  try {
    console.log('Attempting to create upload preset');
    
    // Check if preset already exists
    try {
      const existingPresets = await cloudinary.api.upload_presets();
      const campuskartPreset = existingPresets.find(preset => preset.name === 'campuskart');
      
      if (campuskartPreset) {
        return res.json({
          status: 'success',
          message: 'Upload preset already exists',
          preset: campuskartPreset
        });
      }
    } catch (error) {
      console.error('Error checking for existing presets:', error);
    }
    
    // Create the upload preset if it doesn't exist
    const preset = await cloudinary.api.create_upload_preset({
      name: 'campuskart',
      unsigned: true,
      folder: 'campuskart',
      allowed_formats: 'jpg,jpeg,png,gif'
    });
    
    res.json({
      status: 'success',
      message: 'Created upload preset successfully',
      preset
    });
  } catch (error) {
    console.error('Error creating upload preset:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create upload preset',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Test a simple upload with the preset
router.get('/test-preset-upload', (req: Request, res: Response) => {
  // Get the current host and protocol
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  
  const htmlForm = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test Preset Upload</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        button { padding: 10px 15px; background: #4CAF50; color: white; border: none; cursor: pointer; }
        .results { margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px; }
        pre { overflow-x: auto; }
      </style>
    </head>
    <body>
      <h1>Test Preset Upload</h1>
      <p>Testing from: ${baseUrl}</p>
      
      <div class="form-group">
        <button id="createPreset">1. Create Preset</button>
      </div>
      
      <form id="uploadForm">
        <div class="form-group">
          <label for="imageFile">2. Select Image:</label>
          <input type="file" id="imageFile" accept="image/*" required>
        </div>
        <button type="submit">3. Upload with Preset</button>
      </form>
      
      <div class="results" id="results">
        <h2>Results:</h2>
        <pre id="resultContent">No results yet</pre>
      </div>
      
      <script>
        document.getElementById('createPreset').addEventListener('click', async () => {
          try {
            // Create the preset if it doesn't exist
            const response = await fetch('/api/test/create-upload-preset');
            const data = await response.json();
            document.getElementById('resultContent').textContent = JSON.stringify(data, null, 2);
          } catch (error) {
            document.getElementById('resultContent').textContent = 'Error: ' + error.message;
          }
        });
        
        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const fileInput = document.getElementById('imageFile');
          if (fileInput.files.length > 0) {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            formData.append('upload_preset', 'campuskart');
            formData.append('cloud_name', '${process.env.CLOUDINARY_CLOUD_NAME}');
            
            try {
              // Direct upload to Cloudinary API
              const response = await fetch('https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload', {
                method: 'POST',
                body: formData
              });
              const data = await response.json();
              document.getElementById('resultContent').textContent = JSON.stringify(data, null, 2);
            } catch (error) {
              document.getElementById('resultContent').textContent = 'Error: ' + error.message;
            }
          }
        });
      </script>
    </body>
    </html>
  `;
  
  res.send(htmlForm);
});

// Test migration of profile pictures to Cloudinary
router.post('/migrate-profile-pictures', authenticateToken, async (req: Request, res: Response) => {
  try {
    // Only allow admins and developers to perform this operation
    if (!req.user || (req.user.user_type !== 'admin' && req.user.user_type !== 'developer')) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Only admins and developers can perform this operation' 
      });
    }

    const { userId } = req.body;
    
    // If a specific user ID is provided, only migrate that user
    let query = userId ? { _id: userId } : {};
    
    // Find users with profile pictures that aren't from Cloudinary
    const users = await User.find({
      ...query,
      profile_picture: { $exists: true, $ne: null },
      $expr: {
        $not: {
          $regexMatch: {
            input: "$profile_picture",
            regex: "cloudinary.com"
          }
        }
      }
    });

    console.log(`Found ${users.length} users with non-Cloudinary profile pictures`);

    // Track migration results
    const results = {
      total: users.length,
      success: 0,
      failed: 0,
      skipped: 0,
      users: [] as any[]
    };

    // Process each user
    for (const user of users) {
      try {
        // Skip if no profile picture
        if (!user.profile_picture) {
          results.skipped++;
          results.users.push({
            userId: user._id,
            status: 'skipped',
            reason: 'No profile picture'
          });
          continue;
        }

        // Skip if already a Cloudinary URL
        if (user.profile_picture.includes('cloudinary.com')) {
          results.skipped++;
          results.users.push({
            userId: user._id,
            status: 'skipped',
            reason: 'Already a Cloudinary URL'
          });
          continue;
        }

        // Get the full URL to the profile picture
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? 'https://campuskart-backend-qw5z.onrender.com'
          : 'http://localhost:5000';
        
        // Normalize the path (replace Windows backslashes)
        const normalizedPath = user.profile_picture.replace(/\\/g, '/');
        
        // Create the full URL
        const fullPath = normalizedPath.startsWith('/') 
          ? `${baseUrl}${normalizedPath}`
          : `${baseUrl}/${normalizedPath}`;
        
        console.log(`Uploading from URL: ${fullPath} for user ${user._id}`);

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(fullPath, {
          folder: 'campuskart/profiles',
          overwrite: true,
          resource_type: 'image'
        });

        console.log(`Uploaded to Cloudinary: ${uploadResult.secure_url}`);

        // Update the user with the new Cloudinary URL
        await User.updateOne(
          { _id: user._id },
          { $set: { profile_picture: uploadResult.secure_url } }
        );

        results.success++;
        results.users.push({
          userId: user._id,
          status: 'success',
          oldUrl: user.profile_picture,
          newUrl: uploadResult.secure_url
        });
      } catch (err) {
        console.error(`Error migrating profile picture for user ${user._id}:`, err);
        results.failed++;
        results.users.push({
          userId: user._id,
          status: 'failed',
          error: err instanceof Error ? err.message : String(err)
        });
      }
    }

    res.json({
      status: 'success',
      message: 'Profile picture migration completed',
      results
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to migrate profile pictures',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router; 