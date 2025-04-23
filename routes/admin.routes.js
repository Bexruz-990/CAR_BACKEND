const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {adminMiddleware} = require("../middleware/admin")
const { validateId } = require("../validation/admin.validation");
const {
    getAllUsers,
    updateUserRole,
    deleteUser,
} = require("../controller/admin.controller");

router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.put('/users/:id/role', authMiddleware, adminMiddleware, validateId, updateUserRole);
router.delete('/users/:id', authMiddleware, adminMiddleware, validateId, deleteUser);

module.exports = router;