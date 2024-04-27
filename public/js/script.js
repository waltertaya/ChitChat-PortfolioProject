document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.querySelector('.input-box button');
    const messageInput = document.querySelector('.input-box input');
    const chatBox = document.querySelector('.chat-box');

    sendButton.addEventListener('click', () => {
        const messageContent = messageInput.value.trim();
        if (messageContent !== '') {
            const newMessage = document.createElement('div');
            newMessage.classList.add('user-message');
            newMessage.innerHTML = `
                <div class="message sent">
                    <div class="text">${messageContent}</div>
                </div>
            `;
            chatBox.appendChild(newMessage);
            messageInput.value = '';
        }
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
});
