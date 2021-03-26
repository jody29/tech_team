const server = require('./index').server
const io = require('socket.io')(server)
const dateFormat = require('dateformat')

const db = require('./connection/db')
const dbName = process.env.DB_NAME

db.initialize(dbName, (dbObject) => {
    dateFormat.masks.chatFormat = 'HH:MM - dd/mm'

    io.on('connection', (socket) => {
        socket.username = 'Anonymous'

        socket.on('new_message', async (data) => {
            try {
                if (data.message == '') return
                await dbObject.collection('chats').updateOne(
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

                io.sockets.emit('new_message', {
                    message: data.message,
                    username: data.username,
                    date: dateFormat(data.date, 'chatFormat'),
                })
            } catch (err) {
                console.log('het ging fout!')
            }
        })

        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', { username: data.username })
        })
    })
})

server.listen(process.env.PORT || 8000)
