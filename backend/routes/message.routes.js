import { Router } from 'express';
import { getMessageController } from '../controllers/message.controller.js';
import { param, query } from 'express-validator';
import { authUser } from '../middlewear/auth.middlewear.js';

const router = Router();

router.get(
  '/:projectId',
  authUser,
  param('projectId').isString().withMessage('Project ID must be a string'),
  query('before').optional().isISO8601().withMessage('Before must be a valid date'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  getMessageController
);



export default router;
