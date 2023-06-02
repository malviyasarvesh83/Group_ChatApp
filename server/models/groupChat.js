const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const groupChat = sequelize.define('groupchat', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    senderId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

module.exports = groupChat;