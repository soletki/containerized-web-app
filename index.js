const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/publicChatApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

const messageSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', messageSchema);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    Message.find().sort({ timestamp: 1 }).limit(50).then((messages) => {
        socket.emit('initMessages', messages);
    });

    socket.on('sendMessage', (data) => {
        const { username, message } = data;

        const newMessage = new Message({ username, message });
        newMessage.save().then(() => {
            io.emit('newMessage', newMessage);
        }).catch((err) => {
            console.error('Error saving message:', err);
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
