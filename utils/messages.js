const moment = require('moment')

function formatMessage (username, text) {
	// Retornando o username, o texto e a hora da mensagem
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage
