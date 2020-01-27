let socketIO = io(); //Initiera socket.io

const usernameElem = document.querySelector('#message');
const submitButton = document.querySelector('#submit');
const chatMessageInput = document.querySelector('#chat-message');
const sendButton = document.querySelector('#send');
const login = document.querySelector('.login');
const chat = document.querySelector('.chat');
let chatArea = document.querySelector('.chat-area');


//Functions

function showChat() {
    login.classList.add('hide');
    chat.classList.add('show');
}

function addTypingMessage(username) {
    const typingElem = document.querySelector('.typingMessage');
    typingElem.innerHTML = username + ' is typing';
};

function removeTypingMessage() {
    const typingElem = document.querySelector('.typingMessage');
    
    setTimeout(() => {
        typingElem.innerHTML = ' ';
    }, 1000);  
}

function addChatMessage(message) {
    let chatMessage = document.createElement('p');
    chatMessage.innerHTML = message;
    chatArea.append(chatMessage);
}

function reset() {
    chatMessageInput.value = '';
}

//Event listeners

submitButton.addEventListener('click', () => {
    const username = usernameElem.value;
    socketIO.emit('join', username);

    showChat();
});

sendButton.addEventListener('click', () => {
    const message = chatMessageInput.value;
    socketIO.emit('new message', message);

    reset();
});

chatMessageInput.addEventListener('keydown', () => {
    socketIO.emit('typing');
});

chatMessageInput.addEventListener('keyup', () => {
    socketIO.emit('stop typing');
});

//Socket.IO event listeners

socketIO.on('user joined', (username) => {
    const chatMessage = username + ' joined the chat';
    addChatMessage(chatMessage);
});

socketIO.on('send message', (message) => {
    addChatMessage(message);
});

socketIO.on('is typing', (username) => {
    addTypingMessage(username);
});

socketIO.on('not typing', (username) => {
    removeTypingMessage();
});