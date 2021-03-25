// const mongo = require('mongodb')
// const ObjectID = mongo.ObjectID
// // Use database connection from server.js
// const db = require('../connection/db')
// const dbName = process.env.DB_NAME

// db.initialize(
//     dbName,
//     (dbObject) => {
//         const createChat = async (id, otherId) => {
//             try {
//                 const lastChat = await dbObject
//                     .collection('chats')
//                     .findOne({}, { sort: { chatNumber: -1 }, limit: 1 })
//                 const chatNumber =
//                     lastChat === null ? 0 : lastChat.chatNumber + 1
//                 await dbObject.collection('chats').insertOne({
//                     chatNumber: chatNumber,
//                     users: [id, otherId],
//                     messages: [],
//                 })
//                 await dbObject
//                     .collection('users')
//                     .updateOne(
//                         { _id: ObjectID(id) },
//                         { $push: { chats: chatNumber } }
//                     )
//                 await dbObject
//                     .collection('users')
//                     .updateOne(
//                         { _id: ObjectID(otherId) },
//                         { $push: { chats: chatNumber } }
//                     )
//                 return chatNumber
//             } catch (err) {
//                 console.error(err)
//             }
//         }

//         const removeChat = async (chat) => {
//             try {
//                 const users = chat.users
//                 await dbObject
//                     .collection('chats')
//                     .deleteOne({ chatNumber: chat.chatNumber })
//                 // Delete chat for the users
//                 users.forEach(async (user) => {
//                     await db
//                         .collection('users')
//                         .updateOne(
//                             { _id: ObjectID(user) },
//                             { $pull: { chats: chat.chatNumber } }
//                         )
//                 })
//             } catch (err) {
//                 console.error(err)
//             }
//         }

async function getUserChats(user) {
    const chatList = []
    user.chats.forEach((chat) => {
        chatList.push(db.collection('chats').findOne({ chatNumber: chat }))
    })

    const allChats = await Promise.all(chatList)
    if (allChats.length > 0) {
        for (let i = 0; i < allChats.length; i++) {
            const userList = []
            allChats[i].users.forEach((user) => {
                userList.push(
                    db.collection('users').findOne({ _id: new ObjectID(user) })
                )
            })
            allChats[i].users = await Promise.all(userList)
        }
        return allChats
    } else {
        return []
    }
}

//         module.exports = {
//             // removeChat,
//             // createChat,
//             getUserChats,
//         }
//     },
//     (err) => {
//         throw err
//     }
// )
