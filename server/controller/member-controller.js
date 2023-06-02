const Member = require('../models/member');
const Group = require('../models/group');
const User = require('../models/user');
const { Op } = require('sequelize');
const sequelize = require('../utils/database');

exports.addMembers = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.user;
        const member = await Member.findAll({
            where: { groupId: req.body.addMemberGroupId },
        }, { transaction: t });
        for (let i = 0; i < member.length; i++) {
          member[i].destroy();
        }
        if (!req.body['members[]']) {
            res.status(200).json({ success: false, msg: 'Please Select Atleast 1 Member' });
        }
        else if (req.body['members[]'].length > 5) {
            res.status(200).json({ success: false, msg: 'You can not select more than 5 Members' });
        } else {
            await Member.create({
                isAdmin: true,
                userId: id,
                groupId: req.body.addMemberGroupId,
            }, { transaction: t });
            let data = [];
            let members = req.body['members[]'];
            for (let i = 0; i < members.length; i++){
                data.push({
                    isAdmin: false,
                    userId: members[i],
                    groupId: req.body.addMemberGroupId,
                });
            }
            const member = await Member.bulkCreate(data);
            await t.commit();
            res.status(201).json({ success: true, msg: 'Members Added Successfully..!' });
        }
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message, msg: 'Error while calling Add Members Api' });
    }
}

exports.getMembers = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const groupId = req.params.id;
        const { id } = req.user;
        const users = await User.findAll({
            include: [
                {
                    model: Member,
                    as: "members",
                    where: {
                        groupId: groupId,
                    },
                    //   required: false, // To retrieve users even if they don't have any matching members
                },
            ],
        }, { transaction: t });
        await t.commit();
        res.status(200).json(users);
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message, msg: 'Error while calling Get Member Api' });
    }
}

exports.makeAdmin = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { userId, groupId } = req.body;
        const user = await Member.findOne({ where: { userId: userId, groupId: groupId } }, { transaction: t });
        user.update({ isAdmin: true });
        await t.commit();
        res.status(200).json(user);
    } catch (error) {
        await t.rollback();
        console.log(error);
    }
}