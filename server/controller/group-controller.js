const Group = require('../models/group');
const User = require('../models/user');
const Member = require('../models/member');
const { Op } = require('sequelize');
const sequelize = require('../utils/database');

exports.createGroups = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.user;
    const { groupName } = req.body;
    const group = await Group.create({
      groupName: groupName,
      limit: 10,
      creatorId: id,
      userId: id,
    }, { transaction: t });
    await t.commit();
    res.status(201).json(group);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message, msg: 'Error while calling Create Group Api' });
  }
}

exports.getGroups = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.user;
    const groups = await Group.findAll({ where: { userId: id } }, { transaction: t });
    await t.commit();
    res.status(200).json(groups);
  } catch (error) {
    t.rollback();
    res.status(400).json({ error: error.message, msg: 'Error while calling Add Group Api' });
  }
}

exports.editGroup = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const group = await Group.findByPk(id, { transaction: t });
    await t.commit();
    res.status(200).json(group);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message, msg: 'Error while calling Get Group Api' });
  }
}

exports.updateGroup = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const { groupName } = req.body;
    const group = await Group.findByPk(id);
    group.update({
      groupName: groupName,
    }, { transaction: t });
    await t.commit();
    res.status(201).json(group);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message, msg: 'Error while calling Get Group Api' });
  }
}

exports.deleteGroup = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const group = await Group.findByPk(id, { transaction: t });
    group.destroy();
    await t.commit();
    res.status(200).json(group);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message, msg: 'Error While calling Delete Group Api' });
  }
}

exports.getMembers = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.user;
    const users = await User.findAll({
      where: {
        id: {
          [Op.notIn]: [id],
        },
      },
      include: [
        {
          model: Member,
          as: "members",
          where: {
            groupId: req.body.group_id,
          },
          required: false, // To retrieve users even if they don't have any matching members
        },
      ],
    }, { transaction: t });
    await t.commit();
    res.status(200).json(users);
  } catch (error) {
    await t.rollback();
    res
      .status(400)
      .json({
        error: error.message,
        msg: "Error while calling Get Member Api",
      });
  }
};

exports.joinGroups = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.user;
    const myGroups = await Group.findAll({ where: { userId: id } }, { transaction: t });
    const joinedGroups = await Member.findAll({
      where: { userId: id },
      include: Group,
    }, { transaction: t });
    await t.commit();
    res.status(200).json({ myGroups: myGroups, joinedGroups: joinedGroups });
  } catch (error) {
    await t.rollback();
    res
      .status(400)
      .json({
        error: error.message,
        msg: "Error while calling Group Chat Api",
      });
  }
};