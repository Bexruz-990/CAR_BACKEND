const express = require('express');
const router = express.Router();

const  chekAdmin = require("../middleware/admin");
const { validateId } = require('../validation/admin.validation');
const { getAllUsers, updateUserRole, deleteUser } = require('../controller/admin.controller');


router.get("/users", chekAdmin,   getAllUsers);
router.put('/users/:id/role', chekAdmin,  validateId, updateUserRole);
router.delete('/users/:id', chekAdmin,  validateId, deleteUser);

module.exports = router;
