import { Router } from 'express';
import { authUser } from '../middlewear/auth.middlewear.js';
import { upload } from '../middlewear/upload.middleware.js';
import * as repo from '../controllers/repo.controller.js';
import { param, body } from 'express-validator';

const router = Router();


router.post(
  '/:projectId/files/upload',
  authUser,
  param('projectId').isMongoId().withMessage('Invalid project ID'),
  upload.array('files', 20),
  body('path').optional().isString().withMessage('Path must be a string'),
  body('message').optional().isString().withMessage('Message must be a string'),
  repo.uploadFileController
);


router.post(
  '/:projectId/files',
  authUser,
  param('projectId').isMongoId().withMessage('Invalid project ID'),
  body('filename').isString().withMessage('filename is required'),
  body('content').optional().isString(),
  body('path').optional().isString(),
  body('message').optional().isString(),
  repo.createTextFileController
);


router.put(
  '/:projectId/files/:fileId',
  authUser,
  param('projectId').isMongoId(),
  param('fileId').isMongoId(),
  body('content').isString().withMessage('Content is required'),
  body('message').optional().isString(),
  repo.updateTextFileController
);


router.delete(
  '/:projectId/files/:fileId',
  authUser,
  param('projectId').isMongoId(),
  param('fileId').isMongoId(),
  body('message').optional().isString(),
  repo.deleteFileController
);


router.get(
  '/:projectId/files',
  authUser,
  param('projectId').isMongoId(),
  repo.listFilesController
);


router.get(
  '/:projectId/files/:fileId/download',
  authUser,
  param('projectId').isMongoId(),
  param('fileId').isMongoId(),
  repo.downloadFileController
);


router.get(
  '/:projectId/files/:fileId/content',
  authUser,
  param('fileId').isMongoId(),
  repo.getFileContentController
);


router.get(
  '/:projectId/commits',
  authUser,
  param('projectId').isMongoId(),
  repo.listCommitsController
);

export default router;
