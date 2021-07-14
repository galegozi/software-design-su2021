import express from 'express';
import auth from './auth';
import profile from './profile';

const router = express.Router();

router.use(auth);
router.use(profile);

export default router;
