const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Member = sequelize.define('member', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
    }
})

module.exports = Member;