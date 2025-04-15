import express = require('express');
import { Request, Response, RouterType } from 'express';
import cloudinary from '../config/cloudinary';
import { profileUpload } from '../config/cloudinary';
import multer from 'multer';
import path from 'path';

const router: RouterType = express.Router();

// Serve an HTML form for testing
router.get('/cloudinary-form', (req: Request, res: Response) => {
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
router.post('/cloudinary-test-upload', profileUpload.single('test_image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'No file uploaded' 
      });
    }
    
    res.json({ 
      status: 'success', 
      message: 'File uploaded successfully to Cloudinary',
      file: req.file 
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to upload to Cloudinary',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router; 