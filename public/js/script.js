import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
    databaseURL: "https://playground-abcd3-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const chatsInDB = ref(database, 'chats/' + userID);

const chatBox = document.querySelector('.chat-box');
const inputBox = document.querySelector('.input-box');
const input = inputBox.querySelector('input');
const button = inputBox.querySelector('button');

button.addEventListener('click', () => {
    const message = input.value;
    if (message) {
        input.value = '';
        push(chatsInDB, { message, type: 'sent' });

        fetch('/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userMessage: message })
        })
            .then(response => response.json())
            .then(data => {
                push(chatsInDB, { message: data.AI, type: 'received' });
            })
            .catch(error => console.error(error));
    }
});

let renderedMessages = {};

onValue(chatsInDB, (snapshot) => {
    const data = snapshot.val();
    const keys = Object.keys(data);
    keys.forEach((key) => {
        if (!renderedMessages[key]) {
            const message = data[key];
            const messageType = message.type === 'received' ? 'received' : 'sent';

            const messageElement = document.createElement('div');
            messageElement.classList.add('message', messageType);
            const text = document.createElement('div');
            text.classList.add('text');
            text.textContent = message.message;
            messageElement.appendChild(text);

            chatBox.appendChild(messageElement);
            renderedMessages[key] = true;
        }
    });
});


