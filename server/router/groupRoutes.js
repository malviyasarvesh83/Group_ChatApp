const express = require('express');
const router = express.Router();
const groupController = require('../controller/group-controller');
const Authorization = require('../middleware/auth');

router.post('/createGroup', Authorization.authenticate, groupController.createGroups);
router.get('/getGroup', Authorization.authenticate, groupController.getGroups);
router.get('/editGroup/:id', Authorization.authenticate, groupController.editGroup);
router.post('/updateGroup/:id', Authorization.authenticate, groupController.updateGroup);
router.delete('/deleteGroup/:id', Authorization.authenticate, groupController.deleteGroup);
router.post('/getMembers', Authorization.authenticate, groupController.getMembers);
router.get('/joinGroups', Authorization.authenticate, groupController.joinGroups);

module.exports = router;