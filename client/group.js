const dashBoard = async () => {
  try {
    const token = localStorage.getItem("token");
    let response = await axios.get("http://localhost:5000/user/dashboard", {
      headers: { Authorization: token },
    });
    console.log(response);
    localStorage.setItem("loginUserId", response.data.response.id);
    document.querySelector(".username a h5").textContent = `Welocme ${response.data.response.name}`;
  } catch (error) {
    console.log(error);
  }
};

dashBoard();

// Create Group
const createGroup = async () => {
    try {
        let groupName = document.getElementById('groupName').value;
        const token = localStorage.getItem('token');
        if (groupName == '') {
            alert('Group Name is Required');
        } else {
            let response = await axios.post('http://localhost:5000/user/createGroup', { groupName: groupName }, { headers: { 'Authorization': token } });
            console.log(response);
            alert('Group Created Successfully..!');
            location.href = 'group.html';
            $('#createGroupModal').modal('hide');
        }
    } catch (error) {
        console.log(error);
    }
}

// Get Groups

const getGroups = async () => {
    try {
        const token = localStorage.getItem('token');
        let response = await axios.get('http://localhost:5000/user/getGroup', { headers: { 'Authorization': token } });
        let response1 = await axios.get('http://localhost:5000/user/joinGroups', { headers: { 'Authorization': token } });
        console.log(response);
        console.log('My Join Groups=', response1);
        showGroups(response,response1);
    } catch (error) {
        console.log(error);
    }
}

getGroups();

// Show Groups
const showGroups = (response,response1) => {
    try {
        for (let i = 0; i < response.data.length; i++){
            document.querySelector(".groups").innerHTML += `
                <li class="list-group-item list-group-item-dark" data-id="${response.data[i].id}" id="${response.data[i].id}" onclick="getChatBox(this)">${response.data[i].groupName}<button class="btn btn-warning ml-2" data-toggle="modal" data-target="#editGroupModal">Edit</button><button class="btn btn-danger ml-2" data-toggle="modal" data-target="#deleteGroupModal">Delete</button></li>
            `;
        }
        for (let i = 0; i < response1.data.joinedGroups.length; i++){
            if (response1.data.myGroups.length == 0) {
                document.querySelector(".groups").innerHTML += `
                    <li class="list-group-item list-group-item-dark" data-id="${response1.data.joinedGroups[i].group.id}" id="${response1.data.joinedGroups[i].group.id}" onclick="getChatBox(this)">${response1.data.joinedGroups[i].group.groupName}<button class="btn btn-warning ml-2" data-toggle="modal" data-target="#editGroupModal">Edit</button><button class="btn btn-danger ml-2" data-toggle="modal" data-target="#deleteGroupModal">Delete</button></li>
                `;
            }
            for (let j = 0; j < response1.data.myGroups.length; j++){
                if (response1.data.joinedGroups[i].group.groupName != response1.data.myGroups[i].groupName) {
                    document.querySelector(".groups").innerHTML += `
                        <li class="list-group-item list-group-item-dark" data-id="${response1.data.joinedGroups[i].group.id}" id="${response1.data.joinedGroups[i].group.id}" onclick="getChatBox(this)">${response1.data.joinedGroups[i].group.groupName}<button class="btn btn-warning ml-2" data-toggle="modal" data-target="#editGroupModal">Edit</button><button class="btn btn-danger ml-2" data-toggle="modal" data-target="#deleteGroupModal">Delete</button></li>
                    `;
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

// Get Chat Box
const getChatBox = async (ele) => {
    try {
        const token = localStorage.getItem('token');
        const id = ele.getAttribute('data-id');
        console.log('My Group Id=', id);
        document.getElementById('groupId').value = id;
        document.getElementById('deleteGroupId').value = id;
        document.getElementById('groupChatId').value = id;
        document.querySelector('.chatBox').style.display = 'block';
        let response = await axios.get(`http://localhost:5000/user/editGroup/${id}`, { headers: { 'Authorization': token } });
        document.getElementById('updateGroupName').value = response.data.groupName;
        document.querySelector('.deleteGroup').textContent = `Are You Sure You Want To Delete This ${response.data.groupName} Group?`;
        loadGroupChat();
    } catch (error) {
        console.log(error);
    }
}

// Update Group
const updateGroup = async () => {
    try {
        const token = localStorage.getItem('token');
        let id = document.getElementById('groupId').value;
        let groupName = document.getElementById('updateGroupName').value;
        if (groupName == '') {
            alert('Group Name is Required..!');
        } else {
            let response = await axios.post(`http://localhost:5000/user/updateGroup/${id}`, {groupName:groupName}, { headers: { 'Authorization': token } });
            console.log(response);
            alert('Group Name Updated Successfully..!');
            location.href = 'group.html';
            $('#editGroupModal').modal('hide');
        }
    } catch (error) {
        console.log(error);
    }
}

// Delete Group
const deleteGroup = async () => {
    try {
        let id = document.getElementById('deleteGroupId').value;
        const token = localStorage.getItem('token');
        let response = await axios.delete(`http://localhost:5000/user/deleteGroup/${id}`, { headers: { 'Authorization': token } });
        console.log('Delete Group Response=',response);
        alert(`${response.data.groupName} Group Deleted Successfully..!`);
        $('#deleteGroupModal').modal('hide');
        location.href = 'group.html';
    } catch (error) {
        console.log(error);
    }
}

const addMembers = async () => {
    try {
        let id = document.getElementById('groupId').value;
        console.log('My Add member group id=', id);
        document.getElementById('addMemberGroupId').value = id;
        const token = localStorage.getItem("token");
        let response = await axios.post("http://localhost:5000/user/getMembers", { group_id: id }, {
          headers: { Authorization: token },
        });
        console.log(response);
        let html = "";
        for (let i = 0; i < response.data.length; i++) {
          let isGroupMember = response.data[i].members.length > 0 ? true : false;
          html += "<tr>";
          html += `<td> <input type="checkbox" `+ (isGroupMember?'checked':'') +` name="members[]" class="check" id="check" value="${response.data[i].id}" /> </td>`;
          html += "<td>" + response.data[i].name + "</td>";
          html += "</tr>";
        }
        document.getElementById("crudTable").innerHTML = html;
    } catch (error) {
        console.log(error);
    }
}

// Add Members Group
$('#add-member-form').submit( async (event) => {
    try {
        event.preventDefault();
        let formData = $('#add-member-form').serialize();
        const token = localStorage.getItem('token');
        console.log('My Form Data=', formData);
        $.ajax({
            url: 'http://localhost:5000/user/addMembers',
            type: 'POST',
            headers: { 'Authorization': token },
            data: formData,
            success: (response) => {
                if (response.success == true) {
                    alert(response.msg);
                    $('#addMemberModal').modal('hide');
                } else {
                    document.querySelector('.error').textContent = response.msg;
                    setTimeout(() => {
                        document.querySelector('.error').textContent = '';
                    }, 3000);
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
})

// Get Members
const getMembers = async () => {
    try {
        let id = document.getElementById('groupId').value;
        const token = localStorage.getItem('token');
        let response = await axios.get(`http://localhost:5000/user/getMembers/${id}`, { headers: { 'Authorization': token } });
        console.log(response);
        let html = "";
        for (let i = 0; i < response.data.length; i++){
            let isGroupAdmin = response.data[i].members[0].isAdmin ? true : false;
            html += "<tr>";
            html += "<td>" + response.data[i].name + "</td>";
            html += `<td>` + (isGroupAdmin?'<p>Admin</p>':'<button class="btn btn-warning" id="admin-btn" data-id='+ response.data[i].id +' onclick="makeAdmin(this)">Make Admin</button>') +` </td>`;
            html += "</tr>";
        }
        document.getElementById('memberTable').innerHTML = html;
    } catch (error) {
        console.log(error);
    }
}

// Make Admin
const makeAdmin = async (ele) => {
    try {
        const token = localStorage.getItem('token');
        let userId = ele.getAttribute('data-id');
        let groupId = document.getElementById('groupId').value;
        let response = await axios.post(`http://localhost:5000/user/makeAdmin`, { userId: userId, groupId: groupId }, { headers: { 'Authorization': token } });
        console.log(response);
        document.getElementById('admin-btn').style.display = 'none';
        $('#getMemberModal').modal('hide');
    } catch (error) {
        console.log(error);
    }
}

let socket = io('http://localhost:7000/user-namespace', { auth: { token1: localStorage.getItem('loginUserId') } });

// Send Message
const sendMessage = async () => {
    try {
        const token = localStorage.getItem('token');
        let message = document.getElementById('message').value;
        let groupId = document.getElementById('groupChatId').value;
        if (message == '') {
            alert('Type Something..');
        } else {
            let response = await axios.post('http://localhost:5000/user/groupChat', { message: message, groupId: groupId }, { headers: { 'Authorization': token } });
            console.log(response);
            localStorage.setItem("senderId", response.data.senderId);
            document.getElementById('message').value = '';
            document.querySelector(".chat-container").innerHTML += `
                <div class="my-chat" id="${response.data.id}">
                    <h5>
                        <span>${response.data.message}</span>
                        <i class="fas fa-trash" data-id="${response.data.id}" onclick="deleteGroupChat(this)"></i>
                    </h5>
                </div>
            `;
            socket.emit('newGroupChat', response.data);
            scrollChat();
        }
    } catch (error) {
        console.log(error);
    }
}

// Scroll Chat
const scrollChat = () => {
  document.querySelector(".chat-container").scroll({
    top: document.querySelector(".chat-container").scrollHeight,
    behavior: "smooth",
  });
};

// Load New Group Chat
socket.on('loadNewGroupChat', (data) => {
    document.querySelector(".chat-container").innerHTML += `
        <div class="other-chat" id="${data.id}">
            <h5>
                <span>${data.message}</span>
                <i class="fas fa-trash" data-id="${data.id}" onclick="deleteGroupChat(this)"></i>
            </h5>
        </div>
    `;
    scrollChat();
})

// Load Group Chats
const loadGroupChat = async () => {
    try {
        let groupId = document.getElementById('groupId').value;
        const token = localStorage.getItem('token');
        let response = await axios.post('http://localhost:5000/user/loadGroupChat', { groupId: groupId }, { headers: { 'Authorization': token } });
        console.log('My Load Group Chat=', response);
        let chats = response.data;
        let html = "";
        let className;
        for (let i = 0; i < chats.length; i++) {
          if (chats[i].senderId == localStorage.getItem("loginUserId")) {
            className = "my-chat";
          } else {
            className = "other-chat";
          }
          html += `
        <div class="${className}" id="${chats[i].id}">
          <h5>
            <span>${chats[i].message}</span>
            <i class="fas fa-trash" data-id="${chats[i].id}" onclick="deleteGroupChat(this)"></i>
          </h5>
        </div>
      `;
        }
        $(".chat-container").html(html);
        scrollChat();
    } catch (error) {
        console.log(error);
    }
}

// Modal Hidden
$('#createGroupModal').on('hidden.bs.modal', () => {
    document.getElementById('groupName').value = '';
})

$('#editGroupModal').on('hidden.bs.modal', () => {
    document.getElementById('updateGroupName').value = '';
})

// Delete Group Chat
const deleteGroupChat = async (ele) => {
    try {
        let ans = confirm('Are you sure you want to delete this message?');
        if (ans == true) {
            const id = ele.getAttribute("data-id");
            console.log("My Delete Chat GroupId=", id);
            const token = localStorage.getItem("token");
            let response = await axios.delete(
              `http://localhost:5000/user/deleteGroupChat/${id}`,
              { headers: { Authorization: token } }
            );
            console.log(response);
            loadGroupChat();
            socket.emit('groupChatDeleted', id);
        }
    } catch (error) {
        console.log(error);
    }
}

socket.on('groupMessageDeleted', (id) => {
    loadGroupChat();
    $('#'+id).remove();
})