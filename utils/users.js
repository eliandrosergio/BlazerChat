const users = []

//Join user to chat
function userJoin (id, username, room) {
    const user = {id, username, room}

    users.push(user)

    return user
}

// Enviando o usuário actual
function getCurrentUser (id) {
    return users.find(user => user.id === id)
}

// Levando os usuário a sala
function userLeave (id) {
    const index = users.findIndex(user => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

// Enviando a sala dos usuários
function getRoomUsers (room) {
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}
