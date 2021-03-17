const server = require('./index').server
const io = require('socket.io')(server)
const dateFormat = require('dateformat')

const db = require('./connection/db')
const dbName = process.env.DB_NAME
const collectionUsers = 'users'
const collectionChat = 'chat'

db.initialize(dbName, collectionChat, (dbCollection) => {
    dateFormat.masks.chatFormat = 'HH:MM - dd/mm'

    io.on('connection', (socket) => {
        socket.username = 'Anonymous'

        socket.on('message_send', async (data) => {
            try {
                if (data.message == '') return
                await dbCollection.updateOne(
                    { chatNumber: parseInt(data.chatId) },
                    {
                        $push: {
                            messages: {
                                message: data.message,
                                userId: data.userId,
                                date: dateFormat(data.date, 'chatFormat'),
                            },
                        },
                    }
                )

                io.sockets.emit('message_send', {
                    message: data.message,
                    username: data.username,
                    date: dateFormat(data.date, 'chatFormat'),
                })
            } catch (err) {
                console.log(err)
            }
        })

        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', { username: data.username })
        })
    })
})
