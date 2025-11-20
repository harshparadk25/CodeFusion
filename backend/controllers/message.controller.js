import { validationResult } from 'express-validator';
import { assertProjectMember, getProjectMessages } from '../services/message.services.js';

export const getMessageController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { projectId } = req.params;
    const { before, limit } = req.query;

    await assertProjectMember({ projectId, userId: req.user.id || req.user._id });
    const result = await getProjectMessages({
      projectId,
      limit: parseInt(limit, 10) || 25,
      before,
    });

    return res.status(200).json(result);
  } catch (err) {
    const code = err.message.includes('Forbidden')
      ? 403
      : err.message.includes('not found')
      ? 404
      : 500;
    return res.status(code).json({ message: err.message });
  }
};
