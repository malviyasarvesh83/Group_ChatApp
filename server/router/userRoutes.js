const express = require('express');
const router = express.Router();
const userController = require('../controller/user-controller');
const Authorization = require('../middleware/auth');

router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.get('/dashboard', Authorization.authenticate, userController.dashboard);
router.get('/chatUser/:id', Authorization.authenticate, userController.chatUser);

module.exports = router;