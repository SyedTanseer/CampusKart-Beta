# Setting Up Cloudinary for CampusKart

This guide will help you set up Cloudinary integration with your CampusKart application to handle image uploads.

## Step 1: Create a Cloudinary Account

1. Go to [Cloudinary's website](https://cloudinary.com/) and sign up for a free account
2. After signing up, you'll have access to your dashboard with your account details

## Step 2: Get Your Cloudinary Credentials

From your Cloudinary dashboard, note down the following information:
- Cloud Name
- API Key
- API Secret

These will be needed for your environment variables.

## Step 3: Update Environment Variables

Add the following environment variables to your backend `.env` file:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Replace the placeholder values with your actual Cloudinary credentials.

## Step 4: Deploy Your Application

1. For Render deployment:
   - Go to your Render dashboard
   - Select your backend service
   - Navigate to the "Environment" tab
   - Add the Cloudinary environment variables
   - Redeploy your application

2. Update your frontend to use the Cloudinary integration:
   - No changes needed on the frontend if you're using the helper functions in `api.cloudinary.ts`

## Step 5: Test the Integration

1. Try uploading a new product with images
2. Check if profile picture uploads are working
3. Verify that images are being displayed correctly

## Troubleshooting

If you encounter issues:

1. Check your Cloudinary credentials in the environment variables
2. Make sure your Cloudinary account is active
3. Look for error messages in your application logs
4. Verify network requests in your browser's dev tools

## Cloudinary Folder Structure

The application uses the following folder structure in Cloudinary:
- `campuskart/products/` - For product images
- `campuskart/profiles/` - For user profile pictures

## Switching Between Local Storage and Cloudinary

To switch between local storage and Cloudinary:

1. In your backend, update `index.ts` to use either:
   - `product.ts` (local storage)
   - `product.cloudinary.ts` (Cloudinary storage)

2. Similarly for user routes, use either:
   - `user.ts` (local storage)
   - `user.cloudinary.ts` (Cloudinary storage)

## Benefits of Using Cloudinary

- Images persist across deployments
- Better performance with CDN delivery
- Automatic optimization for different devices
- Reduced load on your application server
- Easy image transformations (resize, crop, etc.) 