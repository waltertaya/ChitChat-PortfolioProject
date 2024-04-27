const{ Schema, model } = require('mongoose');

const chatSchema = new Schema({
    username: { type: String, required: true },
    messages: [{
        sender: { type: String, enum: ['ai', 'user'] },
        content: { type: String, required: true }
    }]
});

const Chat = model('Chat', chatSchema);

module.exports = Chat;
