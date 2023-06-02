const Chat = require('../models/chat');
const sequelize = require('../utils/database');

exports.addChats = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.user;
        const { message, receiverId } = req.body;
        const chat = await Chat.create({
            message: message,
            senderId: id,
            receiverId: receiverId,
            userId: id,
        }, { transaction: t });
        await t.commit();
        res.status(201).json(chat);
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message, msg: 'Error while calling Add Chats Api' });
    }
}

exports.deleteChats = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id;
        const chat = await Chat.findByPk(id, { transaction: t });
        chat.destroy();
        await t.commit();
        res.status(200).json(chat);
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message, msg: 'Error while calling Delete Chat Api' });
    }
}

exports.loadGroupChats = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const chats = await Chat.findAll({ transaction: t });
        await t.commit();
        res.status(200).json(chats);
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message, msg: 'Error while calling Load Group Chats Api' });
    }
}