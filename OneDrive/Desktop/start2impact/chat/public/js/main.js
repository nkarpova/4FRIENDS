

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
var feedback = document.querySelector('#feedback');
var msg = document.querySelector("#msg");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

//join chatroom
socket.emit('joinRoom',{username,room});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});



//message from server
socket.on('message',message =>{
  console.log(message);
  outputMessage(message);

  // Scroll down
chatMessages.scrollTop = chatMessages.scrollHeight;
});
//message submit
chatForm.addEventListener('submit',e => {
  e.preventDefault();

//get message text
  const msg= e.target.elements.msg.value;


  //emit message to Server
  socket.emit('chatMessage',msg);

  //clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//output message to dom
function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time} </span></p>
  <p class="text">
  ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
  feedback.innerHTML="";
}


// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}

// Emissione di "utente x sta scrivendo..."
msg.addEventListener("keypress", () =>{
    socket.emit('typing', username);
    console.log(username);
});

  //listen for events
  // socket.on('chatMessage', data =>{
  //   feedback.innerHTML="";
  // });
	// Ascolto di "utente x sta scrivendo..."

    socket.on('typing',(username) => {
  	feedback.innerHTML = '<p><em>' + username + ' is typing a message...</em></p>';
	});
