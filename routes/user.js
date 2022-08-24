import { Router } from 'express'
import {
    blockUsers,
    deleteUsers,
    getUsers,
    removeAdminRoleUsers,
    setAdminRoleUsers,
    unblockUsers
} from "../logics/user.js";
import {checkAuth} from "../middleware/checkAuth.js";

const router = new Router()

router.get('/', getUsers)
router.post('/block', checkAuth, blockUsers)
router.post('/unblock', checkAuth, unblockUsers)
router.post('/setadmin', checkAuth, setAdminRoleUsers)
router.post('/removeadmin', checkAuth, removeAdminRoleUsers)
router.post('/delete', checkAuth, deleteUsers)

export default router