import { Router } from 'express'
import * as exportBddController from '../controllers/exportbdd.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { checkRole } from '../middlewares/role.middleware'

const router = Router()

router.get('/', authMiddleware, checkRole(['ROLE_ADMIN']), exportBddController.exportBdd)
router.get('/:id', exportBddController.exportUser)

export default router
