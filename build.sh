#!/bin/bash
set -e
# Install type definitions explicitly
npm install --save-dev @types/express@latest @types/multer@latest @types/jsonwebtoken@latest @types/bcryptjs@latest

# Build the project
npm run compile

# Show success message
echo "Build completed successfully!"
