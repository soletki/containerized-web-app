const socket = io();
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('messageInput');
const chat = document.getElementById('chat');
const sendBtn = document.getElementById('sendBtn');

function addMessage(messageData) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${messageData.username}: ${messageData.message}`;
    chat.appendChild(messageElement);
    chat.scrollTop = chat.scrollHeight;
}

socket.on('initMessages', (messages) => {
    messages.forEach(addMessage);
});

socket.on('newMessage', addMessage);

sendBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const message = messageInput.value.trim();

    if (username && message) {
        socket.emit('sendMessage', { username, message });
        messageInput.value = '';
    }
});