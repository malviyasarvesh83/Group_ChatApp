const dashBoard = async () => {
    try {
        const token = localStorage.getItem('token');
        let response = await axios.get('http://localhost:5000/user/dashboard', { headers: { 'Authorization': token } });
        console.log(response);
        localStorage.setItem('loginUserId', response.data.response.id);
        document.querySelector('.username a h5').textContent = `Welocme ${response.data.response.name}`;
        for (let i = 0; i < response.data.users.length; i++){
            if (response.data.users[i].isOnline == true) {
                document.querySelector(".list-group").innerHTML += `
                    <li class="list-group-item list-group-item-dark" data-id="${response.data.users[i].id}" onclick="getChatBox(this)">
                        ${response.data.users[i].name}
                        <sub class="online-status">Online</sub>
                    </li>
                `;
            } else {
                document.querySelector(".list-group").innerHTML += `
                    <li class="list-group-item list-group-item-dark" data-id="${response.data.users[i].id}" onclick="getChatBox(this)">
                        ${response.data.users[i].name}
                        <sub class="offline-status">Offline</sub>
                    </li>
                `;
            }
        }
        socketBroadcast();
    } catch (error) {
        console.log(error);
    }
}

dashBoard();

let socket = io('http://localhost:7000/user-namespace', { auth: { token1: localStorage.getItem('loginUserId') } });

const socketBroadcast = () => {
    try {
        socket.on("getOnlineUser", (data) => {
          document.querySelector(".offline-status").textContent = "Online";
          document
            .querySelector(".offline-status")
            .classList.add("online-status");
          document
            .querySelector(".offline-status")
            .classList.remove("offline-status");
        });
        socket.on("getOfflineUser", (data) => {
          document.querySelector(".online-status").textContent = "Offline";
          document
            .querySelector(".online-status")
            .classList.add("offline-status");
          document
            .querySelector(".online-status")
            .classList.remove("online-status");
        });
    } catch (error) {
        console.log(error);
    }
}

const getChatBox = async (ele) => {
    try {
        const token = localStorage.getItem('token');
        let id = ele.getAttribute('data-id');
        localStorage.setItem('chatReceiverId', id);
        document.querySelector('.start-head').style.display = 'none';
        document.querySelector('.chat-box').style.display = 'block';
        socket.emit('existsChat', { senderId: localStorage.getItem('loginUserId'), receiverId: id });
        socket.on("loadChats", (chats) => {
          document.querySelector(".chat-section").innerHTML = "";
          console.log("My Old Chats=", chats);
          for (let i = 0; i < chats.length; i++) {
            let addClass = "";
            if (chats[i].senderId == localStorage.getItem("loginUserId")) {
              addClass = "my-chat";
            } else {
              addClass = "other-chat";
            }
            document.querySelector(".chat-section").innerHTML += `
                <div class="${addClass}" id="${chats[i].id}">
                    <h5>
                        <span>${chats[i].message} <i class="fas fa-trash" onclick="deleteChat(${chats[i].id})" data-toggle="modal" data-target="#deleteChatModal"></i></span>
                    </h5>
                </div>
            `;
            scrollChat();
          }
        });
        let response = await axios.get(`http://localhost:5000/user/chatUser/${id}`, { headers: { 'Authorization': token } });
        console.log('My Chat User=', response);
        document.querySelector('.chat-user').textContent = response.data.name;
    } catch (error) {
        console.log(error);
    }
}

const sendMessage = async () => {
    try {
        const token = localStorage.getItem('token');
        let message = document.getElementById('message').value;
        if (message == '') {
            alert('Type Something..!');
        } else {
            let response = await axios.post('http://localhost:5000/user/addChat', { message: message, receiverId: localStorage.getItem('chatReceiverId') }, { headers: { 'Authorization': token } });
            console.log(response);
            document.getElementById('message').value = '';
            document.querySelector(".chat-section").innerHTML += `
                <div class="my-chat">
                    <h5>
                        <span>${response.data.message} <i class="fas fa-trash" onclick="deleteChat(${response.data.id})" data-toggle="modal" data-target="#deleteChatModal"></i></span>
                    </h5>
                </div>
            `;
            socket.emit('newChat', response.data);
            scrollChat();
        }
    } catch (error) {
        console.log(error);
    }
}

// Scroll Chat
const scrollChat = () => {
  document.querySelector(".chat-section").scroll({
    top: document.querySelector(".chat-section").scrollHeight,
    behavior: "smooth",
  });
}

socket.on("loadNewChat", (data) => {
    console.log('My new Chat=',data);
  if (localStorage.getItem('loginUserId') == data.receiverId && localStorage.getItem('chatReceiverId') == data.senderId) {
    document.querySelector(".chat-section").innerHTML += `
        <div class="other-chat">
            <h5>
             <span>${data.message} <i class="fas fa-trash" onclick="deleteChat(${data.id})" data-toggle="modal" data-target="#deleteChatModal"></i></span>
            </h5>
        </div>
    `;
    scrollChat();
  }
})

// Delete Chats
const deleteChat = async (id) => {
    try {
        localStorage.setItem('deleteChatId', id);
        console.log('My Delete Chat Id=',id);
    } catch (error) {
        console.log(error);
    }
}

const deleteChatId = async () => {
    try {
        let chatId = localStorage.getItem('deleteChatId');
        const token = localStorage.getItem('token');
        let response = await axios.delete(`http://localhost:5000/user/deleteChat/${chatId}`, { headers: { 'Authorization': token } });
        console.log(response);
        socket.emit('chatDeleted', chatId);
        // socket.on('chatMessageDeleted', (id) => {
        //     $('#'+id).remove();
        // })
        $('#deleteChatModal').modal('hide');
        document.querySelector('.chat-section').innerHTML = '';
        let response1 = await axios.get('http://localhost:5000/user/loadGroupChat', { headers: { 'Authorization': token } });
        console.log('My Chats After Delete=', response1);
        for (let i = 0; i < response1.data.length; i++){
            let addClass = "";
            if (response1.data[i].senderId == localStorage.getItem("loginUserId")) {
              addClass = "my-chat";
            } else {
              addClass = "other-chat";
            }
            document.querySelector(".chat-section").innerHTML += `
                  <div class="${addClass}" id="${response1.data[i].id}">
                      <h5>
                          <span>${response1.data[i].message} <i class="fas fa-trash" onclick="deleteChat(${response1.data[i].id})" data-toggle="modal" data-target="#deleteChatModal"></i></span>
                      </h5>
                  </div>
              `;
            scrollChat();
        }
    } catch (error) {
        console.log(error);
    }
}

socket.on("chatMessageDeleted", (id) => {
  $("#" + id).remove();
});