const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Group = sequelize.define('group', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    groupName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    limit: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    creatorId: {
        type: Sequelize.STRING,
        allowNull:false,
    }
})

module.exports = Group;