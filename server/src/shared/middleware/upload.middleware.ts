import multer from 'multer';
import {BadRequestException} from '../exceptions';
import {Request} from 'express';

/**
 * Gold Standard: File Upload Middleware
 * Configures Multer to handle multi-part/form-data.
 * We use memory storage to allow the StorageProvider to handle the final persistence.
 */
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Broad image/document filter - can be customized per-route
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Unsupported file type. Allowed: Images, PDF, DOCX.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});
