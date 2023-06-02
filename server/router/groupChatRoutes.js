const express = require('express');
const router = express.Router();
const groupChatController = require('../controller/groupChat-controller');
const Authorization = require('../middleware/auth');

router.post('/groupChat', Authorization.authenticate, groupChatController.addGroupChat);
router.post('/loadGroupChat', Authorization.authenticate, groupChatController.loadGroupChats);
router.delete('/deleteGroupChat/:id', Authorization.authenticate, groupChatController.deleteGroupChats);

module.exports = router;