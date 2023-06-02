const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const { Op } = require('sequelize');
const io = require('socket.io')(7000, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT;

// Import Models
const User = require('./models/user');
const Chat = require('./models/chat');
const Group = require('./models/group');
const Member = require('./models/member');
const groupChat = require('./models/groupChat');

// Import Routes
const userRoutes = require('./router/userRoutes');
const chatRoutes = require('./router/chatRoutes');
const groupRoutes = require('./router/groupRoutes');
const memberRoutes = require('./router/memberRoutes');
const groupChatRoutes = require('./router/groupChatRoutes');

app.listen(port, () => {
    console.log(`Server is Successfully running on port http://localhost:${port}`);
    database();
})

// Database Connection
const database = async () => {
    try {
        await sequelize.sync();
        console.log('Database Connected Successfully..!');
    } catch (error) {
        console.log('Error while connecting Database', error.message);
    }
}

// Database Relations
User.hasMany(Chat);
Chat.belongsTo(User);
User.hasMany(Group);
Group.belongsTo(User);
User.hasMany(Member);
Group.hasMany(Member);
Member.belongsTo(User);
Member.belongsTo(Group);
User.hasMany(groupChat);
Group.hasMany(groupChat);
groupChat.belongsTo(User);
groupChat.belongsTo(Group);

// Routes
app.use('/user', userRoutes, chatRoutes, groupRoutes, memberRoutes, groupChatRoutes);


// Socket Connection
let usp = io.of('user-namespace');

usp.on('connection', async (socket) => {
  console.log('User Connected');
  const id = socket.handshake.auth.token1;
  const user = await User.findOne({ where: { id: id } });
  user.update({ isOnline: true });

  // User broadcast Online status
  socket.broadcast.emit('getOnlineUser', { id: id });

  socket.on('disconnect', async () => {
    console.log('User DisConnected');
    const id = socket.handshake.auth.token1;
    const user = await User.findOne({ where: { id: id } });
    user.update({ isOnline: false });
      
    // User broadcast Offline status
    socket.broadcast.emit('getOfflineUser', { id: id });
  })

  // New Chat
  socket.on('newChat', (data) => {
    socket.broadcast.emit('loadNewChat', data);
  })

  // Load Exists Chat
  socket.on('existsChat', async (data) => {
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { senderId: data.senderId, receiverId: data.receiverId },
          { senderId: data.receiverId, receiverId: data.senderId },
        ],
      },
    });
    socket.emit('loadChats', chats);
  })

  // Delete Chat
  socket.on('chatDeleted', (id) => {
    socket.broadcast.emit('chatMessageDeleted', id);
  })
  
  // New Group Chat
  socket.on('newGroupChat', (data) => {
    socket.broadcast.emit('loadNewGroupChat', data);
  })

  // Group Chat Delete
  socket.on('groupChatDeleted', (id) => {
    socket.broadcast.emit('groupMessageDeleted', id);
  })
})