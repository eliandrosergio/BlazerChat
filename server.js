// Global var(s)
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')

const botName = 'Chat Bot'
const port = process.env.PORT || 4000

// Redirencionando a pasta do arquivo index
app.use(express.static('public'))

// Notificando a entranda de novos usuários
io.on('connection', (socket) => {

	// Listando os novos usuário na sala
	socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room)

        // Mensagem de Bem-vindo(a) do Chat bot
        socket.emit('message', formatMessage(botName, 'Seja bem-vindo(a) ao BlazerChat!'))

		// Notificando que tem novo usuário na sala
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} entrou no Chat.`))

        // Enviando as informações atualizadas dos usuário ao frontend
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

	// Listando o envio de nova mensagem no chat
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    // Notificando que um usuário saiu da sala
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} saiu do Chat.`))
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

http.listen(port, () => {
    console.log(`Server rodando em http://localhost:${port}/`)
})
