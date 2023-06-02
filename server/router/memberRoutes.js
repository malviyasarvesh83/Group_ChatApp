const express = require('express');
const router = express.Router();
const memberController = require('../controller/member-controller');
const Authorization = require('../middleware/auth');

router.post('/addMembers', Authorization.authenticate, memberController.addMembers);
router.get('/getMembers/:id', Authorization.authenticate, memberController.getMembers);
router.post('/makeAdmin', Authorization.authenticate, memberController.makeAdmin);

module.exports = router;