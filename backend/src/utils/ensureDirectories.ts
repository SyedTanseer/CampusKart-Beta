import fs from 'fs';
import path from 'path';

/**
 * Ensures that necessary directories exist for the application
 */
export const ensureDirectoriesExist = (): void => {
  if (process.env.NODE_ENV !== 'production') {
    const directories = [
      path.join(__dirname, '../../uploads'),
      path.join(__dirname, '../../uploads/profiles'),
      path.join(__dirname, '../../uploads/products')
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });
  }
};

export default ensureDirectoriesExist; 