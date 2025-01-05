import { Router } from 'express';

import * as registerController from '../controllers/register.controller';

const router = Router()

router.post('/register', registerController.register);

router.get('/', (req, res) => {
    res.json({ message: 'AAAAAAAAAAAAAAAAAAAAA' });
  });


// router.post('/login', registerController.login);

// router.post('/logout', registerController.logout)

export default router
