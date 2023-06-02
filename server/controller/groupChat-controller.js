const groupChat = require('../models/groupChat');
const sequelize = require('../utils/database');

exports.addGroupChat = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.user;
        const { message, groupId } = req.body;
        const chat = await groupChat.create({
            senderId: id,
            message: message,
            userId: id,
            groupId: groupId,
        }, { transaction: t });
        await t.commit();
        res.status(201).json(chat);
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message, msg: 'Error while calling Add Group Chat Api' });
    }
}

exports.loadGroupChats = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { groupId } = req.body;
        const groupChats = await groupChat.findAll({ where: { groupId: groupId } }, { transaction: t });
        await t.commit();
        res.status(200).json(groupChats);
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message, msg: 'Error while calling Load Group Chat Api' });
    }
}

exports.deleteGroupChats = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id;
        const chat = await groupChat.findByPk(id, { transaction: t });
        chat.destroy();
        await t.commit();
        res.status(200).json(chat);
    } catch (error) {
        t.rollback();
        res.status(400).json({ error: error.message, msg: 'Error while calling Delete Group Chat Api' });
    }
}