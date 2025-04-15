# Implementing Cloudinary in CampusKart

Follow these steps to implement Cloudinary in your CampusKart application.

## Step 1: Install Dependencies

First, install the required dependencies in your backend:

```bash
cd backend
npm install cloudinary multer-storage-cloudinary
```

## Step 2: Rename and Update Files

1. Update your main application file:
   ```bash
   # Copy the existing index.cloudinary.ts file to replace index.ts
   cp src/index.cloudinary.ts src/index.ts
   ```

2. Update your product routes:
   ```bash
   # Copy the Cloudinary-enabled product routes to replace the original
   cp src/routes/product.cloudinary.ts src/routes/product.ts
   ```

3. Update your user routes:
   ```bash
   # Copy the Cloudinary-enabled user routes to replace the original
   cp src/routes/user.cloudinary.ts src/routes/user.ts
   ```

4. Update your frontend API utilities:
   ```bash
   # In the frontend directory
   cd ../src
   cp lib/api.cloudinary.ts lib/api.ts
   ```

## Step 3: Set Environment Variables

Create or update your `.env` file in the backend directory:

```
# Add these to your existing .env file
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Step 4: Update Frontend Components (If Needed)

You may need to update any frontend components that handle images directly. The main components to check are:

1. ProductCard.tsx
2. ProductDetail.tsx
3. ProfilePage.tsx

Make sure they use the `getImageUrl` helper function from the API library:

```tsx
import { getImageUrl } from '@/lib/api';

// Then in your component
<img src={getImageUrl(product.image)} alt={product.name} />
```

## Step 5: Test Locally

Test your implementation locally before deploying:

```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd ..
npm run dev
```

Test the following functionalities:
- Product image uploads
- Profile picture uploads
- Image display on product cards and details
- Image display on profiles

## Step 6: Deploy to Render

1. Push your changes to your repository:
   ```bash
   git add .
   git commit -m "Implement Cloudinary for image storage"
   git push
   ```

2. Add environment variables to your Render deployment:
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET

3. Deploy your updated application

## Step 7: Verify Production Deployment

After deployment, verify that:
- New images are being stored in Cloudinary
- Existing images still display correctly (they may still use the old path)
- You can view the uploaded images in your Cloudinary dashboard

## Notes

- The old image paths will still exist in your database. If you want to migrate all existing images to Cloudinary, you'll need to write a migration script.
- Images uploaded through Cloudinary will have URLs that include "cloudinary.com" in them.
- For more advanced Cloudinary features, refer to the [Cloudinary documentation](https://cloudinary.com/documentation).

## Troubleshooting

If you encounter issues:
1. Check your Cloudinary credentials
2. Check your backend logs for any errors
3. Ensure the Cloudinary config file is properly set up
4. Make sure your frontend is correctly handling the Cloudinary URLs

For additional help, refer to the [Cloudinary support resources](https://support.cloudinary.com/). 