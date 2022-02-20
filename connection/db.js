const MongoClient = require('mongodb').MongoClient

const dbConnectionUrl = 'mongodb+srv://team_music:Rt1l4xdsBJqubpi6@musicmatch.pzvvt.mongodb.net/Musicmatch?retryWrites=true&w=majority'
let connection
const initialize = (dbName, successCallback, failureCallback) => {
    if (connection) {
        successCallback(connection)
        return
    }
    MongoClient.connect(dbConnectionUrl, (err, dbInstance) => {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`)
            failureCallback(err)
        } else {
            const dbObject = dbInstance.db(dbName)
            connection = dbObject
            console.log('[MongoDB connection] SUCCES')
            successCallback(dbObject)
        }
    })
}

module.exports = {
    initialize,
}
