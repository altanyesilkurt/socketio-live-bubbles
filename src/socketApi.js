const socketio = require('socket.io');
const io = socketio();

const socketApi = {};
socketApi.io = io;

const users = {}
const randomColor = require('../helpers/randomColor')

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('newUser', (data) => {
        const defaultData = {
            id: socket.id,
            position: {
                x: 0,
                y: 0
            },
            color: randomColor()
        }
        const userData = Object.assign(data, defaultData);
        users[socket.id] = userData;
        socket.broadcast.emit('newUser', userData)
        socket.emit('initPlayers', users);
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('disUser', users[socket.id])
        delete users[socket.id];
    })
    socket.on('animate', (data) => {
        console.log(users)
        users[socket.id].position.x = data.x;
        users[socket.id].position.y = data.y;
        console.log(users)

        socket.broadcast.emit('animate', {socketId: socket.id, x: data.x, y: data.y})
    })
})

module.exports = socketApi;