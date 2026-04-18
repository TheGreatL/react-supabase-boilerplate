import {Response} from 'express';
import httpStatus from 'http-status';
import {asyncHandler} from '../../shared/utils/async-handler';
import {ApiResponse} from '../../shared/utils/api-response';
import {BadRequestException} from '../../shared/exceptions';
import {getStorageProvider} from '../../shared/providers/storage.provider';
import {TAuthenticatedRequest} from '../../shared/types/auth.types';

/**
 * Gold Standard: Upload Controller
 * Handles file ingestion and storage provider interaction.
 */
export default class UploadController {
  private static storage = getStorageProvider();

  static uploadSingle = asyncHandler(async (req: TAuthenticatedRequest, res: Response) => {
    if (!req.file) {
      throw new BadRequestException('No file uploaded');
    }

    // Optional: Determine folder folder based on user ID or intent
    const folder = req.body.folder || 'general';
    const filePath = await UploadController.storage.upload(req.file, folder);

    // Get signed URL for the response (works locally and with buckets)
    const url = await UploadController.storage.getSignedUrl(filePath);

    return ApiResponse.success(
      res,
      {
        path: filePath,
        url,
        mimetype: req.file.mimetype,
        size: req.file.size
      },
      'File uploaded successfully',
      httpStatus.CREATED
    );
  });
}
