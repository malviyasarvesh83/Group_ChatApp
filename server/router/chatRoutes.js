const express = require('express');
const router = express.Router();
const chatController = require('../controller/chat-controller');
const Authorization = require('../middleware/auth');

router.post('/addChat', Authorization.authenticate, chatController.addChats);
router.delete('/deleteChat/:id', Authorization.authenticate, chatController.deleteChats);
router.get('/loadGroupChat', Authorization.authenticate, chatController.loadGroupChats);

module.exports = router;