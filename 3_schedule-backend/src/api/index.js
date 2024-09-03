import express from 'express';
import { authRouter } from './auth.js';
import { dataRouter } from '../../1_data.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/data', dataRouter);

export { router as apiRouter };
