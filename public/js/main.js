// Global var(s)
var socket = io()
const chatForm = document.querySelector('#chat-form')
const messages = document.querySelector('.chat-messages')

// Pegando o username e a sala do usuário na URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// Notificando que um novo usuário entrou na sala
socket.emit('joinRoom', {username, room})

// Listando os eventos e enviando para o server
socket.on('roomUsers', (({room, users}) => {
    document.querySelector('#room-name').textContent = room

    // Actualizando a lista de usuário online
    const usersList = document.querySelector('#users')
    usersList.innerHTML = users.map(user => `<li><i class="fas fa-user"></i> ${user.username}</li>`).join('')
}))

// Pegando a mensagem do backend
socket.on('message', message => {
    outputMessages(message)
})

chatForm.addEventListener('submit', function(e) {
    e.preventDefault()
    const msg = e.target.elements.msg

    // Enviando a mensagem no server
    socket.emit('chatMessage', msg.value)
    msg.value = ''
    msg.focus()
})

// Exibindo a mensagem no frontend
function outputMessages(msg) {
    var html = ''
    html += '<div class="message">'
    html += '<p class="meta">' + msg.username + ' <span>' + msg.time +'</span></p>'
    html += '<p class="text">' + msg.text +'</p>'
    html += '</div>'

    messages.insertAdjacentHTML('beforeend', html)

    document.querySelector('.message:last-child').scrollIntoView({
        behavior: 'smooth'
    })
}
