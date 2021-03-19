// const mongo = require('mongodb')
// const ObjectId = mongo.ObjectID

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

//         // Removes a chat from the chats collection and from the array of chats for the users that are in the chat
//         const removeChat = async (chat) => {
//             try {
//                 const users = chat.users
//                 // Delete the chat
//                 await dbObject
//                     .collection('chats')
//                     .deleteOne({ chatNumber: chat.chatNumber })
//                 // Delete chat for the users
//                 users.forEach(async (user) => {
//                     await dbObject
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

//         const getUserChats = async (user) => {
//             const chatList = []
//             user.chats.forEach((chat) => {
//                 chatList.push(
//                     dbObject.collection('chats').findOne({ chatNumber: chat })
//                 )
//             })

//             const allChats = await Promise.all(chatList)
//             if (allChats.length > 0) {
//                 for (let i = 0; i < allChats.length; i++) {
//                     const userList = []
//                     allChats[i].users.forEach((user) => {
//                         userList.push(
//                             dbObject
//                                 .collection('users')
//                                 .findOne({ _id: new ObjectID(user) })
//                         )
//                     })
//                     allChats[i].users = await Promise.all(userList)
//                 }
//                 return allChats
//             } else {
//                 return []
//             }
//         }
//     },
//     (err) => {
//         throw err
//     }
// )

// module.exports = {
//     removeChat,
//     createChat,
//     getUserChats,
// }
