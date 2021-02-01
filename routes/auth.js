const express = require('express');

const authController = require('../controller/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.post('/register', authController.postRegister);

router.post('/logout', authController.postSignOut);

module.exports = router;