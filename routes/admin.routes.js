const express = require('express');
const router = express.Router();
const {authMiddleware} = require("../middleware/auth.middleware");
const { AdminOrSuperadminMiddleware } = require("../middleware/admin");
const { validateId } = require("../validation/admin.validation");
const {getAllUsers, updateUserRole, deleteUser} = require("../controller/admin.controller");
router.get('/users', authMiddleware, AdminOrSuperadminMiddleware, getAllUsers);
router.put('/users/:id/role', authMiddleware, AdminOrSuperadminMiddleware, validateId, updateUserRole);
router.delete('/users/:id', authMiddleware, AdminOrSuperadminMiddleware, validateId, deleteUser);

module.exports = router;
